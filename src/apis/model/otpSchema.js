const mongoose=require('mongoose');
const userSchema=require('../model/userSchema')


const otpSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:userSchema
    },
    phoneNumber:String,
    otp:String,
    verified:{
        type:Boolean,
        default:false
    },
    otpExpired:Date
})
const otpModel=mongoose.model("otp",otpSchema);
module.exports=otpModel
