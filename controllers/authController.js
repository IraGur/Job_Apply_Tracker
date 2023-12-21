const User = require("../models/User");
const Jobs = require("../models/Jobs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// handle errors
const handleErrors = (err, req) => {
   console.log(err.message, err.code);
   let errors = {
      firstName: "",
      lastName: "",
      email: "",
      gitHub: "",
      password: "",
      cpassword: "",
   };

   //incorrect email
   if (err.message === "incorrect email") {
      errors.email = "that email is not registered";
   }

   //incorrect password

   if (err.message === "incorrect password") {
      errors.password = "that password is incorrect";
      console.log(password);
   }

   // confirm that user typed same password twice

   if (req.body.password !== req.body.cpassword) {
      console.log(req.body.password, req.body.cpassword);
      var err = new Error("Passwords do not match.");
      err.status = 400;
      return next(err);
   }

   // dupliate error code
   if (err.code === 11000) {
      errors.email = "that email is already registered";
   }

   // validation errors
   if (err.message.includes("user validation failed")) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
         // console.log(val);
         // console.log(properties);
         errors[properties.path] = properties.message;
      });
   }

   return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
   return jwt.sign({ id }, "job tracker secret", {
      expiresIn: maxAge,
   });
};

// REGISTER_GET
module.exports.register_get = (req, res) => {
   res.render("register");
};

// LOGIN_GET
module.exports.login_get = (req, res) => {
   res.render("login");
};

//LOGOUT_GET
module.exports.logout_get = (req, res) => {
   res.cookie("jwt", "", { maxAge: 1 });
   res.redirect("/");
};

// JOB_GET
module.exports.createJob_get = (req, res) => {
   res.render("createJob");
};

// REGISTER_POST
module.exports.register_post = async (req, res) => {
   const { firstName, lastName, email, gitHub, password, cpassword, myCv } =
      req.body;
   console.log("this is file", myCv);
   try {
      const user = await User.create({
         firstName,
         lastName,
         email,
         gitHub,
         password,
         cpassword,
         myCv,
      });
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
   } catch (err) {
      const errors = handleErrors(err, req);
      res.status(400).json({ errors });
   }
   //console.log(email, password);
   //res.send("new register");
};

// LOGIN_POST
module.exports.login_post = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
   } catch (err) {
      const errors = handleErrors(err, req);
      res.status(400).json({ errors });
   }
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
      const errors = handleErrors(err, req);
      res.status(400).json({ errors });
   }
   //console.log(email, password);
   //res.send("new register");
};
