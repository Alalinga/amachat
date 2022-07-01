const { User } = require("../utils/user")

const user = new User();

const getUser = async (req,res)=>{
    const {userId} = req.params
    if(!userId) res.json(new Error({error: "Please provide a user Id"})).status(400)
    const response = await user.getUserById(userId);
    //if(!user) res.json({NotFound: "User with the provided Id does not exist, Kindly check and try again"}).status(404)
return res.json(response).status(response.status)
}

const getUserChats = async (req,res)=>{
    const {userId} = req.params
    if(!userId) return res.json(new Error({error:"Please provide a user Id"})).status(400)
    const response = await user.getOneOnOneChat(userId)
    //if(chats === undefined) return res.json({chats: "No chats found for this user"}).status(404)
    return res.json(response).status(response.status)
}

const getAllUsers = async (req,res)=>{
    const response = await user.getAllUsers();
    //if(!users) return res.json({NoData:"Sorry, There are no user available"}).status(404)
    return res.json(response).status(response.status)
}

const getGroupChats = async (req,res)=>{
    const {groupId} = req.params;
    if(!groupId) res.json(new Error({error:"Please, provide the group id or name"})).status(400)
    const response = await user.getGroupChats(groupId)
    //if(!groupChats) res.json({NotFound: "Sorry, there are no chats in this group"}).status(404)
    return res.json(response).status(response.status)
}
const getAllGroupMembers = async (req, res)=>{
    const {groupId} = req.params;
    if(!groupId) res.json(new Error({error: "Please, provide the group id or name"})).status(400)

    const response = await user.getGroupUsers(groupId.toString());
    //if(!groupMembers) res.json({NotFound: "Sorry, There are not members in this group"}).status(404)
    return res.json(response).status(response.status)
}

const joinGroup= async (req,res)=>{
    const {groupId,username} = req.params;
    if(!username || !groupId) res.json(new Error({error: "Please, provide a valid username and a group Id"})).status(400)
    const response = await user.addUserToGroup({username,groupId})
    return res.json(response).status(response.status)
}
const createGroup= async (req,res)=>{
    const {groupName} = req.params;
    if(!groupName) res.json(new Error({error: "Please, provide a valid group name"})).status(400)
    const response = await user.createGroup(groupName)
    return res.json(response).status(response.status)
}
const deleteGroup = async (req,res)=>{
    const {groupId} = req.params;
    if(!groupId) res.json(new Error({error: "Please, provide a group Id"})).status(400);
    const response = await user.deleteGroup(groupId)
    return res.json(response).status(response.status)
}
const deleteUserFromGroup = async (req,res)=>{
    const {groupId,userId} = req.params;
    if(!groupId || !userId) res.json(new Error({error: "Please, provide a group and user Id"})).status(400);
    const response = await user.deleteUserFromGroup(groupId,userId)
    return res.json(response).status(response.status)
}
const deleteGroupChats= async (req,res) =>{
    const {groupId} = req.params;
    if(!groupId) res.json(new Error({error: "Please, provide a group Id"})).status(400);
    const response = await user.deleteGroupChats(groupId)
    return res.json(response).status(response.status)
}

const deleteUser = async (req,res)=>{
    const {userId} = req.params;
    if(!userId) res.json(new Error({error: "Please, provide a user name"})).status(400);
    const response = await user.deleteUser(userId)
    return res.json(response).status(response.status)
}

module.exports = {getUser,getUserChats,joinGroup,getAllGroupMembers,getGroupChats,getAllUsers,deleteGroup,deleteGroupChats,deleteUser,deleteUserFromGroup,createGroup}