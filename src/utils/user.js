//store user temporaly
// const allUsers = []
// const users = []
// const privateChat_Users = []

const { getDate } = require('./date');


class User {
    constructor() {
        this.date = getDate()
        this.allUsers = []
        this.user = []
        this.privateChat_Users = [];
        this.oneONoneChats = [];
        this.oneOneOneroomId = [];
    }

    privateChatMessageFormat(message, to, from) {
        return {
            message,
            to,
            from,
            date: this.date.date,
            time: this.date.time
        }
    }
    oneOnoneMessageFormat() {
        return {
            chatId,
            myChats:[],
            friendChats:[]
        }
    }

    messageFormat = (user, id, message) => {
        return {
            user,
            id,
            message,
            date: this.date.date,
            time: this.date.time
        }
    }

    addUserToGroup(userInfo) {
        if (this.user.find(user => user.username === userInfo.username) === undefined) this.user.push(userInfo)
    }

    getUser(id) {
        return this.user.find(user => user.id === id)
    }
    getUserByName(name) {
        return this.allUsers.find(user => user.userName === name)
    }
    getGroupUsers(group) {
        return this.user.filter(user => user.group === group)
    }
    addUsers(user) {
        if (this.allUsers.find(u => u.userName === user.userName) === undefined) this.allUsers.push(user)
    }
    getAllUsers() {
        return this.allUsers
    }
    addOneOnOneChats(data) {
        const chats = this.oneONoneChats.find(chat => chat.chatId == data.chatId)
        if (chats !== undefined) {
            return chats.messages.push(data.message)
        }
        return this.oneONoneChats.push(data)
    }
    getOneOnOneChat(chatId) {
        return this.oneONoneChats.find(chat => chat.chatId === chatId)
    }
    getOneOnOneRoom(roomId) {
        return this.oneOneOneroomId.find(room => room.id === roomId)
    }
    addOneOnOneRoom(room) {
        const roomId = this.oneOneOneroomId.find(room => room.id === room);
        if (roomId !== undefined) return roomId
        this.oneOneOneroomId.push(room)
        return room
    }
}
module.exports = { User }