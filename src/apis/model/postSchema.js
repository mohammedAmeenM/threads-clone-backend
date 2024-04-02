const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    maxLength: 500,
  },
  image: {
    type: String,
  },
  tembImage: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      userProfilePic: {
        type: String,
      },
      username: {
        type: String,
      },
    },
  ],
  reposts: [
    {
      repostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdOn: {
        type: Date,
        default: Date.now(),
      },
      userProfilePic: {
        type: String,
      },
      username: {
        type: String,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
