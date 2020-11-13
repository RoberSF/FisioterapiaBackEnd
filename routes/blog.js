// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Librería para encriptar la contraseña
var Post = require('../models/blogPost'); // me permite usar todo lo que hay en usuarios.js
var jwt = require('jsonwebtoken') // librería para crear el token 
var middlewareAutentication = require('../middlewares/autentication')
var fs = require('fs'); // para borrar archivos
const fileUpload = require('express-fileupload'); // librería para subir archivos


// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
app.use(fileUpload());



//****************************************************RUTAS*******************************
//*****************************************************************************************


//*******************************************Obtener usuarios********************************
app.get('/', (request, response, next) => {

    var since = request.query.since || 0; // lo que recibo por la url. Siguiente paso? .skip
    since = Number(since); // localhost:4000/usuario?since=0,1,2...

    Post.find({}, ('title intro contenido categoria date comentarios img')) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
        .skip(since) // con esto le estoy diciendo que se salte los x registros "localhost:4000/usuario?since=5"
        .limit(5) // le estoy diciendo que me muestre sólo los 5 primeros registros. Siguiente paso? var = since
        .exec(

            (error, posts) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando post',
                        errors: error
                    });
                }

                Post.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        posts: posts,
                        total: count, // numero de post totales
                    });
                })


            })

})



app.get('/:id', (req, resp) => {

    var id = req.params.id;

    Post.findById(id)
        .exec((error, post) => { // ejecuta la query a partir de aquí
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    menssage: 'Error al buscar post',
                    errors: error
                });
            }

            if (!post) {
                return resp.status(400).json({
                    ok: false,
                    menssage: 'El post con id' + id + 'no existe'
                });
            }

            resp.status(200).json({
                ok: true,
                post: post
            });
        })
})



//***************************************** Crear posts******************************************************
// app.post('/', [ middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE],(request, response)=> { // mando el middleware como parámetro

app.post('/', (request, response) => { // mando el middleware como parámetro


    var body = request.body; // esto sólo va a funcionar si tengo el body-
    var date = new Date()
        //var dateES = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
        //var IsoDate = date.toISOString().substring(0, 10)

    var post = new Post({ // con esto creamos esta referencia para despues guardarlo
        title: body.title,
        intro: body.intro,
        contenido: body.contenido,
        categoria: body.categoria,
        date: date,
        comentarios: body.comentarios,
        //img: body.imagen
    });

    post.save((error, postGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar post',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            post: postGuardado,
        });
        console.log(postGuardado);

    });



})

// *****************************************Actualizar Datos*************************
app.put('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE_o_MISMOuSUARIO], (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body;
    var date = new Date()
    var dateES = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');


    Post.findById(id, (error, post) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar post',
                errors: error
            });
        }

        if (!post) { // sí, el usuario viene null 

            return response.status(400).json({
                ok: false,
                mensaje: 'El post con el' + id + 'no existe',
                errors: { menssage: 'No existe con este Id' }
            });

        }

        post.title = body.title;
        post.intro = body.intro;
        post.contenido = body.contenido;
        post.categoria = body.categoria;
        post.date = dateES;
        post.comentarios = body.comentarios;
        post.img = body.img

        post.save((error, postGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar post',
                    errors: error
                });
            }


            response.status(200).json({
                ok: true,
                post: postGuardado,
            });

        });

    });

});

//***********************************eliminar un usuario***********************************

app.delete('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE], (req, resp) => {

    var id = req.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Post.findByIdAndRemove(id, (error, postBorrado) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar post',
                errors: error
            });
        }

        resp.status(201).json({
            ok: true,
            post: postBorrado,
        });
    })
})



app.post('/postImg', (request, response) => { // mando el middleware como parámetro

    console.log(request.body);
    var body = request.body; // esto sólo va a funcionar si tengo el body ok
    var postImg = request.files.imagen;
    //var date = new Date() ok 
    //var dateES = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss'); // Da error


    // Obtener nombre del archivo para verificar que es una imagen
    var nombreCortado = postImg.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre y hace un array, pero sabemos que el ultimo(split) es la extension
    var extensionArchivo = nombreCortado[nombreCortado.length - 1] //cogemos la ultima palabra del array de nombreCortado


    // Solo aceptamos estas extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    // Nombre de archivo personalizado para que no haya conflictos. Podemos hacerlo de la manera que queramos
    // var newNameFile = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    var newNameFile = `123-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Muevo el archivo del limbo temporal a un path donde yo lo quiero
    var path = (`./uploads/posts/${newNameFile}`); // los parentesis son obligatorios

    postImg.mv(path, err => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        //subirPorTipo(tipo, id, newNameFile, response);

        var post = new Post({ // con esto creamos esta referencia para despues guardarlo
            title: body.title,
            intro: body.intro,
            contenido: body.contenido,
            categoria: body.categoria,
            date: new Date(),
            comentarios: body.comentarios,
            img: newNameFile,
            idAuthor: body.idAuthor
        });

        // console.log(post);

        post.save((error, postGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al guardar post',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                post: postGuardado,
            });

        });

    })

})




module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso