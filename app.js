const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const { getJobs, getJob } = require("./middleware/jobsMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// 2. middleware
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" })); // , express.urlencoded({extended: true})
app.use(cookieParser());
app.disable("view cache");

// 3. view engine
app.set("view engine", "ejs");

// 4. database connection
const dbURI =
   "mongodb+srv://IraGur:dariko@cluster0.g4jlle6.mongodb.net/job-apply-tracker";
mongoose
   .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => app.listen(3002))
   .catch((err) => console.log(err));

// 5. routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("login"));
app.get("/dashboard", requireAuth, getJobs, (req, res) =>
   res.render("dashboard")
);
app.get("/dashboard/createJob", requireAuth, (req, res) =>
   res.render("createJob")
);
app.get("/dashboard/jobCard/:id", requireAuth, getJob, (req, res) =>
   res.render("jobCard")
);
app.get("/myProfile", requireAuth, (req, res) => res.render("myProfile"));

app.use(authRoutes);

/* 
// cookies
app.get("/set-cookies", (req, res) => {
   //res.setHeader("Set-Cookie", "newUser=true");    - same as below (res.cookie('newUser', false))

   res.cookie("newUser", false);
   res.cookie("isEmployee", true, {
      maxAge: 1000 * 60 * 60 * 24,
      //secure:true // httpOnly: true,
   }); //maxAge - cookie expiration time

   res.send("you got the cookies!");
});

app.get("/read-cookies", (req, res) => {
   const cookies = req.cookies;
   console.log(cookies// .newUser );

   res.json(cookies);
});
 */
