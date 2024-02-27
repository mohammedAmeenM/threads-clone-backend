const mongoose = require('mongoose');

const productSchema= mongoose.Schema({
    postById:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       
    },
    text:{
        type:String,
        maxLength:500
    },
    image:{
        type:String
    },
    tembImage:{
        type:String
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[]
    }
})

const Post= mongoose.model("Post",productSchema);
module.exports=Post;