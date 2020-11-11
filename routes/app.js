// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();





// ********************RUTAS*******************************
app.get('/', (request, response, next) => {

    response.status(200).json({ 
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })


})

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso