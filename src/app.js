const express=require('express');
const userRouter=require('./apis/router/userRouter')
const postRouter = require('./apis/router/postRouter');
const morgan = require('morgan');
const app=express();
const core=require('cors');

 
app.use(core())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/users/',userRouter) 
app.use('/api/posts/',postRouter)

module.exports=app;