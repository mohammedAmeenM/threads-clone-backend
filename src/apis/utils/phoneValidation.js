const twilio = require('twilio');

const validatePhoneNumber = async(phNumber) => {
    
    if (!phNumber) {
        return false
    }else {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
        try {
            client.lookups.v1.phoneNumbers(`+91${phNumber}`).fetch();
            return true
        } catch (error) {
            // console.log(error);
            return false
        }
    }
}
module.exports=validatePhoneNumber;