const express = require("express");
const {addUser,getUser, messageFormat} = require("../utils/user");
const chatRouter = express.Router()

const ioModule = io=>{
    io.on('connection', (socket)=>{

        socket.on('disconnect',(message)=>{
            io.emit('chat message',messageFormat('user','left the chat'))
        });
        //send and receive chat
        chatRouter.get('/chat',(req,res)=>{
            // res.send('ok').status(200)
            socket.on('send chat',(msg)=>{
                io.emit('chat message', messageFormat('admin',msg))
                res.send(msg).status(200)
           })
        });

        //send chat
        chatRouter.post('/chat',(req,res)=>{
            io.emit('send chat',req.body.message)
        })
       
       //join group
      
       chatRouter.post('/group',(req,res)=>{
         username = req.body.name
         group = req.body.group
        socket.emit('groupChat',{username,group})
         res.send({username,group})
       })

       socket.on('groupChat',({user,group})=>{
        const userJoin = addUser(socket.id,user,group)
        socket.join(userJoin.group)
        console.log('some has join',socket.id,userJoin)

        })

    });
}





module.exports = {ioModule,chatRouter}