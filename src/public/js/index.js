const privateButton = document.getElementById('private');
const groupButton = document.getElementById('group');
const username = document.getElementById('username');
const groupname = document.getElementById('groupname');
const form = document.getElementById('homeform')


privateButton.addEventListener('click', (e) => {
    e.preventDefault()
    const username = form.elements.item(0).value;
    if (!username) return
    const URL = window.location.origin + `/private.html?username=${username}&type=private`
    window.location.href = URL
});

