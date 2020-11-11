var mongoose = require('mongoose'); 


var Schema = mongoose.Schema; 

var hospitalSchema = new Schema({
    nombre: {type: String,	required: [true,'El	nombre es necesario']},
    img: {type: String,	required: false },
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario' } // Un	tema	que	no	vimos	hasta	el	momento,	es	que	el	usuario	es	de	tipo	
                            // Schema.Types.ObjectId,	esto	es	utilizado	para	indicarle	a	Mongoose,	que	ese	campo	es	una	
                            // relación	con	otra	colección,	y	la	referencia	es	Usuario. Al	final	este	campo	nos	dirá	qué
                            // usuario	creó	el	registro
},{	collection: 'hospitales' }); // esto	simplemente	es	para evitar	que	Mongoose	coloque	el	nombre	a	la	colección como	hospitals.


module.exports = mongoose.model('Hospital', hospitalSchema)