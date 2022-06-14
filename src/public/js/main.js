
import socket from "./connection.js";
const form = document.getElementById('form');

const input = document.getElementById('input');
let messages = document.getElementById('messages');
const group_Members = document.getElementById('users');
const { username, group } = Qs.parse(location.search, { ignoreQueryPrefix: true })
let mySelf = null;


// const onUserSelectListerner = (username) => {
//     //isUserSelected = true;
//     socket.auth = { username };
//     socket.connect()
// }

const getCurrentUser = (user, id) => {
    return user.find(u => u.userId === id)
}
const displayUsers = (users) => {

    const userList = `${users.map(user => `<li class='group-list'><a href='private.html?username=${user.userName}&type=private?'>${user.userName}<a> </li>`).join('')}`
}
if (username && group) {
    //onUserSelectListerner(username)
    socket.auth = { username };
    socket.connect();
    socket.emit('joinGroup',{username,group});
} else {
    window.location.href = 'index.html';
}
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        //sedning message to server
        socket.emit('sendChat', input.value)
        input.value = ''
        input.focus()
    }
})


socket.on('connection_err', (err) => {
    if (err.message.includes('valid username')) {
        // do sothing if there is an error relating to user
    }
})

// socket.on('message',(message)=>{
//     console.log('We got message',message)
// })
socket.on('message', (msg) => {
    var item = document.createElement('li')
    item.textContent = msg.user + '=>' + msg.message
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)

});


socket.on('joinAlert', (message) => {
    // alert(message.user+' '+message.message)
    groupMenbers(message.user)

});
socket.on('joinMembers', (members) => {
    console.log(members)
    groupMenbers(members.users)

    // alert(message.user+' '+message.message)
    //groupMenbers(message.user)

});

// socket.on('users', (users) => {
//     console.log(users)
//     const cUser = getCurrentUser(users, socket.id)
//     users = users.splice(users.indexOf(cUser), 1)
//     displayUsers(users)

// })


const groupMenbers = (members) => {
    // var item = document.createElement('li')
    // for(let member of members){
    //     item.textContent =member.username   
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