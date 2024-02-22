const otpGenerator=require('otp-generator')


const otpGenerate=async()=>{
    const otp= await otpGenerator.generate(4,
        {
            lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false
        });
        return otp
    }

module.exports=otpGenerate;