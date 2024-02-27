const express=require('express');
const userRouter=require('./apis/router/userRouter')
const postRouter = require('./apis/router/postRouter');
const app=express();
const core=require('cors');


app.use(core())
app.use(express.json());
app.use('/api/users/',userRouter)
app.use('/api/users/',postRouter)

module.exports=app;