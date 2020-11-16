// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Post = require('../models/blogPost');
var categoria = require('../models/categoria')



// ********************RUTAS*******************************




//*****************************************************************************************************************
//                                      Busqueda General
//*****************************************************************************************************************

app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda; //esto es lo que la persona está escribiendo en ":busqueda"

    var regex = new RegExp(busqueda, 'i'); //funcion pura de javascript. La "i" para que sea insensible a las mayusculas y minusculas


    Promise.all([ // nos permite mandar un array de promesas y si se cumplen todas ejecuta el then y si no manejamos el catch
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuario(busqueda, regex),
        buscarPost(busqueda, regex)
    ]).then(respuestas => {

        response.status(200).json({
            ok: true,
            hospitales: respuestas[0], //van en el orden que establezco en el array de promesas
            medicos: respuestas[1],
            usuarios: respuestas[2],
            posts: respuestas[3]

        });
    })
}); // hasta aquí método get

//*****************************************************************************************************************
//                                      Busqueda por colección
//*****************************************************************************************************************

app.get('/coleccion/:tabla/:busqueda', (request, response) => {

    var busqueda = request.params.busqueda;
    var tabla = request.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;
    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;
        case 'blog':
            promesa = buscarPost(busqueda, regex)
            break;
        case 'categoria':
            promesa = buscarCategoria(busqueda, regex)
            break;

        default:
            response.status(400).json({
                ok: false,
                message: 'Los tipos de busca son usuarios, medicos u hospitales'

            });

    }

    promesa.then(data => {
        response.status(200).json({
            ok: true,
            tabla: data // con los corchetes le estoy diciendo que tabla es el nombre de la colección. Sería algo dinamico

        });
    })





})



//***************************************************************************************************** */
//                                      Promesas
//******************************************************************************************************** */


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((error, hospitales) => {

                if (error) {

                    reject('No se encuentra hospitales', error);

                } else {
                    resolve(hospitales) //mando la data de los hospitales
                }
            });
    });
}


function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((error, medicos) => {

                if (error) {

                    reject('No se encuentra hospitales', error);

                } else {
                    resolve(medicos) //mando la data de los hospitales
                }
            });
    });
}

// nos imaginamos que buscamos por el nombre y por el email a la vez
function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img') // así no me sale el password
            .or([{ 'nombre': regex }, { 'email': regex }]) // es una expresion del mongoose. Es un array de condiciones
            .exec((error, usuarios) => {
                if (error) {

                    reject('No se encuentra usuarios', error);

                } else {
                    resolve(usuarios) //mando la data de los hospitales
                }
            })
    })
}

function buscarPost(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Post.find({}, 'title categoria intro contenido date comentarios img') // así no me sale el password
            .or([{ 'title': regex }, { 'intro': regex }, { 'categoria': regex }]) // es una expresion del mongoose. Es un array de condiciones
            .exec((error, posts) => {
                if (error) {

                    reject('No se encuentra posts con esas referencias', error);

                } else {
                    resolve(posts) //mando la data de los hospitales
                }
            })
    })
}

function buscarCategoria(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Post.find({}, 'title categoria intro contenido date comentarios img') // así no me sale el password
            .or([{ 'title': regex }, { 'intro': regex }, { 'categoria': regex }]) // es una expresion del mongoose. Es un array de condiciones
            .exec((error, posts) => {
                if (error) {

                    reject('No se encuentra posts con esas referencias', error);

                } else {
                    resolve(posts) //mando la data de los hospitales
                }
            })
    })
}

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso