// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Librería para encriptar la contraseña
var Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js
var jwt = require('jsonwebtoken') // librería para crear el token 
var middlewareAutentication = require('../middlewares/autentication')



//****************************************************RUTAS*******************************
//*****************************************************************************************


//*******************************************Obtener usuarios********************************
app.get('/', (request, response, next) => {

    var since = request.query.since || 0; // lo que recibo por la url. Siguiente paso? .skip
    since = Number(since); // localhost:4000/usuario?since=0,1,2...

    Usuario.find({}, ('nombre email number img role google')) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
        .skip(since) // con esto le estoy diciendo que se salte los x registros "localhost:4000/usuario?since=5"
        .limit(5) // le estoy diciendo que me muestre sólo los 5 primeros registros. Siguiente paso? var = since
        .exec(

            (error, usuarios) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: error
                    });
                }

                Usuario.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: count, // numero de usuario totales
                    });
                })


            })

})


//***************************************** Crear usuarios******************************************************
// app.post('/', [ middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE],(request, response)=> { // mando el middleware como parámetro

app.post('/', (request, response) => { // mando el middleware como parámetro

    var body = request.body; // esto sólo va a funcionar si tengo el body-parser

    var usuario = new Usuario({ // con esto creamos esta referencia para despues guardarlo
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // encriptación automática
        number: body.number,
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            usuarios: usuarioGuardado,
            usuarioToken: request.usuario // con esto sabemos quien fue el usuario que hizo el post después de pasar por el middlware
        });

    });


})

// *****************************************Actualizar Datos*************************
app.put('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE_o_MISMOuSUARIO], (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body;

    Usuario.findById(id, (error, usuario) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usario',
                errors: error
            });
        }

        if (!usuario) { // sí, el usuario viene null 

            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: { menssage: 'No existe con este Id' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.number = body.number,
            usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usario',
                    errors: error
                });
            }

            usuarioGuardado.password = ':)' // no es que elimine la contraseña, si no, que es como una especie de exclusión para que no se muestre
                // lo guardo dentro del callback del save ya que el save, ya ocurrió.
            response.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: request.usuario // con esto sabemos quien fue el usuario que hizo el post después de pasar por el middlware
            });

        });

    });

});

//***********************************eliminar un usuario***********************************

app.delete('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE], (req, resp) => {

    var id = req.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usario',
                errors: error
            });
        }

        resp.status(201).json({
            ok: true,
            usuario: usuarioBorrado,
            usuarioToken: req.usuario // con esto sabemos quien fue el usuario que hizo el post después de pasar por el middlware
        });
    })
})

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso