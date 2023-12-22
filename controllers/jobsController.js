const Jobs = require("../models/Jobs");

// handle errors

// JOB_GET
module.exports.createJob_get = (req, res) => {
   res.render("createJob");
};

// JOB_POST
module.exports.createJob_post = async (req, res) => {
   const {
      jobTitle,
      website,
      company,
      email,
      phone,
      address,
      origin,
      status,
      comments,
      userId,
   } = req.body;
   console.log("this is file");
   try {
      await Jobs.create({
         jobTitle,
         website,
         company,
         email,
         phone,
         address,
         origin,
         status,
         comments,
         userId,
      });

      res.status(201).send({ success: true });
   } catch (err) {
      res.status(400).json({ err });
   }
};
