const mongoose = require('mongoose');

const productSchema= mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        maxLength:500
    },
    image:{
        type:String
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[]
    }
})

const Post= mongoose.model("Post",productSchema);
module.exports=Post;