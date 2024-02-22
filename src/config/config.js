const dotenv=require('dotenv');
dotenv.config({path:'../.env'})
const mongoose=require('mongoose');


const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.LOCAL_CONN_DB)
        console.log(`connect mongoDb`)
    } catch (err) {
        console.error(err)
    }
}
module.exports=connectDB 