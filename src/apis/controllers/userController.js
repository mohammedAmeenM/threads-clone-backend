const User = require("../model/userSchema");
const bcrypt=require('bcrypt') 
const generateToken = require("../utils/generateToken");
const twilio=require('twilio');
const validatePhoneNumber = require("../utils/phoneValidation");
const otpGenerate = require("../utils/otpGenerator");
const otpModel = require("../model/otpSchema");
const cloudinary = require("cloudinary").v2;





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
        const token= generateToken(user._id,res)
       
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            phoneNumber:newUser.phoneNumber,
            token:token
           
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
            profilePic:user.profilePic,
            phoneNumber:user.phoneNumber,
            token:token
        })
    } catch (error) {
        res.status(500).json({ message:"internal server error" });
        console.log( error.message);
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, bio } = req.body; 
        const {profilePic}=req.body;
        console.log(profilePic)
      
        console.log("nameeeee ", name,username,email,bio);
      let user = await User.findById(userId);
      if (!user) return res.status(400).json({ error: "User not found" });
  
  
      if (req.params.id !== userId.toString())
        return res
          .status(400)
          .json({ error: "You can't Update other user's profile" });

       if (profilePic) {
        if (user.profilePic) {
          await cloudinary.uploader.destroy(
            user.profilePic.split("/").pop(".")[0]   
          );
        }

      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.profilePic = profilePic || user.profilePic;
  
       user = await user.save();
  
       res.status(200).json({ message: "Profile upadated succesfully", user }); 
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log("Error in updateUser: ", error.message);
    }
  };

const allUserProfile=async (req,res)=>{
    try {
        console.log('scvbnm,')
        const users=await User.find();
        if(!users)return res.status(404).json({error:'users not found'});
        res.status(200).json({
            message:'successfully fetched all users',
            users:users
        })
    } catch (error) {
        console.error(error,'all profile')
        res.status(500).json({error:'internal server'})
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
        console.error(error,'get user profile')
        res.status(500).json({error:'internal server errror'})
    }
}
const userFollow=async (req,res)=>{
    try {
        const logUserId=req.params.id;
        const {userFollowId}=req.body;
        console.log(logUserId,userFollowId,'dssfsdfsdf')
        const user= await User.findById(logUserId);
        const userToFollow = await User.findById(userFollowId)
        if(!user||!userToFollow)return res.status(404).json({error:'user not found'})

        const followingUser= user.following.includes(userFollowId)
        if(followingUser){
            await User.updateOne({_id:logUserId},{$pull:{following:userFollowId}})
            await User.updateOne({_id:userFollowId},{$pull:{followers:logUserId}})
            return res.status(400).json({error:' unfollowing this user'})
        }else{
            user.following.push(userFollowId);
            userToFollow.followers.push(logUserId)
            await user.save();
            await userToFollow.save();
            res.status(200).json({message:'user following successfully'})
        }
    } catch (error) {
        console.error(error,'follow')
        res.status(500).json({error:'internal server error'})
    }
}
const userUnfollow = async (req, res) => {
    try {
        const logUserId = req.params.id;
        const { userUnfollowId } = req.body; 
        console.log(logUserId, userUnfollowId, 'unfollow'); 
        
        const user = await User.findById(logUserId);
        const userToUnfollow = await User.findById(userUnfollowId);
        if (!user || !userToUnfollow) return res.status(404).json({ error: 'User not found' });

        const followingUser = user.following.includes(userUnfollowId);
        if (followingUser) {
            await User.updateOne({ _id: logUserId }, { $pull: { following: userUnfollowId } });
            await User.updateOne({ _id: userUnfollowId }, { $pull: { followers: logUserId } });
            return res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            return res.status(400).json({ error: 'You are not following this user' });
        }
    } catch (error) {
        console.error(error, 'unfollow'); 
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getFollowingList=async(req,res)=>{
    try {
        const userId=req.params.id;
        const user= await User.findById(userId).populate('following')
        if(!user)return res.status(404).json({error:'user not found'})
        res.status(200).json({
            message:'successfully fetched following list',
            user
        })
    } catch (error) {
        console.error(error,'get following');
        res.status(500).json({error:'internal server error'})
    }
}

const getFollowersList=async(req,res)=>{
    try {
        const userId=req.params.id;
        const user = await User.findById(userId).populate('followers')
        if(!user)return res.status(404).json({error:'user not found'})
        res.status(200).json({
            message:'successfully fetched user followers',
            user
        })
    } catch (error) {
        console.error(error,'get follower')
        res.status(500).json({error:'internal server error'})
    }
}

module.exports={signupUser,loginUser,verifyOTP,updateUserProfile ,allUserProfile,getUserProfile,userFollow,userUnfollow,
getFollowingList,getFollowersList
}