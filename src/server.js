const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const {Server} =require('socket.io')
const bodyParser = require('body-parser')
const PORT = 5000 || process.env.PORT
const io = new Server(server)
//const chatRouter = require('./routes/chatRouters')(io)
const {ioModule,chatRouter} = require('./routes/chatRouters')
const { chat } = require('./chats/chat')

ioModule(io)
chat(io)
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',chatRouter)
    


server.listen(PORT,()=>{
    console.log(`Server litening on port http://localhost:${PORT}`);
})