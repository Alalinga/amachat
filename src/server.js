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
const { networkInterfaces } = require('os')
// const newarr = [{name:'mube',id:1},{name:'mubert',id:8},{name:'copat',id:2},{name:'petro',id:3}]
// const fi = newarr.find(m=>m.name==='petro')
// console.log(newarr.indexOf(fi))

app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',chatRouter)
io.use((socket,next)=>{
    const username = socket.handshake.auth.username;
    if(!username){
        console.log('provide user name for connection')
        return next(new Error('Please provide a valid username'))
    }
    socket.username = username;
    next();
})    
ioModule(io)
chat(io)

server.listen(PORT,()=>{
    console.log(`Server litening on port http://localhost:${PORT}`);
})