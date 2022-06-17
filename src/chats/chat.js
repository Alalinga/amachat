const { StoreSessions } = require("../utils/sessionstore");
const { User } = require("../utils/user")

//const { messageFormat,addUserToGroup,getGroupUsers, privateChatMessageFormat, addUsers,getAllUsers } = require("../utils/user")
const userInteface = new User();
const sessionStore = new StoreSessions()
function chat(io) {
    io.on('connection', (socket) => {
        socket.broadcast.emit("user connected", {userId: socket.userId,userName: socket.username,connected:true});
        //Store the username and userId as session
        sessionStore.saveSession(socket.userId, { userId: socket.userId, username: socket.username })
        // console.log('connected', sessionStore.getAllSessions())

        //after storing session emit it to the user
        socket.emit('userInfo', { userId: socket.userId, username: socket.username})

        //now get all users connected to the socket and store them into users
        //NOTE: the userId is from the session while currentUserId is the newly generated id from socket
        //userId will be used to persist user data
        // for (let [id, socket] of io.of('/').sockets) {
        // console.log(sessionStore.getAllSessions())
        sessionStore.getAllSessions().forEach(userData => {
            const user = { userName: userData.username, userId: userData.userId }
            //console.log('now',user)
            userInteface.addUsers(user)
        })


        // }

        socket.emit('users', userInteface.getAllUsers())

        //send message to every on
        //disconnect
        socket.on('disconnect', () => {
            // console.log('disconnected', { user: socket.username, id: socket.userId })
            socket.broadcast.emit("user connected", {userId: socket.userId,username: socket.userName,connected:false});
        })


        //receiving messages from the client side

        socket.on('joinGroup', (msg) => {

            const userInfo = { username: msg.username, group: msg.group, userId: socket.userId }
            userInteface.addUserToGroup(userInfo)
            socket.join(msg.group)

            socket.on('sendChat', (message) => {
                //emit the message sent my client to every one 
                //NOTE:(for personal clarification)  this emit simply means the server is kind of broadcasting the message sent by a user to anyone connected withen the server
                if (message && msg.username) {
                    socket.broadcast.to(msg.group).emit('message', userInteface.messageFormat(msg.username, socket.userId, message))
                }

            })
            // socket.broadcast.to(msg.group).emit('joinAlert', messageFormat(msg.username,'has join the chat'))
            io.to(msg.group).emit('joinMembers', { group: msg.group, users: userInteface.getGroupUsers(msg.group) })

        });

        socket.on('select user', (data) => {
            //use the first sender id as the roomId, share this id beetween the two parties for subsequent chats
            const sender = userInteface.getUserByName(data.sender);
            const receiver = userInteface.getUserByName(data.receiver);
            let roomId = sender.userId
            if (data.chatId) {
                roomId = userInteface.addOneOnOneRoom(data.chatId);
            } else {
                roomId = userInteface.addOneOnOneRoom(sender.userId);
            }
            socket.join(roomId)
            socket.emit('room created', roomId);
            // console.log('room Id', roomId,sender,receiver)
        })

        socket.on('privateChat', (msg) => {
            const from = { userId: socket.userId, userName: socket.username }
            const to = userInteface.getAllUsers().find(user => user.userName === msg.to)

            // if receiver is available emit data
            // NOTE: write else statement to store message if user is not available
            if (to) {
                socket.broadcast.to(to.userId).emit('privateMessage', userInteface.privateChatMessageFormat(msg.message, msg.to, from))
            }

        })


    })

}




module.exports = { chat }