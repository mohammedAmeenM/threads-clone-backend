const User = require("../model/userSchema");
const generateToken = require("../utils/generateToken");

const googleSignup = async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    // const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    // if (existingUser) {
    //   return res.status(400).json({ error: "Allredy registred" });
    // }

    const newUser = new User({
      username,
      email,
      profilePic: profilePic,
    });

    const users = await newUser.save();
    console.log(users, "aaa");

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

const googleLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "invalid Email" });
    }
    const token = generateToken(user._id, res);
    res.status(200).json({
      message: "success",
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
      bio: user.bio,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server" });
    console.error(error, "google-login");
  }
};

module.exports = { googleSignup, googleLogin };
