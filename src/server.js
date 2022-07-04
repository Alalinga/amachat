const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const PORT = 5000 || process.env.PORT
const io = new Server(server)
const { chatRouter } = require('./api/chatRouters')
const { chat } = require('./chats/chat')
const { StoreSessions } = require('./utils/sessionstore')
const { User } = require('./utils/user')
const { getDate } = require('./utils/date')
const sessionStore = new StoreSessions()
const newUser = new User
//NOTE: change contentSecurityPolicy to true when you are done with the api testing
app.use(helmet({contentSecurityPolicy: false,}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//ioModule(io) variables api url  url = ''
app.use('/api', chatRouter)
io.use((socket, next) => {

    const userId = socket.handshake.auth.userId;
    const username = socket.handshake.auth.username;
    // when user refreshes the page, socket need not generate a new id again, we get the old id and fetch it data from the databse aka session
    if (userId) {
        const session = sessionStore.getSession(userId);

        //If the id provided is in the database aka session, then set it to socket for communication
        // at this point we dont want socket to use it newly generated id for the connection
        if (session) {
            socket.userId = session.userId;
            socket.username = session.username;
            return next()
        }

    }

    // if it is user first connection and without a name throw error
    if (!username) {
        return next(new Error('Please provide a valid username'))
    };

    //At user first connection set up username and user Id to be used for session
    socket.username = username;
    socket.userId = socket.id;

    //NOTE: session here could be a database.
    sessionStore.saveSession(socket.userId, { userId: socket.userId, username: socket.username })
    next();
})

chat(io)



server.listen(PORT, () => {
    console.log(`Server litening on port http://localhost:${PORT}`);
})