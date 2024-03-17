const bcrypt=require('bcrypt');
const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
       
    },
    username:{
        type:String,
        required:true,
        
    },
    email: {
        type:String,
        required:true,
        
    },
    password: {
        type:String, 
        minLength:8, 
        required:false,
    },
    profilePic: {
        type: String,
        default: "",
    } ,
    phoneNumber:{
        type:String,
    },
    bio: {
        type: String,
        default: "",
    },
    dateOfBirth:{
        type:Date
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    idLogged:{
        type:Boolean,
        default:false
    },
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      repliedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: [],
    },
      repostedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: [],
    },

})

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});



const User=mongoose.model("User",userSchema);
module.exports=User