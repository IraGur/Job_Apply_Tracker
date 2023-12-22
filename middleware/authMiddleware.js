const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
            res.locals.user = null;
            next();
         } else {
            res.locals.user = await User.findById(decodedToken.id);

            next();
         }
      });
   } else {
      res.locals.user = null;
      next();
   }
};

module.exports = { requireAuth, checkUser };
