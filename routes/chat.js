// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server)


var jwt = require('jsonwebtoken') // librería para crear el token 
var middlewareAutentication = require('../middlewares/autentication')




app.use(express.static('client'));


// ********************RUTAS*******************************
app.get('/', [middlewareAutentication.verificaToken], (request, response, next) => {



    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
})


var messages = [{
    id: 1,
    text: 'Bienvenido al chat privado',
    nickname: 'Bot - Bichillo'

}]

io.on('connection', (socket) => { //recibimos una serie de parametros 'socket'

    console.log('el cliente con IP:' + socket.handshake.address + 'se ha conectado')

    socket.emit('messages', messages) //emite este evento para ser recogido en el main.js

    socket.on('add-message', (data) => {
        messages.push(data); //recibo el evento de main.js que sería el mensaje del client que envía
        io.sockets.emit('menssages', messages)
    })

})



module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde l