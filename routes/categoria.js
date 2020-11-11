var express = require('express');
var app = express();
var middlewareAutentication = require('../middlewares/autentication')
var Categoria = require('../models/categoria');



//*****************************************************************************************************
//                                          RUTAS
//*****************************************************************************************************



//*****************************************************************************************************
//                                          Get Categorias
//*****************************************************************************************************

app.get('/', (request, response) => {

    // var since = request.query.since || 0; // lo que recibo por la url. Siguiente paso? .skip
    // since = Number(since);


    Categoria.find({}, ('nombre descripcion')) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
        .exec(

            (error, categorias) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: error
                    });
                }
                Categoria.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        categorias: categorias,
                        // total: count, // numero de usuario totales
                    });
                })
            })
})

//*****************************************************************************************************
//                                          Get Categoría
//*****************************************************************************************************

app.get('/:id', (req, resp) => {
    var id = req.params.id;
    Categoria.findById(id)
        // .populate('usuario', 'nombre img email')
        // .populate('hospital')
        .exec((error, categoria) => { // ejecuta la query a partir de aquí
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    menssage: 'Error al buscar Medico',
                    errors: error
                });
            }

            if (!categoria) {
                return resp.status(400).json({
                    ok: false,
                    menssage: 'El medico con id' + id + 'no existe'
                });
            }

            resp.status(200).json({
                ok: true,
                categoria: categoria
            });
        })
})


//*****************************************************************************************************
//                                          Añadir Categorias
//*****************************************************************************************************

app.post('/', (request, response) => {

    var body = request.body;
    var categoria = new Categoria({ // con esto creamos esta referencia para despues guardarlo
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    categoria.save((error, categoriaGuardada) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar medico',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            categoria: categoriaGuardada,
        });

    });
})

//*****************************************************************************************************
//                                          Actualizar Categorias
//*****************************************************************************************************

app.put('/:id', middlewareAutentication.verificaToken, (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body;

    Categoria.findById(id, (error, categoria) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }

        if (!categoria) { // sí, el usuario viene null 

            return response.status(400).json({
                ok: false,
                mensaje: 'La categoría con el' + id + 'no existe',
                errors: { menssage: 'No existe con este Id' }
            });
        }
        categoria.nombre = body.nombre;
        // medico.img = body.img;
        categoria.descripcion = body.descripcion;

        Categoria.save((error, medicoGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                usuario: medicoGuardado,
            });
        });
    });
});

//*****************************************************************************************************
//                                          Borrar Categorias
//*****************************************************************************************************

app.delete('/:id', middlewareAutentication.verificaToken, (request, response) => {

    var id = request.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Categoria.findByIdAndRemove(id, (error, categoriaBorrada) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: error
            });
        }

        if (!medicoBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        response.status(201).json({
            ok: true,
            categoria: categoriaBorrada,
        });
    })
})


module.exports = app;