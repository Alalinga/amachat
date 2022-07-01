const express = require("express");
const chatRouter = express.Router();
const path = require('path');
const { getUser,getUserChats,getAllUsers,joinGroup,getGroupChats,getAllGroupMembers, deleteGroup, deleteGroupChats, deleteUserFromGroup, deleteUser, createGroup } = require("./controllers");
const { loginUser } = require('./auth')


chatRouter.get('/test', (req, res) => {
    console.log("I am in to render")
    res.send('success').status(200) //sendFile(path.join(process.cwd(), 'src/public/index.html'))

})

chatRouter.post('/login',loginUser);

// user routes
chatRouter.get('/user-details/:userId',getUser)
chatRouter.get('/user-chats/:userId',getUserChats)

chatRouter.get('/users/',getAllUsers)
chatRouter.delete('/users/delete/:userId',deleteUser)


// group routes
chatRouter.get('/group/members/:groupId',getAllGroupMembers)
chatRouter.get('/group/chats/:groupId',getGroupChats)

chatRouter.post('/group/create/:groupName',createGroup)
chatRouter.post('/group/join/:groupId/:username',joinGroup)

chatRouter.delete('/group/delete/:groupId',deleteGroup)
chatRouter.delete('/group/chats/delete/:groupId',deleteGroupChats)
chatRouter.delete('/group/members/delete/:groupId/:userId',deleteUserFromGroup);








module.exports = { chatRouter }