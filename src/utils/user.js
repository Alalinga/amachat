//store user temporaly
// const allUsers = []
// const users = []
// const privateChat_Users = []

const {v4: uuidv4 } = require('uuid');
const { allUsers, user, groups, privateChat_Users, oneONoneChats, oneOneOneroomId, groupChats } = require('./data');



class User {
    constructor() {
        this.allUsers = allUsers;
        this.user = user;
        this.groups = groups
        this.privateChat_Users = privateChat_Users;
        this.oneONoneChats = oneONoneChats;
        this.oneOneOneroomId = oneOneOneroomId;
        this.groupChats = groupChats;
        this.errorMessage = "An error occured, please try again later";

    }
    /** Add operations */
    // this code is called at chat and will be removed at the right time
    addUserToGrouptest(userInfo) {
        try {
        if (this.users.find(user => user.userId === userInfo.userId) === undefined) {
            this.user.push({userInfo})
            return {response:'user Join successfully',status: 203}
        }
        return {response:'user already exist',status: 200}
    } catch (error) {
        return {response:this.errorMessage,status:200}
    }
    }
    // this status will replace the above status
    async addUserToGroup(data) {
        try{
        const id = this.groups.findIndex(group=>group.groupName === data.groupId)
        if(id===-1) return {response:`The group with Id ${data.groupId} does not exist, check and try again`,status:404}
        
        const findUser = await this.groups[id].members.find(user=>user.username===data.username)
        if (findUser === undefined) {
            this.groups[id].members.push({username:data.username,userId:uuidv4()})
            return {response:'user added successfully',status:203}
        }
        return {response:'user already exist',status:200}
    }catch(err){
        return {error: this.errorMessage,status:500}
    }
    }
    async createGroup(groupName){
        try {
        const group = await this.groups.find(group=>group.groupName === groupName)
        if( group===undefined){
            const groupId = uuidv4()
        this.groups.push({groupId,groupName,members:[],chats:[]})
        console.log('at create ',this.groups)
        return {response:`Successfully created a group ${groupName}`,status:203}
        }
        return {response:`group with the name ${groupName} already exist`,status:200};
    } catch (error) {
        return {error: this.errorMessage,status:500}   
    }
    }

