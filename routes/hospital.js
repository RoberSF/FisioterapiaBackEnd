var express = require('express');
var app = express();
var middlewareAutentication = require('../middlewares/autentication')
var Hospital = require('../models/hospital');



//*****************************************************************************************************
//                                          RUTAS
//*****************************************************************************************************



//*****************************************************************************************************
//                                          Get Hospitales
//*****************************************************************************************************

app.get('/', (request, response) => {

    var since = request.query.since || 0; // lo que recibo por la url. Siguiente paso? .skip
    since = Number(since);

    Hospital.find({}) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
        .skip(since) // con esto le estoy diciendo que se salte los x registros "localhost:4000/usuario?since=5"
        .limit(5) // le estoy diciendo que me muestre sólo los 5 primeros registros. Siguiente paso? var = since
        .populate('usuario', 'nombre email') // que tabla y que campos quiero de la tabla relacionada. Así cuando haga la petición get voy a saber quien la hizo
        .exec(

            (error, hospitales) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: error
                    });
                }

                Hospital.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: count, // numero de usuario totales
                    });
                })
            })
})


//*****************************************************************************************************
//                                          Get Hospital
//*****************************************************************************************************

app.get('/:id', (req, resp) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((error, hospital) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    menssage: 'Error al buscar Hospital',
                    errors: error
                });
            }

            if (!hospital) {
                return resp.status(400).json({
                    ok: false,
                    menssage: 'El hospital con id' + id + 'no existe'
                });
            }

            resp.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
})


//*****************************************************************************************************
//                                          Añadir Hospitales
//*****************************************************************************************************

app.post('/', middlewareAutentication.verificaToken, (request, response) => {

    var body = request.body;
    var hospital = new Hospital({ // con esto creamos esta referencia para despues guardarlo
        nombre: body.nombre,
        usuario: request.usuario._id,
        img: body.img
    });

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });
})

//*****************************************************************************************************
//                                          Actualizar Hospitales
//*****************************************************************************************************

app.put('/:id', middlewareAutentication.verificaToken, (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body;

    Hospital.findById(id, (error, hospital) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }

        if (!hospital) { // sí, el usuario viene null 

            return response.status(400).json({
                ok: false,
                mensaje: 'El hospital con el' + id + 'no existe',
                errors: { menssage: 'No existe con este Id' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = request.usuario._id; // de la request quiero esto

        hospital.save((error, hospitalGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
            });
        });
    });
});

//*****************************************************************************************************
//                                          Borrar Hospitales
//*****************************************************************************************************

app.delete('/:id', middlewareAutentication.verificaToken, (request, response) => {

    var id = request.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: error
            });
        }

        if (!hospitalBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        response.status(201).json({
            ok: true,
            hospital: hospitalBorrado,
        });
    })
});


module.exports = app;