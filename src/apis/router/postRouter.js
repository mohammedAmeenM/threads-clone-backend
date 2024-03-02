const express = require('express');
const postRouter = express.Router()
const postConroller=require('../controllers/postController');
const uploadImage = require('../middleware/imageUpload');


postRouter.post('/post',uploadImage,(postConroller.createPost))
.get('/post',(postConroller.getAllPosts))
.get('/post/:id',(postConroller.getUserPost))
.get('/postById/:id',(postConroller.getPostById))
.put('/post/:id',(postConroller.updatePost)) 
.delete('/post/:id',(postConroller.deletePost))

.post('/post/like/:id',(postConroller.likePost))
.post('/post/:id/replay',(postConroller.replyPost))
.get('/post/reply/:id',(postConroller.getReplies))

module.exports=postRouter;
