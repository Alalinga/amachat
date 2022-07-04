const { StoreSessions } = require("../utils/sessionstore");
const { User } = require("../utils/user");
const { formater } = require("../utils/messageformat")

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
        socket.on('joinGroup', async (user) => {
            const userInfo = { username: user.username, group: user.group, userId: socket.userId }
            //add to gruop members
            //    const resp =  userInteface.addUserToGroup({username:user.username,groupId:user.group})

            //join the group
            const checkUser = await userInteface.getUserFromGroup(user.group, user.username);
            if (checkUser.status === 200) {
                socket.join(user.group)

                // emit or send all group members to the user
                const groupUsers =  await userInteface.getGroupUsers(user.group);
                io.to(user.group).emit('joinMembers', groupUsers.response)

                //When a user send a message in the group
                socket.on('sendChat', async (message) => {
                    //emit the message sent by anyone to everyone in the group 
                    //NOTE:(for personal clarification)  this emit simply means the server is kind of broadcasting the message sent by a user to anyone connected withen the group
                    if (message && user.username) {
                        const results = await userInteface.addGroupChats(user.group,formater.messageFormat(user.username, socket.userId, message))
                        console.log('in chat', results)
                        socket.broadcast.to(user.group).emit('message', formater.messageFormat(user.username, socket.userId, message))
                    }
                })
            } else {
                return socket.emit('error', checkUser)
            }
        });

        socket.on('selected-user', async (user) => {
            // If user is not selected throw an error
            if (!user.receiver) {
                return socket.emit('error', new Error({ NoUserError: 'oops!! error occured. Make sure you have selected a user and try again' }))
            }

            //when user is selected, fetch all old chats with the selected user and emit back to the one who selected the user

            //create an id (sender Id plus receiver Id) for chats. this id will be use to fetch chats history a.k.a old chats
            let chatId = socket.userId + '' + user.receiver.userId;
            // find old chats and emit back to user
            socket.emit('old-chat', await userInteface.getOneOnOneChat(chatId));

            const from = { userId: socket.userId, userName: socket.username }

            socket.on('privateChat', async (data) => {

                //add chat to sender chat records
                chatId = socket.userId + '' + data.receiver.userId;
                const storeSenderMessage = await userInteface.addSenOneOnOneChats(formater.oneOnoneMessageFormat(chatId, [{ message: data.message, date: data.date }], []))

                // add chat to receiver chat records 
                //NOTE: at reciver end the chatId is the receiver Id plus the sender Id
                chatId = data.receiver.userId + '' + socket.userId;
                const storeReceiverMessage = await userInteface.addRecOneOnOneChats(formater.oneOnoneMessageFormat(chatId, [], [{ message: data.message, date: data.date }]))
                // emit or send message to reciever 
                
                if(storeReceiverMessage.status===203 && storeSenderMessage.status===203){
                    return socket.to(data.receiver.userId).emit('privateMessage', formater.privateChatMessageFormat(data.chatId, data.message, data.receiver, from))
                }else{
                    return socket.emit('error', new Error({ ChatStorageError: 'oops!! Something went wrong,try again later' })) 
                }
            })
        })

    })

}




module.exports = { chat }