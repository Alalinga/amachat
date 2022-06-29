const { default: user } = require("../utils/user")



const getUser = (req,res)=>{
    const id = req.params
return user.getUser(id)
}

const getUserChats = (req,res)=>{
    const chatId = req.params
    return user.getOneOnOneChat(chatId)
}

const getAllUsers = (req,res)=>{
    return user.getAllUsers()
}

const getGroupChats = (req,res)=>{
    const groupId = req.params;
    return user.getGroupChats(groupId)
}
const getAllGroupMembers = (req, res)=>{
    const groupId = req.params;
    return user.getGroupUsers(groupId)
}

const joinGroup=(req,res)=>{
    const {username, groupName} = req.query
    return user.addUserToGroup({username,groupName})
}

module.exports = {getUser,getUserChats,joinGroup,getAllGroupMembers,getGroupChats,getAllUsers}