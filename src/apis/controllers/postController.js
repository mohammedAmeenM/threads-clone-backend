const Notification = require("../model/notificationSchema");
const Post = require("../model/postSchema");
const User = require("../model/userSchema");

const createPost = async (req, res) => {
  try {
    const { userId, text, image } = req.body;
    console.log(userId);
    if (!text && image) {
      return res.status(404).json({ error: "text or image must be provided" });
    }
    const newPost = new Post({
      postById: userId,
      text,
      image,
    });
    await newPost.save();
    res.status(201).json({
      message: "post create successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in create post API:", error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdOn: -1 })
      .populate("postById");
    if (!posts) {
      return res.status(404).json({ error: "posts is not found" });
    }
    res.status(200).json({
      message: "successfully fetched posts",
      posts,
    });
  } catch (error) {
    console.error(error, "getAllposts");
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const getUserPost = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ postById: userId })
      .sort({ createdOn: -1 })
      .populate("postById");
    if (!posts) {
      return res.status(404).json({ error: "user post not found" });
    }
    res.status(200).json({
      message: "user post fetched successfully",
      post: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .sort({ createdOn: -1 })
      .populate("postById");
    if (!post) {
      return res.status(404).json({ error: "post is not found" });
    }
    res.status(200).json({
      message: "successfully fetched post",
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      { text },
      { new: true }
    );
    if (!updatePost) {
      return res.status(404).json({ error: "post not found" });
    }
    res.status(200).json({
      message: "post update successfully",
      post: updatePost,
    });
  } catch (error) {
    console.error(error, "update product");
    res.status(500).json({ error: "internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletepost = await Post.findByIdAndDelete(postId);
    if (!deletepost) {
      return res.status(404).json({ error: "post is not found" });
    }
    res.status(200).json({
      message: "successfully remove the post",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;


    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      // Create notification
      const notification = new Notification({
        senderUserId: userId,
        reciveUserId: post.postById,
        postId: postId,
        type: 'like',
        description: `Liked your post.`,
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error(error, "Error liking/unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (!likedPost) {
      return res
        .status(400)
        .json({ error: "Post has not been liked by this user" });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    
    await Notification.deleteOne({
      senderUserId: userId,
      reciveUserId: post.postById,
      postId: postId,
      type: 'like'
    });
   
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error, "Error unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
};

const replyPost = async (req, res) => {
  try {
    const { userId, text, userProfilePic, username } = req.body;
    const postId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not fount" });

    if (!text) return res.status(400).json({ message: "Text is requied" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not fount" });

    const replay = { userId, text, userProfilePic, username };

    post.replies.push(replay);
    await post.save();

    user.repliedPosts.push(postId);
    await user.save();
    res.status(200).json({ message: "Replay added succesfulyy", replay });
  } catch (error) {
    console.error(error, "add replay");
    res.status(500).json({ error: "internal server error" });
  }
};

const getReplies = async (req, res) => {
  try {
    const postId = req.params.id;
    const postReply = await Post.findById(postId).populate("replies");
    if (!postReply) return res.status(404).json({ error: "post not found" });

    res.status(200).json({
      message: "successfully fetched post replies",
      postReply,
    });
  } catch (error) {
    console.error(error, "error get reply");
  }
};

const getUserReplyPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ "replies.userId": userId }).populate(
      "postById"
    );

    if (!posts) {
      return res
        .status(404)
        .json({ error: "No posts found where the user has replied" });
    }

    res.status(200).json({
      message: "User reply posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const repostPost = async (req, res) => {
  try {
    const { userId, userProfilePic, username } = req.body;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingRepost = post.reposts.find(
      (repost) => repost.repostedBy.toString() === userId
    );
    if (existingRepost)
      return res.status(400).json({ message: "Post already reposted" });

    const newRepost = {
      repostedBy: userId,
      userProfilePic,
      username,
    };

    post.reposts.push(newRepost);
    await post.save();

    user.repostedPosts.push(postId);
    await user.save();

    res
      .status(200)
      .json({ message: "Post reposted successfully", repost: newRepost });
  } catch (error) {
    console.error("Error reposting post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserRepostPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ "reposts.repostedBy": userId }).populate(
      "postById"
    );

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No posts found where the user has reposted" });
    }

    res.status(200).json({
      message: "User repost posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  replyPost,
  getReplies,
  getUserReplyPosts,
  repostPost,
  getUserRepostPosts,
};
