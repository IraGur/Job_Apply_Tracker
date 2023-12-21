const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Jobs = require("../models/Jobs");

const requireAuth = (req, res, next) => {
   const token = req.cookies.jwt;

   //check json web token exists & is verified
   if (token) {
      jwt.verify(token, "job tracker secret", (err, decodedToken) => {
         if (err) {
            console.log(err.message);
            res.redirect("/login");
         } else {
            console.log(decodedToken);
            next();
         }
      });
   } else {
      res.redirect("/login");
   }
};

//check current user
const checkUser = (req, res, next) => {
   const token = req.cookies.jwt; //get token from the cookies

   if (token) {
      jwt.verify(token, "job tracker secret", async (err, decodedToken) => {
         if (err) {
            console.log(err.message);
            res.locals.user = null;
            res.locals.jobs = null;
            next();
         } else {
            console.log("hello");
            console.log(decodedToken);
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;
            let userJobs = await Jobs.find({ userId: String(user._id) });
            res.locals.jobs = userJobs;

            next();
         }
      });
   } else {
      res.locals.user = null;
      res.locals.jobs = null;
      next();
   }
};

module.exports = { requireAuth, checkUser };
