//***************************** */ Requires (Importación de librerías para que funcione algo)*********************************
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // librería para pasar la data del post en un objeto javascript


const port = process.env.PORT || 4000;




// *******************************Inicializar variables(aquí es donde se usan las librerías)************************************
var app = express();

// *****************************************************************************************************************
//                                       Middleware           CORS
//*****************************************************************************************************************/

// Ojo con el headers que tengo que mandarle el token

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

// **********************************Body Parser Librería*****************************************************(middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())






// *******************************************Conexión a la base de datos local*******************************************************
// mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, response) => {
//     if (error) throw error;
//     console.log('Base de datos:\x1b[32m%s\x1b[0m', 'running')
// })



// *******************************************Conexión a la base de datos*******************************************************
//                                              Local vs Atlas
//*****************************************************************************************************************************
// *podría ponerlo en config.js e importarlo

// ============================
//  Variables de entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/fisioterapiaDb';
} else {

    urlDB = process.env.URLDB; //url que saco de mogoatlas=>connect => using mongo compass
}

process.env.URLDB = urlDB;


//mongodb+srv://admin:<password>@cluster0.v9ttl.mongodb.net/<dbname>
//mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', { // cuando trabajo en localhost antes de configurar mongo atlas
mongoose.connection.openUri(process.env.URLDB, {
        // lo de abajo son variables que me pide mongo al arrancar el server
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (error, response) => {
        if (error) throw error;
        console.log('Base de datos:\x1b[32m%s\x1b[0m', 'running')
    })


//*********************************************Importar rutas que voy a usar****************************************************

var appRoutes = require('./routes/app'); // el path dónde están las rutas

var usuarioRoutes = require('./routes/usuario');

var usuarioLogin = require('./routes/login');

var hospitalRoutes = require('./routes/hospital');

var medicoRoutes = require('./routes/medico');

var busquedaRoutes = require('./routes/busqueda');

var uploadRoutes = require('./routes/upload');

var imagenesRoutes = require('./routes/imagenes');

var chatRoutes = require('./routes/chat');

var dateRoutes = require('./routes/date');

var blogRoutes = require('./routes/blog');

var categoriaRoutes = require('./routes/categoria')





//************************************************************Rutas*************************************************************


app.use('/usuario', usuarioRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/hospital', hospitalRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/medico', medicoRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/busqueda', busquedaRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/upload', uploadRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/img', imagenesRoutes);
app.use('/login', usuarioLogin); // se pone arriba por que si no entrarían por el de abajo
app.use('/chat', chatRoutes);
app.use('/date', dateRoutes);
app.use('/post', blogRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/', appRoutes); // middleware. "Cualquier match con '/' , ejecuta appRoutes"





//****************************************************Escuchar peticiones ******************************************************
app.listen(port, () => { console.log('Express Server corriendo en el puerto 4000:\x1b[32m%s\x1b[0m', 'running') });