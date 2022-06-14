import socket from "./connection.js";
//const { socket } = require("./connection");

const sendButton = document.getElementById('form');
const input = document.getElementById('input');
const userList = document.getElementById('users-list');
const privateChats = document.getElementById('chat');
const friendChats = document.getElementById('')
let isUserSelected = false;
const URL = window.location.origin;

const { username, type, to } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const getCurrentUser = (user, id) => {
    return user.find(u => u.userId === id)
}
//display users
const displayUsers = (users) => {
    //console.log(users)
    const userlist = `${users.map(user => `<li class='group-list'><a href='${URL}/private.html?username=${username}&to=${user.userName}&type=private?'>${user.userName}<a> </li>`).join('')}`
    userList.innerHTML = userlist
}

const displayMyChats = (chats) => {

    const list = document.createElement('li');
    list.classList.add('self');
    const chat = ` <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div><div class="msg"><p>${chats}<emoji class="pizza" /></p><time>20:17</time></div>`
    list.innerHTML = chat
    privateChats.appendChild(list);
    window.scrollTo(0, privateChats.scrollHeight)
}
const displayFriendChats = (chats) => {
    console.log(chats)
    const list = document.createElement('li');
    list.classList.add('other');
    const chat = ` <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div><div class="msg"><p>${chats}<emoji class="pizza" /></p><time>20:17</time></div>`
    list.innerHTML = chat
    privateChats.appendChild(list);
    window.scrollTo(0, privateChats.scrollHeight)

}

//get users from server site
socket.on('users', (users) => {
    // const cUser = getCurrentUser(users, socket.id)
    // users = users.splice(users.indexOf(cUser), 1)
    displayUsers(users)

})
/* functions declarations */

// return home function
const home = () => {
    return window.location.href = 'index.html';
}

// send message to private chat
/* 
   1. select user
   2. write message
   3. send message(message,from-sender,to-reciever) to user 
   on first chat store username,userId,
   on subsequent chat, retrieve messages (advance)
   */
const sendPrivateChat = (username, message) => {
    return socket.emit('privateChat', { to: username, message: message })
}

// receiving message from private chat
const getPrivateChat = (innersocket) => {
    innersocket.on('privateMessage', (msg) => {
        displayFriendChats(msg.message)
    });
}
socket.on('privateMessage', (msg) => {
    displayFriendChats(msg.message)
});

const onUserSelectListerner = (username) => {
    isUserSelected = true;
    socket.auth = { username };
    socket.connect()
}


/* functions call */


// on page load chech if user is on the right page 
if (!username || !type) {
    home()
} else {
    onUserSelectListerner(username)
}

//getPrivateChat(socket)


// on button click execute sendprivatechat function
sendButton.addEventListener('submit', (e) => {
    e.preventDefault()

    sendPrivateChat(to, input.value);
    displayMyChats(input.value)
    input.value = '';
    input.focus()
})


class PrivateChat {
    constructor(socket) {
        this.socket = socket;
        this.socket.on('privateMessage', (msg) => {
        });
    }

    getPrivateChat() {
        this.socket.on('privateMessage', (msg) => {
        });
    }

    sendPrivateChat(username, message) {
        return socket.emit('privateChat', { to: username, message: message })
    }

    home() {
        return window.location.href = 'index.html';
    }


}