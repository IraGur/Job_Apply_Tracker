// const { Router } = require("express");
// const router = Router();                  // below same but shorter

const router = require("express").Router();
const authController = require("../controllers/authController");
const jobsController = require("../controllers/jobsController");

router.get("/register", authController.register_get);
router.post("/register", authController.register_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.post("/createJob", jobsController.createJob_post);

module.exports = router;
