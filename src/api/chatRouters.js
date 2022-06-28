const express = require("express");
const { User } = require("../utils/user");
const chatRouter = express.Router();
const path = require('path');
const { basename } = require("path");

const user = new User();

chatRouter.get('/test', (req, res) => {
    console.log("I am in to render",__dirname)
    res.sendFile(path.join(process.cwd(), 'src/public/index.html'))

})


// const ioModule = io => {
//     //console.log('ok working', io)
//     io.on('connection', (socket) => {
//         console.log('just got connected, ok working')
//         socket.on('disconnect', (message) => {
//             io.emit('chat message', user.messageFormat('user', 'left the chat'))
//         });
//         //send and receive chat
//         chatRouter.get('/chat', (req, res) => {
//             // res.send('ok').status(200)
//             socket.on('send chat', (msg) => {
//                 io.emit('chat message', user.messageFormat('admin', msg))
//                 res.send(msg).status(200)
//             })
//             res.send('hi').status(200)
//         });

//         //send chat
//         chatRouter.post('/chat', (req, res) => {
//             io.emit('send chat', req.body.message)
//         })

//         //join group

//         chatRouter.post('/group', (req, res) => {
//             username = req.body.name
//             group = req.body.group
//             socket.emit('groupChat', { username, group })
//             res.send({ username, group })
//         })

//         socket.on('groupChat', ({ user, group }) => {
//             const userJoin = user.addUser(socket.id, user, group)
//             socket.join(userJoin.group)
//             console.log('some has join', socket.id, userJoin)

//         })

//     });

// }





module.exports = { chatRouter }