    addUsers(user) {
        try {
            if (this.allUsers.find(u => u.userName === user.userName) === undefined){
                this.allUsers.push(user)
                return {response:`Successfully added user`,status:203}
            } 
            return {response: `User already exist`,status: 200}
        } catch (error) {
            return {error:this.errorMessage,status:500}      
        }
    }
    //adding one-on-one chats on sending 
    async addSenOneOnOneChats(data) {
        try {
        const chats = await this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            chats.myChats.push(data.myChats[0])
            console.log(' sender chats',this.oneONoneChats);
            return {response: `Successfully added sender chat`,status:203}
        }
        this.oneONoneChats.push(data)
        console.log('Sender chats',this.oneONoneChats);
        return {response:` Successfully created sender new chat `,status:203}

    } catch (error) {
        return {error:this.errorMessage,status:500}  
    }
    }
    //adding one-on-one chat on receiving
    async addRecOneOnOneChats(data) {
        try {
        const chats = await this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            chats.friendChats.push(data.friendChats[0]);
            console.log('Reciever chats',this.oneONoneChats);
            return {response:`Successfully added receiver chat`,status:203}
        }
        this.oneONoneChats.push(data)
        console.log('Reciever chats',this.oneONoneChats);
        return {response: `Successfully created receiver new chat`,status: 203}

    } catch (error) {
        return {error: this.errorMessage  ,status:500} 
    }
    }
    addOneOnOneRoom(room) {
        const roomId = this.oneOneOneroomId.find(room => room.id === room);
        if (roomId !== undefined) return roomId
        this.oneOneOneroomId.push(room)
        return room
    }

    async addGroupChats(groupId,chat){
        try {
            const results = await this.getGroupUsers(groupId);
            console.log('results ', results)
            if(results.status !== 200) return results
            return results.response.chats.push(chat)
        } catch (error) {
            return {error: this.errorMessage,status:500}
        }
    }
    /** get operations */

    //getting one-on-one chat by id
    async getOneOnOneChat(chatId) {
    try {
        const response = await this.oneONoneChats.find(chat => chat.chatId === chatId)
        if(response===undefined) return {NotFound:`No chats found for user ${chatId}`,status:404}
        return {response,status:200}

    } catch (error) {
        return {error: this.errorMessage,status: 500}
    }
    }
    getOneOnOneRoom(roomId) {
        return this.oneOneOneroomId.find(room => room.id === roomId)
    }

    getAllPrivateChats() {
        return this.oneONoneChats
    }

    async getUserById(id) {
        console.log('the Id',id)
        try {
            const response  = await this.allUsers.find(user => user.id === id)
            if(response===undefined) return {NotFound:`Cant find user ${id}`,status:404}
            return {response,status:200}

        } catch (error) {
            return {error:this.errorMessage,status:500}
        }
    }
    async getUserByName(name) {
        try {
            const response = await this.allUsers.find(user => user.userName === name)
            if(response===undefined) return {NotFound:`Can't find user ${name}`,status:404}
            return {response,status:200}
        } catch (error) {
            return {error:this.errorMessage,status:500}
        }
    }
    //NOTE: this code should be removed when everything is set
    getGroupUserstest(group) {
        try {
            console.log("users",this.user);
            const response = this.user.find(user => user.group === group)
            if(response===undefined) return "not found"
            return response
        } catch (error) { 
            return this.errorMessage
        }
    }
    async getGroupUsers(groupId) {
        try {
            const response = await this.groups.find(group => group.groupName === groupId)
            if(response===undefined) return {NotFound:`There is no group with name ${groupId}`,status:404};
            return {response,status:200};
        } catch (error) {
            return {error:this.errorMessage,status:500}
        }
    }
    
    async getUserFromGroup(groupId,username){
        try {
            const response = await this.getGroupUsers(groupId);
            if(response.response){
                const user = response.response.members.find(user=>user.username===username)
                if(user===undefined)return {response:`User name ${username} is not part of this group ${groupId}`,status:404}
                return {user,status:200}
            }
            return response
        } catch (error) {
            return {error: this.errorMessage,status:500}
        }
    }

    getAllUsers() {
        return this.allUsers
    }
    async getGroupChats(groupId) {
        try {
        const response = await this.getGroupUsers(groupId)
        if (response.status !==200) return response
        return {response: response.response.chats, status:200}
        } catch (error) {
            return {error: this.errorMessage,status:500}
        }
    }
    async deleteGroup(groupId){
        try {
            const index = await this.groups.findIndex(group=>group.groupId===groupId);
            if(index === -1) return {NotFound:`Group with name ${groupId} does not exist`,status:404};
            //deleting element
            const response =  await this.groups.splice(index,1)
            if(response.length > 0) return {success:`Successfully deleted group ${groupId}`,status:200}
            return {failed:`Could not delete group ${groupId}`,status:200} 
        } catch (error) {
            return {error: this.errorMessage,status:500}          
        }
    }
    async deleteUserFromGroup(groupId,user){
        try {
            const response = await this.getGroupUsers(groupId);
            if(response.response){
                const index =  response.response.members.findIndex(member=>member.userId===user)
                if(index === -1) return {NotFound: `User ${user} does not exist in group ${groupId}, kindly check and try again`,status:404}
                const results = response.response.members.splice(index,1);
                if(results.length > 0) return {success: `Successfully deleted user ${user} from ${groupId} group`,status:200}
                return {failed: `Could not delete user ${user}`,status:200}
            }
            return response
        } catch (error) {
            return {error: this.errorMessage +''+error,status:500} 
        }
        
    }
     //add delete User  and delete group chat functions here
    async deleteUser(userId){
        try {
            const index = await this.allUsers.findIndex(user=>user.userId === userId);
            if(index===-1) return {response:`User with Id ${userId} does not exist, please check and try again`,status:404}
            const user = this.allUsers.splice(index,1);
            if(user.length>0){
                return {response: `Successfully deleted user ${userId}`,status:200}
            }else{
                return {response: ` User ${userId} could not be deleted`,status:200}
            }
            
        } catch (error) {
            return {error: this.errorMessage,status:500}
        }
            
    }

    async deleteGroupChats(groupId){
        try {
            const response = await this.getGroupChats(groupId)
            if(response.response){
                const results =  response.response.chats.splice(0,response.response.chats.length)
                if(results.length > 0) return {response:`Successfully cleared chats`, status:200}
                return {response:`OOPs! Something went wrong, we could not delete chats at this time, try a gain later`,status:404}
            }else{
                return response
            }
        } catch (error) {
            return {error: this.errorMessage,status:500}
        }
    }
}
module.exports = { User }