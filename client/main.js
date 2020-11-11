var socket = io.connect('http://192.168.0.57:4000', { 'forceNew': true })

socket.on('messages', (data) => {

        console.log(data)
        render(data);

    }) // recoge el evento de chat.js


// para poder renderizar la data en el html
function render(data) {
    var html = data.map(function(message, index) {
        return (`
        
        <div class="message">
            <strong> ${message.nickname}</strong> dice:
            <p>${message.text}</p>
        </div>
        `)
    }).join('');

    var div_msgs = document.getElementById('messages');
    div_msgs.innerHTML = html;
    div_msgs.scrollTop = div_msgs.scrollHeight;
}


function addMessage(e) {

    var payload = {
        nickname: document.getElementById('nickname').value,
        text: document.getElementById('text').value
    };

    document.getElementById('nickname').style.display = 'none';
    socket.emit('add-message', message);
    return false;

}