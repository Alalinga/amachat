//store user temporaly
// const allUsers = []
// const users = []
// const privateChat_Users = []




class User {
    constructor() {
        this.allUsers = [];
        this.user = [];
        this.groups = []
        this.privateChat_Users = [];
        this.oneONoneChats = [];
        this.oneOneOneroomId = [];
        this.groupChats = [];
        this.errorMessage = "An error occured, please try again later"
    }
    /** Add operations */
    // this code is called at chat and will be removed at the right time
    addUserToGrouptest(groupId,userInfo) {
        try {
        if (this.users.find(user => user.userId === userInfo.userId) === undefined) {
            this.user.push(userInfo)
            return {response:'user Join successfully',code: 203}
        }
        return {response:'user already exist',code: 200}
    } catch (error) {
        return {response:this.errorMessage,code:200}
    }
    }
    // this code will replace the above code
    async addUserToGroup(groupId,userInfo) {
        try{
        const id = this.groups.findIndex(group=>group.groupId === groupId)
        if(id===-1) return {response:`The group with Id ${groupId} does not exist, check and try again`,code:404}
        
        const findUser = await this.groups[id].members.find(user=>user.userId===userInfo.userId)
        if (findUser === undefined) {
            this.groups[id].members.push(userInfo)
            return {response:'user added successfully',code:203}
        }
        return {response:'user already exist',code:200}
    }catch(err){
        return {error: this.errorMessage,code:500}
    }
    }
    async createGroup(groupId){
        try {
        const group = await this.groups.find(group=>group.groupId === groupId)
        if( group===undefined){
        this.groups.push({groupId,members:[]})
        return {response:`Successfully created a group ${groupId}`,code:203}
        }
        return {response:`group with the name ${groupId} already exist`,code:200};
    } catch (error) {
        return {error: this.errorMessage,code:500}   
    }
    }

    addUsers(user) {
        try {
            if (this.allUsers.find(u => u.userName === user.userName) === undefined){
                this.allUsers.push(user)
                return {respone:`Successfully added user`,code:203}
            } 
            return {response: `User already exist`,code: 200}
        } catch (error) {
            return {error:this.errorMessage,code:500}      
        }
    }
    //adding one-on-one chats on sending 
    addSenOneOnOneChats(data) {
        try {
        const chats = this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            chats.myChats.push(data.myChats[0])
            return {response: `Successfully added sender chat`,code:203}
        }
        this.oneONoneChats.push(data)
        return {response:` Successfully created sender new chat `,code:203}

    } catch (error) {
        return {error:this.errorMessage,code:500}  
    }
    }
    //adding one-on-one chat on receiving
    //NOTE: review this code and make sure it returns an object(contains the response data and response code) as response 
    addRecOneOnOneChats(data) {
        try {
        const chats = this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            chats.friendChats.push(data.friendChats[0]);
            return {respone:`Successfully added receiver chat`,code:203}
        }
        this.oneONoneChats.push(data)
        return {response: `Successfully created receiver new chat`,code: 203}

    } catch (error) {
        return {error: this.errorMessage  ,code:500} 
    }
    }
    addOneOnOneRoom(room) {
        const roomId = this.oneOneOneroomId.find(room => room.id === room);
        if (roomId !== undefined) return roomId
        this.oneOneOneroomId.push(room)
        return room
    }


    /** Add operations */
    //getting one-on-one chat by id
    async getOneOnOneChat(chatId) {
    try {
        const response = await this.oneONoneChats.find(chat => chat.chatId === chatId)
        if(response===undefined) return {NotFound:`No chats found for user ${chatId}`,code:404}
        return {response,code:200}

    } catch (error) {
        return {error: this.errorMessage,code: 500}
    }
    }
    getOneOnOneRoom(roomId) {
        return this.oneOneOneroomId.find(room => room.id === roomId)
    }

    getAllPrivateChats() {
        return this.oneONoneChats
    }

    async getUserById(id) {
        try {
            const response  = await this.allUsers.find(user => user.id === id)
            if(response===undefined) return {NotFound:`Cant find user ${id}`,code:404}
            return {response,code:200}

        } catch (error) {
            return {error:this.errorMessage,code:500}
        }
    }
    async getUserByName(name) {
        try {
            const response = await this.allUsers.find(user => user.userName === name)
            if(response===undefined) return {NotFound:`Can't find user ${name}`,code:404}
            return {response,code:200}
        } catch (error) {
            return {error:this.errorMessage,code:500}
        }
    }
    //NOTE: this code should be removed when everything is set
    async getGroupUserstest(group) {
        try {
            const response = await this.user.find(user => user.group === group)
            if(response===undefined) return "not found"
            return response
        } catch (error) { 
            return this.errorMessage
        }
    }
    async getGroupUsers(group) {
        try {
            const response = await this.groups.find(group => group.groupId === group)
            if(response===undefined) return {NotFound:`There is no group with name ${group}`,code:404};
            return {response,code:200};
        } catch (error) {
            return {error:this.errorMessage,code:500}
        }
    }
    getAllUsers() {
        return this.allUsers
    }
    async getGroupChats(groupId) {
        try {
        const response = await this.groupChats.find(group => group.groupId === groupId)
        if (response === undefined) return{NotFound: `No chats found for group with id ${groupId}`,code:404};
        return {response,code:200}
        } catch (error) {
            return {error: this.errorMessage,code:500}
        }
    }
    async deleteGroup(groupId){
        try {
            const index = await this.groups.findIndex(group=>group.groupId===groupId);
            if(index === -1) return {NotFound:`Group with name ${groupId} does not exist`,code:404};
            //deleting element
            const respone =  await this.groups.splice(index,1)
            if(respone.length > 0) return {success:`Successfully deleted group ${groupId}`,code:200}
            return {failed:`Could not delete group ${groupId}`,code:200} 
        } catch (error) {
            return {error: this.errorMessage,code:500}          
        }
    }
    async deleteUserFromGroup(groupId,user){
        try {
            const response = await this.getGroupUsers(groupId);
            if(response.response){
                const index =  response.response.members.findIndex(member=>member.userId===user)
                if(index === -1) return {NotFound: `User ${user} does not exist in group ${groupId}, kindly check and try again`,code:404}
                const results = response.response.members.splice(index,1);
                if(results.length > 0) return {success: `Successfully deleted user ${user} from ${groupId} group`,code:200}
                return {failed: `Could not delete user ${user}`,code:200}
            }
            return response
        } catch (error) {
            return {error: this.errorMessage,code:500} 
        }
        
    }
     //add delete User  and delete group chat functions here
    async deleteUser(userId){
        try {
            const index = await this.allUsers.findIndex(user=>user.userId === userId);
            if(index===-1) return {response:`User with Id ${userId} does not exist, please check and try again`,code:404}
            const user = this.allUsers.splice(index,1);
            if(user.length>0){
                return {response: `Successfully deleted user ${userId}`,code:200}
            }else{
                return {response: ` User ${userId} could not be deleted`,code:200}
            }
            
        } catch (error) {
            return {error: this.errorMessage,code:500}
        }
            
    }

    async deleteGroupChats(groupId){
        try {
            const response = await this.getGroupChats(groupId)
            if(response.response){
                const results =  response.response.chats.splice(0,response.response.chats.length)
                if(results.length > 0) return {response:`Successfully cleared chats`, code:200}
                return {response:`OOPs! Something went wrong, we could not delete chats at this time, try a gain later`,code:200}
            }else{
                return response
            }
        } catch (error) {
            return {error: this.errorMessage,code:500}
        }
    }
}
module.exports = { User }