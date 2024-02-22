const express=require('express');
const userRouter=require('./apis/router/userRouter')
const app=express();
const core=require('cors')

app.use(core())
app.use(express.json());
app.use('/api/users/',userRouter)

module.exports=app;