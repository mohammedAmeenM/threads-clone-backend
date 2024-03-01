const express=require('express');
const userController=require('../controllers/userController')
const userRouter=express.Router()
const googleController=require('../controllers/googleController')




userRouter.post('/signup',(userController.signupUser))
.post('/verifyOTP',(userController.verifyOTP))
.post('/signup-google',(googleController.googleSignup))
.post('/google-login',(googleController.googleLogin))
.post('/login',(userController.loginUser))
.get('/all',(userController.allUserProfile))




module.exports=userRouter;