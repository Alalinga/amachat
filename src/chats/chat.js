const { User } = require("../utils/user")

//const { messageFormat,addUserToGroup,getGroupUsers, privateChatMessageFormat, addUsers,getAllUsers } = require("../utils/user")
const userInteface = new User()
function chat(io) {
    io.on('connection', (socket) => {
        for (let [id, socket] of io.of('/').sockets) {
            const user = { userId: id, userName: socket.username }
            userInteface.addUsers(user)

        }
        socket.emit('users', userInteface.getAllUsers())

        //socket.emit('message', "user connected")

        //send message to every on

        // socket.on('message',)

        //disconnect
        socket.on('disconnect', () => {
            io.emit('message', 'User has left the group')
        })


        //receiving messages from the client side

        socket.on('joinGroup', (msg) => {
            console.log('Person joined',msg)
            userInteface.addUserToGroup(socket.id, msg.username, msg.group)
            socket.join(msg.group)

            socket.on('sendChat', (message) => {
                //emit the message sent my client to every one 
                //NOTE:(for personal clarification)  this emit simply means the server is kind of broadcasting the message sent by a user to anyone connected withen the server
                io.to(msg.group).emit('message', userInteface.messageFormat(msg.username, message))

            })
            // socket.broadcast.to(msg.group).emit('joinAlert', messageFormat(msg.username,'has join the chat'))
            io.to(msg.group).emit('joinMembers', { group: msg.group, users: userInteface.getGroupUsers(msg.group) })

        });


        //private chat
        /* 
        1. select user
        2. write message
        3. send message(message,from-sender,to-reciever) to user 
        on first chat store username,userId,
        on subsequent chat, retrieve messages (advance)
        */

        socket.on('privateChat', (msg) => {
            
            const from = { userId: socket.id, userName: socket.username }
            const to = userInteface.getAllUsers().find(user=>user.userName===msg.to)
           // console.log(to, msg.message,from)
            io.to(to.userId).emit('privateMessage', userInteface.privateChatMessageFormat(msg.message, msg.to, from))
        })


    })

}




module.exports = { chat }