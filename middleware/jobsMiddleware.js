const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Jobs = require("../models/Jobs");

//check current job
const getJobs = async (req, res, next) => {
   const token = req.cookies.jwt; //get token from the cookies

   if (token) {
      const userId = jwt.decode(token).id;

      console.log(userId);
      const user = await User.findById(userId);
      const userJobs = await Jobs.find({ userId: String(user._id) });
      res.locals.jobs = userJobs;
      next();
   } else {
      res.locals.jobs = null;
      next();
   }
};

const getJob = async (req, res, next) => {
   const jobId = req.params["id"];
   try {
      res.locals.job = await Jobs.findById(jobId);
      next();
   } catch (e) {
      res.status(404).send("Not found");
   }
};

module.exports = { getJobs, getJob };
