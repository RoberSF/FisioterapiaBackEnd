var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripció es necesaria'] }
}, { collection: 'categorias' }); // esto	simplemente	es	para evitar	que	Mongoose	coloque	el	nombre	a	la	colección como	hospitals.


module.exports = mongoose.model('Categoria', categoriaSchema)