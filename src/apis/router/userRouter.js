const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const googleController = require("../controllers/googleController");
const imageUpload = require("../middleware/imageUpload");

userRouter
  .post("/signup", userController.signupUser)
  // .post("/verifyOTP", userController.verifyOTP)
  .post("/signup-google", googleController.googleSignup)
  .post("/google-login", googleController.googleLogin)
  .post("/login", userController.loginUser)
  .patch(
    "/updateProfile/:id",
    imageUpload("profilePic"),
    userController.updateUserProfile
  )
  .get("/all", userController.allUserProfile)
  .get("/profile/:id", userController.getUserProfile)
  .post("/follow/:id", userController.userFollow)
  .post("/unfollow/:id", userController.userUnfollow)
  .get("/following/:id", userController.getFollowingList)
  .get("/followers/:id", userController.getFollowersList)
  .get("/notification/:id", userController.getNotifications);

module.exports = userRouter;
