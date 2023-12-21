const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const Test = "Test"; // что это такое ??????

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: [true, "Please enter a name"],
      match: [/^[a-zA-Z]+$/, "is invalid"], //???
   },

   lastName: {
      type: String,
      required: [true, "Please enter a name"],
      match: [/^[a-zA-Z]+$/, "is invalid"], //???
   },

   email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
   },

   gitHub: {
      type: String,
   },

   profilePicture: {
      type: String, // You might store the path to the uploaded file or a link to it
   },
   /* cloudinary_id: {
      type: String,
   }, */

   cv: {
      type: String, // You might store the path to the uploaded file or a link to it
   },

   password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
   },
});

/* // fire a function after doc (a new user) saved to db

userSchema.post("save", function (doc, next) {
   console.log("new user was created and saved", doc);

   next();
}); */

// fire a function before doc (a new user) saved to db
userSchema.pre("save", async function (next) {
   const salt = await bcrypt.genSalt(); //generate Salt
   this.password = await bcrypt.hash(this.password, salt); // hashing password
   //this.cpassword = await bcrypt.hash(this.cpassword, salt);
   //console.log("user about to be created and save", this);

   next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
   const user = await this.findOne({ email });
   if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
         return user;
      }
      throw Error("incorrect password");
   }
   throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
