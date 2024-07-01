const express = require("express");
const postRouter = express.Router();
const postConroller = require("../controllers/postController");
const uploadImage = require("../middleware/postImageUpload");

postRouter
  .post("/", uploadImage, postConroller.createPost)
  .get("/", postConroller.getAllPosts)
  .get("/:userId", postConroller.getUserPost)
  .get("/:postId", postConroller.getPostById)
  .put("/:postId", postConroller.updatePost)
  .delete("/:postId", postConroller.deletePost)

  .post("/like/:postId", postConroller.likePost)
  .post("/unlike/:postId", postConroller.unlikePost)

  .post("/:postId/reply", postConroller.replyPost)
  .get("/reply/:postId", postConroller.getReplies)
  .get("/reply/:userId", postConroller.getUserReplyPosts)

  .post("/repost/:postId", postConroller.repostPost)
  .get("/repost/:userId", postConroller.getUserRepostPosts);

module.exports = postRouter;
