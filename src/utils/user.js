//store user temporaly
// const allUsers = []
// const users = []
// const privateChat_Users = []

class User {
    constructor() {
        this.allUsers = []
        this.user = []
        this.privateChat_Users = []
    }

    privateChatMessageFormat(message,to,from) {
        return {
            message,
            to,
            from,
        }
    }
    messageFormat = (user, message) => {
        return {
            user,
            message,
        }
    }

    addUserToGroup(id, username, group) {
        if (username, this.user.find(user => user.username === username) === undefined) this.user.push({ id, username, group })
    }

    getUser(id) {
        return this.user.find(user => user.id === id)
    }
    getGroupUsers(group) {
        return this.user.filter(user => user.group === group)
    }
    addUsers(user) {
        if (this.allUsers.find(u => u.userName === user.userName) === undefined) this.allUsers.push({ userId: user.userId, userName: user.userName })
    }
    getAllUsers() {
        return this.allUsers
    }
}
module.exports = { User }