//store user temporaly
const users = []

const messageFormat = (user,message)=>{
    return{
        user,
        message,
    }
}

const addUsers = (id,username,group)=>{
   if(username,users.find(user=>user.username===username)===undefined) users.push({id,username,group})
}

const getUser = (id)=>{
    return users.find(user=>user.id===id)
}
const getGroupUsers = (group)=>{
    return users.filter(user=>user.group===group)
}
module.exports = {messageFormat,addUsers,getUser,getGroupUsers}