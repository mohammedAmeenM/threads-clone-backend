   const User=require('../model/userSchema');
const generateToken = require('../utils/generateToken');
   
   
   
   
   
   
   const googleSignup = async (req, res) => {
    try {
      const { username, email, profilePic } = req.body;
      console.log(username)
      console.log("resbody:", username, email, profilePic);
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  
      if (existingUser) {
        return res.status(400).json({ error: "Allredy registred" });
      }
  
      const newUser = new User({
        username, 
        email,
        profilePic: profilePic,
      });
  
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token: generateToken(newUser._id, res),
      });
    } catch (error) {
      console.error("Error in google Signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  module.exports={googleSignup}