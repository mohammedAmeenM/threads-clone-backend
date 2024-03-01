const User = require("../model/userSchema");
const bcrypt=require('bcrypt') 
const generateToken = require("../utils/generateToken");
const twilio=require('twilio');
const validatePhoneNumber = require("../utils/phoneValidation");
const otpGenerate = require("../utils/otpGenerator");
const otpModel = require("../model/otpSchema");





const sendOTP=async(phoneNumber)=>{
    const client=twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)
    console.log(process.env.TWILIO_ACCOUNT_SID);
    try {
        const otp=await otpGenerate();
        const numberFinding=await otpModel.findOne({phoneNumber:`+91${phoneNumber}`});
        if(numberFinding){
            const updatingOtp= await otpModel.findOneAndUpdate({phoneNumber:`+91${phoneNumber}`},{$set:{otp:otp,verified:false}})
            updatingOtp.save();
        }else{
            const otpData=new otpModel({phoneNumber:`+91${phoneNumber}`,otp:otp,otpExpired:new Date(Date.now() + 5 * 60 * 1000)})
            otpData.save()
        }

        // otp send to twilio

        await client.messages.create({
            body:`Your otp is :${otp} by ameeiiieeee`,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:`+91${phoneNumber}`
        })
            console.log('OTP sent successfully.');
        } catch (error) { 
            console.error('Twilio API Error Response:');

        }
}
const signupUser=async(req,res)=>{
    try {
        const {name,username,email,password,phoneNumber}=req.body;
        console.log(name);
        const isValidPhoneNumber= await validatePhoneNumber(phoneNumber);
        if (!isValidPhoneNumber) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }
        
        const allreaddyUser=await User.findOne({username})
        if(allreaddyUser){
            await sendOTP(phoneNumber)
            return res.status(409).json({error:'user already exists'})
        }
        const newUser=new User({
            name,username,email,password,phoneNumber
        })
        await newUser.save();
        await sendOTP(phoneNumber) 
       
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            phoneNumber:newUser.phoneNumber,
           
          });

    } catch (error) {
        res.status(500).json({
            status:"error",
            message:'internal server error' 
        })
        console.log(error);
    }
}


const verifyOTP=async(req,res)=>{
    try {
        const {phoneNumber,enterOTP}=req.body;
        const phNumber=`+91${phoneNumber}`
       console.log(phNumber);
        const otpData=await otpModel.findOne({phoneNumber:phNumber});
        if(!otpData){
            return res.status(404).json({status:'fail',message:'Otp not found this user'});
        }
        console.log(otpData.otp)
        if(otpData.otp!==enterOTP){
            return res.status(400).json({message:'invalid OTP'});
        }
        // if(otpData.otpExpired<new Date()){
        //     return res.status(400).json({message:"OTP has expired"})
        // }
        otpData.verified=true;
        await otpData.save();
        res.status(200).json({message:'OTP verified successfully'})

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'internal server error'})
    }
}



const loginUser=async (req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const matchPassword = await bcrypt.compare(password, user.password )
        if (!matchPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authentication failed'
               
            });
        }
       const token= generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            name:user.name,
            username:user.username,
            email:user.email,
            token:token
        })
    } catch (error) {
        res.status(500).json({ message:"internal server error" });
        console.log( error.message);
    }
}

const allUserProfile=async (req,res)=>{
    try {
        const users=await User.find();
        if(!users)return res.status(404).json({error:'users not found'});
        res.status(200).json({
            message:'successfully fetched all users',
            users:users
        })
    } catch (error) {
        console.error(error,'all profile')
    }
}
const getUserProfile=async (req,res)=>{
    try {
        const userId=req.params.id;
        const user=await User.findById(userId);
        if(!user)return res.status(404).json({error:'user not found'})
        res.status(200).json({
            message:'successfully fetched user profile',
            user:user
        })
    } catch (error) {
        console.error(error,'get user')
        res.status(500).json({error:'internal server errror'})
    }
}
module.exports={signupUser,loginUser,verifyOTP ,allUserProfile,getUserProfile}