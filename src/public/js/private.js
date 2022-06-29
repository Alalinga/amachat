import socket from "./connection.js";
//const { socket } = require("./connection");
const USERS = []
const sendButton = document.getElementById('form');
const input = document.getElementById('input');
const userList = document.getElementById('users-list');
const privateChats = document.getElementById('chat');
let listOfFriends = document.getElementsByClassName('group-list')
let isUserSelected = false;
const URL = window.location.origin;
let privateChatId = null
let receiver = null
let userChatId = null

const { username, type} = Qs.parse(location.search, { ignoreQueryPrefix: true })





/* functions declarations */
const getCurrentUser = (user, id) => {
    return user.find(u => u.userId === id)
}
function onUserSelectListerner() {
    alert('clicked')
    //if (!receiver) return;
    // console.log('start chat', { sender, receiver })
    // socket.emit('select user', { sender, receiver })

}

const getTime = () => {
    const date = new Date()
    return date.getHours() + ':' + date.getMinutes()
}
//display users <a href='${URL}/private.html?username=${username}&to=${user.userName}&userChatId=${user.userId}&type=private?'>${user.userName}<a> 
const displayUsers = (users) => {
    const userlist = `${users.map(user => `<li class='group-list' data-id="${user.userId}" data-user="${user.userName}">${user.userName}</li>`).join('')}`
    userList.innerHTML = userlist
}

const displayMyChats = (chats) => {
    const list = document.createElement('li');
    list.classList.add('self');
    const chat = ` <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div><div class="msg"><p style="color:black;font-weight:bold; font-size:12px">${chats}</p><time>${getTime()}</time></div>`
    list.innerHTML = chat
    privateChats.appendChild(list);
    window.scrollTo(0, privateChats.scrollHeight)
}
const displayFriendChats = (chats) => {
    const list = document.createElement('li');
    list.classList.add('other');
    const chat = ` <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div><div class="msg"><p style="color:black;font-weight:bold; font-size:12px">${chats.message}</p><time>${chats.time}</time></div>`
    list.innerHTML = chat
    privateChats.appendChild(list);
    window.scrollTo(0, privateChats.scrollHeight)
    

}


// return home function
const home = () => {
    localStorage.clear()
    return window.location.href = 'index.html';
}

const sendPrivateChat = (receiver, message) => {
    if (!receiver) {
        alert('Please select a user to chat with')
        return
    }
    console.log("chatId already exist ", privateChatId)
    const chatId = privateChatId || localStorage.getItem('userId') + '' + receiver.userId;
    console.log("chatId =>", chatId)
    displayMyChats(input.value)
    return socket.emit('privateChat', { receiver, message, date: getTime(), chatId })
}

// receiving message from private chat
const getPrivateChat = (innersocket) => {
    innersocket.on('privateMessage', (msg) => {
        displayFriendChats(msg)
    });
}
function toggleSidebar(e) {
    e.preventDefault()
    document.getElementById('sidebar').style.display = 'block';
}
const navigator = (username, type) => {
    const userId = localStorage.getItem('userId');
    if (!username || !type) {
        return home()
    }
    if (username && type) {

        if (userId) {
            console.log('yes i got userId');
            socket.auth = { userId };
            socket.auth.username = username;
        } else {
            console.log('yes i got username');
            socket.auth = { username };
        }

    }
    console.log('ok to connect')
    return socket.connect()
}
/** Socket events listerners */

//After user been connect listen for user data and store it to localStorage and add userId to socket auth
socket.on('userInfo', (user) => {
    console.log("my info", user)
    const userId = user.userId
    socket.auth = { userId }
    localStorage.setItem('userId', userId)
    // socket.userId =userId;
})

// send message to private chat
/* 
   1. select user
   2. write message
   3. send message(message,from-sender,to-reciever) to user 
   on first chat store username,userId,
   on subsequent chat, retrieve messages (advance)
   */


socket.on('privateMessage', (msg) => {
    console.log('received message', msg)
    privateChatId = msg.chatId
    displayFriendChats(msg)
});

//get users from server site
socket.on('users', (users) => {

    users.forEach(user => {
        if (USERS.find(u => u.userId === user.userId) === undefined) USERS.push(user)
    });

    displayUsers(USERS)
});

socket.on('user connected', (user) => {
    console.log('connected users', user)
    if (USERS.find(u => u.userId === user.userId) === undefined) {
        USERS.push(user)
    }
    displayUsers(USERS)
    // userList.innerHTML +=`<li class='group-list' onclick="onUserSelectListerner(this)"><a href='${URL}/private.html?username=${username}&to=${user.username}&type=private?'>${user.username}<a> </li>`
})


socket.on('room created', (roomId) => {
    localStorage.setItem('roomId', roomId)

});

socket.on('old-chat', (data) => {
    console.log('old chats', data)
})


/* functions call */
navigator(username, type)

//at first entry connect user using username 


//getPrivateChat(socket)


// on button click execute sendprivatechat function
sendButton.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('data',receiver);
    sendPrivateChat(receiver, input.value);
    input.value = '';
    input.focus()
});

userList.addEventListener('click', (event) => {
    //set the Id of the user on user select
    receiver = {username:event.target.dataset.user,userId: event.target.dataset.id}
    const sender = {username,userId: localStorage.getItem('userId')}
    socket.emit('selected-user', { sender, receiver })

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

    // sendPrivateChat(username, message) {

    //     return socket.emit('privateChat', { to: username, message: message })
    // }

    home() {
        return window.location.href = 'index.html';
    }


}
