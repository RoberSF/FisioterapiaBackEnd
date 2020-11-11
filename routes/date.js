// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var pickDate = require('../models/pickDate');
var moment = require('moment');
moment().format();
moment.locale('es')




// ********************RUTAS*******************************

app.get('/', (request, response, next) => {



    pickDate.find({}, ('nombre date zone symptoms userId'))
        .exec(

            (error, dates) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando fechas',
                        errors: error
                    });
                }


                response.status(200).json({
                    ok: true,
                    dates: dates
                });



            })

})

app.get('/searchDate/:fecha', (request, response, next) => {

    var busqueda = request.params.fecha

    var dateES = moment.utc(busqueda).local().format('YYYY-MM-DD HH:mm:ss');

    pickDate.find({ date: dateES }, 'date')
        .exec(

            (error, dates) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando fechas',
                        errors: error
                    });

                }


                response.status(200).json({
                    ok: true,
                    dates: dates
                });



            })


})



app.post('/', (request, response) => {

    var body = request.body; // esto sólo va a funcionar si tengo el body-parser
    var date = moment(body.date).format('YYYY-MM-DD HH:mm:ss');
    var dateES = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');


    var dates = new pickDate({
        nombre: body.nombre,
        date: dateES,
        zone: body.zone,
        symptoms: body.symptoms,
        observations: body.observations,
        userId: body.userId
    });

    dates.save((error, citaGuardada) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar cita',
                errors: error
            });
        }
        response.status(200).json({
            ok: true,
            citas: citaGuardada,
        });

    });


})


app.delete('/:id', (req, resp) => {

    var id = req.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    pickDate.findByIdAndRemove(id, (error, citaBorrada) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cita',
                errors: error
            });
        }

        resp.status(201).json({
            ok: true,
            cita: citaBorrada,
            // usuarioToken: req.usuario // con esto sabemos quien fue el usuario que hizo el post después de pasar por el middlware
        });
    })
})



// app.get('/', (request, response, next) => {

//     response.status(200).json({
//         ok: true,
//         mensaje: 'Petición realizada correctamente'
//     })


// })

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso