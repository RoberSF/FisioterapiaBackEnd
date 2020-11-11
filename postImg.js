app.post('/', (request, response) => { // mando el middleware como parámetro

    var body = request.body; // esto sólo va a funcionar si tengo el body-
    var date = new Date()
    var dateES = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');




    // Si no viene ninguna imagen que diga el mensaje aun que en principio me daría igual que vaya o no la imagen
    // if (!request.files) {
    //     return response.status(400).json({
    //         ok: false,
    //         mensaje: 'No files'
    //     })
    // }


    // Obtener nombre del archivo para verificar que es una imagen

    var postImg = request.files.imagen;
    var nombreCortado = postImg.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre, pero sabemos que el ultimo(split) es la extension
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
    var newNameFile = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Muevo el archivo del limbo temporal a un path donde yo lo quiero
    var path = (`./uploads/posts/${newNameFile}`); // los parentesis son obligatorios

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
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
            date: dateES,
            comentarios: body.comentarios,
            img: path
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

        });

    })




})