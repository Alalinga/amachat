const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const PORT = 5000 || process.env.PORT
const io = new Server(server)
//const chatRouter = require('./routes/chatRouters')(io)
const { ioModule, chatRouter } = require('./routes/chatRouters')
const { chat } = require('./chats/chat')
const { StoreSessions } = require('./utils/sessionstore')
const { User } = require('./utils/user')
const sessionStore = new StoreSessions()
const newUser = new User
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(express.session({
//     store: sessionstore.createSessionStore()
// }))

app.use('/api', chatRouter)
io.use((socket, next) => {
    //check if user has session infor
    const userId = socket.handshake.auth.userId;
    const username = socket.handshake.auth.username;
    // console.log('username',username)
    if (userId) {
        const session = sessionStore.getSession(userId);

        if (session) {
            // console.log('second time with data ', sessionStore.getAllSessions())
            socket.userId = session.userId;
            socket.username = session.username;
            return next()
        }
        // this code is here because anytime the server get refreshed the session get cleared meanwhile we still have user id and name so we store those in the session again and proceed
        // NOTE: this code can be removed when using real database, 
        // socket.userId = userId;
        // //socket.username = username;
        // sessionStore.saveSession(socket.userId, { userId: socket.userId, username: socket.username })
        // console.log('second time but no session',socket.handshake.auth.username, sessionStore.getAllSessions())
        // return next()
    }

    // if first connection and without a name throw error
    if (!username) {
        return next(new Error('Please provide a valid username'))
    };

    //At first connection set up username and user Id to be used for session

    socket.username = username;
    socket.userId = socket.id;
    // console.log('first Time', socket.userId)
    sessionStore.saveSession(socket.userId, { userId: socket.userId, username: socket.username })
    // console.log('session store',sessionStore.getSession(socket.userId))
    next();
})
ioModule(io)
chat(io)



server.listen(PORT, () => {
    console.log(`Server litening on port http://localhost:${PORT}`);
})