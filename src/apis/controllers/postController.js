const Post = require("../model/postSchema");
const User = require("../model/userSchema");
const { post } = require("../router/userRouter");



const createPost=async (req,res)=>{
    try {
        const {userId,text,image}=req.body;
        console.log(userId)
        if(!text && image){
            return res.status(404).json({error:"text or image must be provided"})
        };
        const newPost= new Post({

            postById:userId,
            text,
            image,
            
        })
        await newPost.save();
        res.status(201).json({
            message:"post create successfully",
            post:newPost
        })
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in create post API:", error);
    }
}

const getAllPosts=async(req,res)=>{
    try {
        const posts= await Post.find().populate('postById');
        if(!posts){
           return res.status(404).json({error:"posts is not found"});
        }
        res.status(200).json({
            message:"successfully fetched posts",
            posts,
               
        })
    } catch (error) {
        console.error(error,'getAllposts')
        req.status(500).json({
            error:"internal server error"
        })
    }
}

const getUserPost= async(req,res)=>{
    try {
        const userId=req.params.id;
        const posts=await Post.find({postById:userId}).populate('postById');
        if(!posts){
            return res.status(404).json({error:"user post not found" });
        }
        res.status(200).json({
            message:'user post fetched successfully',
            post:posts
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:"internal server error"
        })
    }
}

const getPostById=async(req,res)=>{
    try {
        const postId=req.params.id;
        const post= await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:'post is not found'})
        }
        res.status(200).json({
            message:'successfully fetched post', 
            post:post
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'internal server error'});
    }
}

const updatePost=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const postId=req.params.id;
        const updatePost= await Post.findByIdAndUpdate(postId,{text,image},{new:true});
        if(!updatePost){
            return res.status(404).json({error:'post not found'})
        }
        res.status(200).json({
            message:'post update successfully',
            post:updatePost
        })
    } catch (error) {
        console.error(error,'update product');
        res.status(500).json({error:'internal server error'})
    }
}

const deletePost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const deletepost=await Post.findByIdAndDelete(postId)
        if(!deletepost){
           return res.status(404).json({error:"post is not found"})
        }
        res.status(200).json({
            message:"successfully remove the post"
        })
         
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'internal server error'});
    }
}

const likePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const { userId } = req.body;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const likedPost = post.likes.includes(userId);
  
      if (likedPost) {
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
        res.status(200).json({ message: 'Post unliked successfully' });
      } else {
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: 'Post liked successfully' });
      }
    } catch (error) {
      console.error(error, 'Error liking/unliking post');
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const unlikePost = async (req, res) => {
    try { 
      const postId = req.params.id;
      const { userId } = req.body;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const likedPost = post.likes.includes(userId);
  
      if (!likedPost) {
        return res.status(400).json({ error: 'Post has not been liked by this user' });
      }
  
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
      console.error(error, 'Error unliking post');
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const replyPost=async(req,res)=>{
    try {
        const {userId, text}=req.body;
        const postId=req.params.id;
        const post= await Post.findById(postId);
        if(!post) return res.status(404).json({error:'post not found'})
        
        post.replies.push({text,postedBy:userId})
       await post.save();
        res.status(201).json({
            message:'successfully add reply',
            post
            
        })
    }catch (error) {
        console.error(error,'add replay');
        res.status(500).json({error:'internal server error'});
    }
} 

const getReplies=async (req,res)=>{
    try {
        const postId=req.params.id;
        const postReply=await Post.findById(postId).populate('replies')
        if(!postReply)return res.status(404).json({error:"post not found"})

        res.status(200).json({
            message:'successfully fetched post replies',
            postReply
        })
    } catch (error) {
        console.error(error,'error get reply')
    }
}


module.exports ={createPost,getAllPosts,getUserPost,getPostById,updatePost,deletePost,likePost,unlikePost,
replyPost,getReplies
};