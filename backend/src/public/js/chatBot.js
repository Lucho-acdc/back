document.addEventListener("DOMContentLoaded", (event) => {
    const socket = io(); 

    socket.on('chat message', function(msg) {
        const item = document.createElement('li');
        item.textContent = msg;
        document.getElementById('messages').appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
});