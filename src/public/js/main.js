
const socket = io()

const form = document.getElementById('form');
const input = document.getElementById('input');
let messages = document.getElementById('messages')

form.addEventListener('submit',(e)=>{
   e.preventDefault()
   if(input.value){
       socket.emit('send chat',input.value)     
       input.value=''
       input.focus()
   }
})

socket.on('chat message',(msg)=>{
    var item = document.createElement('li')
    item.textContent = msg
    messages.appendChild(item)
    window.scrollTo(0,document.body.scrollHeight)

});