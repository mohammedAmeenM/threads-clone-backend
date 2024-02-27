const Post = require("../model/productSchema");



const createPost=async (req,res)=>{
    try {
        const {userId,text,image}=req.body;
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
        const posts= await Post.find();
        if(!posts){
           return res.status(404).json({error:"posts is not found"});
        }
        res.status(200).json({
            message:"successfully fetched posts",
            post:posts
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
        const posts=await Post.find({postById:userId});
        if(!posts){
            return res.status(404).json({error:"user post not found"});
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


module.exports ={createPost,getAllPosts,getUserPost,getPostById,updatePost,deletePost};