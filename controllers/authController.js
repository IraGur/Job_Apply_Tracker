const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

// handle errors
const handleErrors = (err, req) => {
   console.log(err.message, err.code);
   let errors = {
      firstName: "",
      lastName: "",
      email: "",
      gitHub: "",
      password: "",
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

// REGISTER_POST
module.exports.register_post = async (req, res) => {
   const {
      firstName,
      lastName,
      email,
      gitHub,
      password,
      cpassword,
      myCv,
      profilePicture,
   } = req.body;
   //TODO - move to schema virtual field

   // First try upload files
   try {
      await cloudinary.uploader.upload(myCv, { folder: email });
      await cloudinary.uploader.upload(profilePicture, { folder: email });
   } catch (e) {
      console.log("ERROR FROM UPLOAD", e);
   }

   if (password !== cpassword) {
      res.status(400).json({
         errors: { cpassword: "the password doesn't match" },
      });
   } else {
      try {
         const user = await User.create({
            firstName,
            lastName,
            email,
            gitHub,
            password,
         });
         const token = createToken(user._id);
         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
         res.status(201).json({ user: user._id });
      } catch (err) {
         const errors = handleErrors(err, req);
         res.status(400).json({ errors });
      }
   }
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
