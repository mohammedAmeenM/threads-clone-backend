const jwt=require('jsonwebtoken');

const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.TOKEN_SECRET,{
        expiresIn:'10d',
    })
    res.cookie("jwt",token)
    return token
}
module.exports=generateToken;