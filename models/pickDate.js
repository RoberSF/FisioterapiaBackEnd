var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var dateSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es	necesario'] },
    date: { type: Date, required: [true, 'La fecha es necesaria'] },
    zone: { type: String },
    userId: { type: String },
    symptoms: { type: String },
    observations: { type: String }

});

module.exports = mongoose.model('Date', dateSchema)