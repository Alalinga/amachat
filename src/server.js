const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const {Server, Socket} =require('socket.io')
const PORT = 5000 || process.env.PORT
const io = new Server(server)

app.use(express.static(path.join(__dirname,'public')))
// app.get('/',(req,res)=>{

//     res.sendFile(__dirname + '/public/index.html')
// });

io.on('connection',(socket)=>{
    console.log('User connected')

    socket.on('send chat',(msg)=>{
        io.emit('chat message', msg)
    })
})

server.listen(PORT,()=>{
    console.log(`Server litening on port http://localhost:${PORT}`);
})