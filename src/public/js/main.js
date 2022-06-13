
const socket = io()

const form = document.getElementById('form');
const input = document.getElementById('input');
let messages = document.getElementById('messages');
const group_Members = document.getElementById('users');
const {username,group} = Qs.parse(location.search,{ignoreQueryPrefix:true})

if(username && group){
    socket.emit('joinGroup',{username,group});
}else{
    window.location.href = 'index.html';
    console.log(yes)
}
form.addEventListener('submit',(e)=>{
   e.preventDefault()
   if(input.value){
       //sedning message to server
       socket.emit('sendChat',input.value)     
       input.value=''
       input.focus()
   }
})

// socket.on('message',(message)=>{
//     console.log('We got message',message)
// })
socket.on('message',(msg)=>{
    var item = document.createElement('li')
    item.textContent =msg.user+ '=>'+ msg.message
    messages.appendChild(item)
    window.scrollTo(0,document.body.scrollHeight)

});


socket.on('joinAlert',(message)=>{
   // alert(message.user+' '+message.message)
    groupMenbers(message.user)

});
socket.on('joinMembers',(members)=>{
    console.log(members)
        groupMenbers(members.users)
    
    // alert(message.user+' '+message.message)
     //groupMenbers(message.user)
 
 });


const groupMenbers = (members)=>{
    // var item = document.createElement('li')
    // for(let member of members){
    //     item.textContent =member.username   
    // }
    group_Members.innerHTML = `${members.map(user =>`<li class='group-list'><a href='private.html?username=${user.username}&type=private?'>${user.username}<a> </li>`).join('')}`  
}

const privateChat = (username,message)=>{
    socket.emit('privateChat',{username:username,message,message})
}

const navigateToPrivate = (username)=>{
    window.location.href = `private.html?username=${username}&type=private/`
}
const getGroupList = ()=>{
    const list = document.getElementsByClassName('group-list');
    for(let i=0; i<list.length; i++){
        console.log(i,list[i].innerHTML)
    }
}