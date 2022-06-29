const { StoreSessions } = require("../utils/sessionstore");
const { User } = require("../utils/user")

const userInteface = new User();
const sessionStore = new StoreSessions()
function chat(io) {

    io.on('connection', (socket) => {

        socket.broadcast.emit("user connected", { userId: socket.userId, userName: socket.username, connected: true });
        //Store the username and userId as session
        sessionStore.saveSession(socket.userId, { userId: socket.userId, username: socket.username })


        //after storing session emit it to the user
        socket.emit('userInfo', { userId: socket.userId, username: socket.username })

        //now get all users connected to the socket and store them into users
        //userId will be used to persist user data 
        //NOTE: The UserId and username should be stored in a dataase and be called anytime the user connects. This userId is used in place of the auto generated Id from socket for chating

        sessionStore.getAllSessions().forEach(userData => {
            const user = { userName: userData.username, userId: userData.userId }

            userInteface.addUsers(user)
        })

        //emit send all connected users to user
        socket.emit('users', userInteface.getAllUsers())


        socket.on('disconnect', () => {
            //when user disconnect broadcast to all users 
            socket.broadcast.emit("user connected", { userId: socket.userId, username: socket.userName, connected: false });
        })


         // When a user joins a group
        socket.on('joinGroup', (msg) => {
            const userInfo = { username: msg.username, group: msg.group, userId: socket.userId }
            //add to gruop members
            userInteface.addUserToGroup(userInfo)
            //join the group
            socket.join(msg.group)

            // emit or send all group members to the user
            io.to(msg.group).emit('joinMembers', { group: msg.group, users: userInteface.getGroupUsers(msg.group) })

            //When a user send a message in the group
            socket.on('sendChat', (message) => {
                //emit the message sent by everyone to everyone in the group 
                //NOTE:(for personal clarification)  this emit simply means the server is kind of broadcasting the message sent by a user to anyone connected withen the group
                if (message && msg.username) {
                    socket.broadcast.to(msg.group).emit('message', userInteface.messageFormat(msg.username, socket.userId, message))
                }

            })

        });

        socket.on('selected-user', (user) => {
            // If user is not selected throw an error
            if (!user.receiver) {
                return socket.emit('error', new Error({ NoUserError: 'oops!! error occured. Make sure you have selected a user and try again' }))
            }

            //when user is selected, fetch all old chats with the selected user and emit back to the one who selected the user

            //create an id (sender Id plus receiver Id) for chats. this id will be use to fetch chats history a.k.a old chats
            let chatId = socket.userId + '' + user.receiver.userId;
            // find old chats and emit back to user
            socket.emit('old-chat', userInteface.getOneOnOneChat(chatId));

            const from = { userId: socket.userId, userName: socket.username }

            socket.on('privateChat', (data) => {

                //add chat to sender chat records
                chatId = socket.userId + '' + data.receiver.userId;
                userInteface.addSenOneOnOneChats(userInteface.oneOnoneMessageFormat(chatId, [{ message: data.message, date: data.date }], []))

                // add chat to receiver chat records 
                //NOTE: at reciver end the chatId is the receiver Id plus the sender Id
                chatId = data.receiver.userId + '' + socket.userId;
                userInteface.addRecOneOnOneChats(userInteface.oneOnoneMessageFormat(chatId, [], [{ message: data.message, date: data.date }]))
                // emit or send message to reciever 
                socket.to(data.receiver.userId).emit('privateMessage', userInteface.privateChatMessageFormat(data.chatId, data.message, data.receiver, from))
            })
        })

    })

}




module.exports = { chat }