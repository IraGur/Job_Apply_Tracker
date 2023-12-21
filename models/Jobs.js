const mongoose = require("mongoose");
const { isEmail } = require("validator");

const jobsSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true,
   },

   jobTitle: {
      type: String,
      required: [true, "Please enter a job title"],
   },

   website: {
      type: String,
      required: [true, "Please enter a website"],
   },

   company: {
      type: String,
      required: [true, "Please enter a company name"],
   },

   email: {
      type: String,
      required: [true, "Please enter an email"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
   },

   phone: {
      type: String,
      /* validate: {
         validator: function (v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
         },
         message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "User phone number required"], //!!! */
   },

   address: {
      //!!!
      type: String,
   },

   origin: {
      //!!!
      type: String, // You might store the path to the uploaded file or a link to it
      required: [true, "Please choose from the list"],
      //enum: ["Interested", "CV sent", "Negative", "Interview"],
   },
   /* cloudinary_id: {
      type: String,
   }, */

   status: {
      //!!!
      type: String, // You might store the path to the uploaded file or a link to it
      required: [true, "Please choose from the list"],
      //enum: ["Spontaneous candidacy", "Job offer"],
   },

   comments: {
      type: String,
      date: Date,
   },
});

// fire a function after doc (a new user) saved to db

jobsSchema.post("save", function (doc, next) {
   console.log("new job was created and saved", doc);

   next();
});

const Jobs = mongoose.model("jobs", jobsSchema);

module.exports = Jobs;
