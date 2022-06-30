const { User } = require("../utils/user")

const user = new User();

const getUser = async (req,res)=>{
    const id = req.params
    if(!id) res.json(new Error({error: "Please provide a user Id"})).status(400)
    const response = await user.getUser(id);
    //if(!user) res.json({NotFound: "User with the provided Id does not exist, Kindly check and try again"}).status(404)
return res.json(response).status(response.code)
}

const getUserChats = async (req,res)=>{
    const chatId = req.params
    if(!chatId) return res.json(new Error({error:"Please provide a user Id"})).status(400)
    const response = await user.getOneOnOneChat(chatId)
    //if(chats === undefined) return res.json({chats: "No chats found for this user"}).status(404)
    return res.json(response).status(response.code)
}

const getAllUsers = async (req,res)=>{
    const response = await user.getAllUsers();
    //if(!users) return res.json({NoData:"Sorry, There are no user available"}).status(404)
    return res.json(response).status(response.code)
}

const getGroupChats = async (req,res)=>{
    const groupId = req.params;
    if(!groupId) res.json(new Error({error:"Please, provide the group id or name"})).status(400)
    const response = await user.getGroupChats(groupId)
    //if(!groupChats) res.json({NotFound: "Sorry, there are no chats in this group"}).status(404)
    return res.json(response).status(response.code)
}
const getAllGroupMembers = async (req, res)=>{
    const groupId = req.params;
    if(!groupId) res.json(new Error({error: "Please, provide the group id or name"})).status(400)
    const response = await user.getGroupUsers(groupId);
    //if(!groupMembers) res.json({NotFound: "Sorry, There are not members in this group"}).status(404)
    return res.json(response).status(response.code)
}

const joinGroup= async (req,res)=>{
    const {username, groupName} = req.query;
    if(!username || !groupName) res.json(new Error({error: "Please, provide a valid username and a group name"})).status(400)
    const response = await user.addUserToGroup({username,groupName})
    return res.json(response).status(response.code)
}
const deleteGroup = async (req,res)=>{
    const {groupName} = req.params;
    if(!groupName) res.json(new Error({error: "Please, provide a group name"})).status(400);
    const response = await user.deleteGroup(groupName)
    return res.json(response).status(response.code)
}
const deleteUserFromGroup = async (req,res)=>{
    const {groupName,userName} = req.params;
    if(!groupName || !userName) res.json(new Error({error: "Please, provide a group and user name"})).status(400);
    const response = await user.deleteUserFromGroup(groupName,userName)
    return res.json(response).status(response.code)
}
const deleteGroupChats= async (req,res) =>{
    const {groupName} = req.params;
    if(!groupName) res.json(new Error({error: "Please, provide a group name"})).status(400);
    const response = await user.deleteGroupChats(groupName)
    return res.json(response).status(response.code)
}

const deleteUser = async (req,res)=>{
    const {userName} = req.params;
    if(!userName) res.json(new Error({error: "Please, provide a user name"})).status(400);
    const response = await user.deleteUser(userName)
    return res.json(response).status(response.code)
}

module.exports = {getUser,getUserChats,joinGroup,getAllGroupMembers,getGroupChats,getAllUsers,deleteGroup,deleteGroupChats,deleteUser,deleteUserFromGroup}