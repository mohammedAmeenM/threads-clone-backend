const mongoose = require('mongoose');

const postSchema= mongoose.Schema({
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
    ,  replies: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdOn: {
            type: Date,
            default: Date.now()
        }
    }],
    reposts: [{
        repostedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdOn: {
            type: Date,
            default: Date.now()
        }
    }]
})

const Post= mongoose.model("Post",postSchema);
module.exports=Post;