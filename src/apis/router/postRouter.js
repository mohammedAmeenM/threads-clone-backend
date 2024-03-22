const express = require("express");
const postRouter = express.Router();
const postConroller = require("../controllers/postController");
const uploadImage = require("../middleware/postImageUpload");

postRouter
  .post("/post", uploadImage, postConroller.createPost)
  .get("/post", postConroller.getAllPosts)
  .get("/post/:id", postConroller.getUserPost)
  .get("/postId/:id", postConroller.getPostById)
  .put("/post/:id", postConroller.updatePost)
  .delete("/post/:id", postConroller.deletePost)

  .post("/post/like/:id", postConroller.likePost)
  .post("/post/unlike/:id", postConroller.unlikePost)

  .post("/post/:id/reply", postConroller.replyPost)
  .get("/post/reply/:id", postConroller.getReplies)
  .get("/post/user/reply/:id", postConroller.getUserReplyPosts)

  .post("/post/repost/:id", postConroller.repostPost)
  .get("/post/repost/:id", postConroller.getUserRepostPosts);

module.exports = postRouter;
