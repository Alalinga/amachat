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
            return 'user Join successfully'
        }
        return 'user already exist'
    } catch (error) {
        return this.errorMessage
    }
    }
    // this code will replace the above code
    async addUserToGroup(groupId,userInfo) {
        try{
        const id = this.groups.findIndex(group=>group.groupId === groupId)
        if(id===-1) return `The group with Id ${groupId} does not exist, check and try again`
        
        const findUser = await this.groups[id].members.find(user=>user.userId===userInfo.userId)
        if (findUser === undefined) {
            this.groups[id].members.push(userInfo)
            return 'user added successfully'
        }
        return 'user already exist'
    }catch(err){
        return this.errorMessage
    }
    }
    async createGroup(groupId){
        try {
        const group = await this.groups.find(group=>group.groupId === groupId)
        if( group===undefined){
        this.groups.push({groupId,members:[]})
        return `Successfully created a group ${groupId}`
        }
        return `group with the name ${groupId} already exist`;
    } catch (error) {
        return this.errorMessage
            
    }
    }

    addUsers(user) {
        try {

            if (this.allUsers.find(u => u.userName === user.userName) === undefined) this.allUsers.push(user)

        } catch (error) {
            return this.errorMessage      
        }
    }
    //adding one-on-one chats on sending 
    addSenOneOnOneChats(data) {
        try {
        const chats = this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            return chats.myChats.push(data.myChats[0])
        }
        return this.oneONoneChats.push(data)

    } catch (error) {
        return this.errorMessage  
    }
    }
    //adding one-on-one chat on receiving
    addRecOneOnOneChats(data) {
        try {
        const chats = this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            return chats.friendChats.push(data.friendChats[0])
        }
        return this.oneONoneChats.push(data)

    } catch (error) {
        return this.errorMessage   
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
        if(response===undefined) return `No chats found for user ${chatId}`
        return response

    } catch (error) {
       return this.errorMessage 
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
            if(response===undefined) return `Cant find user ${id}`
            return response

        } catch (error) {
            return this.errorMessage
        }
    }
    async getUserByName(name) {
        try {
            const response = await this.allUsers.find(user => user.userName === name)
            if(response===undefined) return `Can't find user ${name}`
            return response
        } catch (error) {
            return this.errorMessage
        }
    }
    //NOTE:   
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
            if(response===undefined) return {NotFound:`There is no group with name ${group}`};
            return {response};
        } catch (error) {
            return {error:this.errorMessage}
        }
    }
    getAllUsers() {
        return this.allUsers
    }
    async getGroupChats(groupId) {
        try {
        const response = await this.groupChats.find(group => group.groupId === groupId)
        if (response === undefined) return{NotFound: `No chats found for group with id ${groupId}`};
        return {response}
        } catch (error) {
            return {error: this.errorMessage}
        }
        

    }
    async deleteGroup(groupId){
        try {
            const index = await this.groups.findIndex(group=>group.groupId===groupId);
            if(index === -1) return {NotFound:`Group with name ${groupId} does not exist`};
            //deleting element
            const respone =  await this.groups.splice(index,1)
            if(respone.length > 0) return {success:`Successfully deleted group ${groupId}`}
            return {failed:`Could not delete group ${groupId}`} 
        } catch (error) {
            return {error: this.errorMessage}          
        }
    }
    async deleteUserFromGroup(groupId,user){
        try {
            const response = await this.getGroupUsers(groupId);
            if(response.response){

                const index =  response.response.members.findIndex(member=>member.userId===user)
                if(index === -1) return {NotFound: `User ${user} does not exist in group ${groupId}, kindly check and try again`}
                const results = response.response.members.splice(index,1);
                if(results.length > 0) return {success: `Successfully deleted user ${user} from ${groupId} group`}
                return {failed: `Could not delete user ${user}`}
            }
            return response
        } catch (error) {
            return this.errorMessage 
        }
    }
}
module.exports = { User }