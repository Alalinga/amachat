const { messageFormat,addUsers,getGroupUsers } = require("../utils/user")

function chat(io){
io.on('connection',(socket)=>{

    //socket.emit('message', "user connected")

    //send message to every on
   
   // socket.on('message',)

    //disconnect
    socket.on('disconnect',()=>{
        io.emit('message','User has left the group')
    })


   //receiving messages from the client side
   
   socket.on('joinGroup',(msg)=>{
       addUsers(socket.id,msg.username,msg.group)
        socket.join(msg.group)
       socket.on('sendChat',(message)=>{
        //emit the message sent my client to every one 
        //NOTE:(for personal clarification)  this emit simply means the server is kind of broadcasting the message sent by a user to anyone connected withen the server
        io.to(msg.group).emit('message', messageFormat(msg.username,message))
 
    })
   // socket.broadcast.to(msg.group).emit('joinAlert', messageFormat(msg.username,'has join the chat'))
    io.to(msg.group).emit('joinMembers', {group:msg.group,users:getGroupUsers(msg.group)})

   });

   socket.on('privateChat',(msg)=>{
       io.to(msg.username).emit('privateMessage',msg.message)
   })
})

}




module.exports = {chat}