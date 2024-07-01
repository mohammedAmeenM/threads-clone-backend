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
    "/:userId",
    imageUpload("profilePic"),
    userController.updateUserProfile
  )
  .get("/", userController.allUserProfile)
  .get("/:userId", userController.getUserProfile)
  .post("/follow/:senderId", userController.userFollow)
  .post("/unfollow/:senderId", userController.userUnfollow)
  .get("/following/:userId", userController.getFollowingList)
  .get("/followers/:userId", userController.getFollowersList)
  .get("/notification/:userId", userController.getNotifications);

module.exports = userRouter;
