const express = require("express");
const chatRouter = express.Router();
const path = require('path');
const { getUser,getUserChats,getAllUsers,joinGroup,getGroupChats,getAllGroupMembers } = require("./controllers");
const { loginUser } = require('./auth')


chatRouter.get('/test', (req, res) => {
    console.log("I am in to render",__dirname)
    res.sendFile(path.join(process.cwd(), 'src/public/index.html'))

})

chatRouter.post('/login',loginUser);
chatRouter.get('user-details/:userId',getUser)
chatRouter.get('user-chats/:userId',getUserChats)

chatRouter.get('users/',getAllUsers)

chatRouter.get('group-members/:groupId',getAllGroupMembers)
chatRouter.get('group-chats/:groupId',getGroupChats)
chatRouter.post('join-group/:groupId',joinGroup)








module.exports = { chatRouter }