var mongoose = require('mongoose'); // para trabajar con mongoose y sus funciones primero lo importamos
var uniqueValidator = require('mongoose-unique-validator'); // Librería de mongoose para manejar el error de celda existente


var Schema = mongoose.Schema; // Para definir esquemas primero hay que importar


var postSchema = new Schema({
    title: { type: String, unique: true, required: [true, 'Necesitas un título'] },
    intro: { type: String, unique: true, required: [true, 'La intro es necesaria'] },
    contenido: { type: String, required: [true, 'El contenido es necesaria'] },
    categoria: { type: String, required: [true, 'La categoria es necesaria'] },
    date: { type: Date, required: [true, 'La fecha es necesaria'] },
    comentarios: { type: String, requiered: false },
    img: { type: String, requiered: false },
    //categoria: {type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
});


module.exports = mongoose.model('Post', postSchema)