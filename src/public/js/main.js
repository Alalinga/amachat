
import socket from "./connection.js";
const form = document.getElementById('form');

const input = document.getElementById('input');
let messages = document.getElementById('messages');
const group_Members = document.getElementById('users');
const chatList = document.getElementById('chat');
const chatBody = document.getElementById('chatBody')
const groupName = document.getElementById('room-name')

const { username, group } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const getTime =()=>{
    const date = new Date();
    const minutes = date.getMinutes() <10? '0'+date.getMinutes():date.getMinutes()
    return date.getHours()+':'+minutes
}
const getCurrentUser = (user, id) => {
    return user.find(u => u.userId === id)
}
const displayUsers = (users) => {

    const userList = `${users.map(user => `<li class='group-list'><a href='private.html?username=${user.userName}&type=private?'>${user.userName}<a> </li>`).join('')}`
}

//at first entry connect user using username
if (username && group) {
    //const userId = localStorage.getItem('userId')
    socket.auth = {username};
    //socket.username = username;
    socket.connect();
    socket.emit('joinGroup', { username, group });
    
} else {
    localStorage.clear()
    window.location.href = 'index.html';
}

const displayMyChats = (chats) => {

    const list = document.createElement('li');
    list.classList.add('self');
    const chat = ` <div class="avatar"><img src="./img/chatImage.png" draggable="false" /></div><div class="msg"><p style="color:black;font-weight:bold; font-size:12px">${chats}</p><time>${getTime()}</time></div>`
    list.innerHTML = chat
    chatList.appendChild(list);
    window.scrollTo(0, chatList.scrollHeight)
}
const displayFriendChats = (chats) => {
    console.log(chats)
    const list = document.createElement('li');
    list.classList.add('other');
    const chat = ` <div class="avatar"><img src="./img/chatImage.png" draggable="false" /></div><div class="msg"><p style="color:#d9534f">${chats.user}</p><p style="color:black;font-weight:bold; font-size:12px">${chats.message}</p><time>${chats.time}</time></div>`
    list.innerHTML = chat
    chatList.appendChild(list);
    window.scrollTo(0, chatList.scrollHeight)
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        console.log('okkk',e.target.value)
        //sedning message to server
        socket.emit('sendChat', input.value);
        displayMyChats(input.value)
        input.value = ''
        input.focus()
    }
})

//After user been connect listen for user data and store it to localStorage and add userId to socket auth
socket.on('userInfo',(user)=>{
    const userId = user.userId
    socket.auth={userId}
    localStorage.setItem('userId',userId)
    socket.userId =localStorage.getItem('userId');
});

socket.on('userDisconnected',(user)=>{
    console.log(user,'disconnected')
})
socket.on('connection_err', (err) => {
    if (err.message.includes('valid username')) {
        // do sothing if there is an error relating to user
    }
})
socket.on('error',(error)=>{
    console.log('I receive this ',error)
})
// socket.on('message',(message)=>{
//     console.log('We got message',message)
// })
socket.on('message', (msg) => {
    displayFriendChats(msg)

});

socket.on('joinAlert', (message) => {
    // alert(message.user+' '+message.message)
    displaydisplayGroupMenbers(message.user)

});
socket.on('joinMembers', (data) => {
    console.log(data)
    groupName.innerHTML = data.groupName
   displayGroupMenbers(data.members)

});


const displayGroupMenbers = (members) => {
    // const id = localStorage.getItem('userId');
    // const u = members.find(user=>user.userId===id);
    console.log('Bfore',members)
    // if(u!==-1){
    // const newmembers= members.splice(members.indexOf(u),1)
    // console.log('After',newmembers)
    // }
    group_Members.innerHTML = `${members.map(user => `<li class='group-list'><a href='private.html?username=&to=${user.username}&type=private?'>${user.username}<a> </li>`).join('')}`
    
}


const privateChat = (username, message) => {
    socket.emit('privateChat', { username: username, message, message })
}

const navigateToPrivate = (username) => {
    window.location.href = `private.html?username=${username}&type=private/`
}
const getGroupList = () => {
    const list = document.getElementsByClassName('group-list');
    for (let i = 0; i < list.length; i++) {
        console.log(i, list[i].innerHTML)
    }
}