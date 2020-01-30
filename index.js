let express = require('express'); 
let morgan = require('morgan');
let uuid = require('uuid');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let app = express(); 
let mongoose = require('mongoose');
let { commentList } = require('./model'); 
let { DATABASE_URL, PORT } = require('./config');

app.use(express.static('public'));
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
    return res.send(204);
    }
    next();
   });

let comentarios = [
    {
        id: uuid.v4(),
        titulo: "Primer comentario",
        contenido: "Primer comentario prueba.",
        autor: "Sergio Canto",
        fecha: new Date()
    },
    {
        id: uuid.v4(),
        titulo: "Segundo comentario",
        contenido: "Segundo comentario prueba.",
        autor: "Alejandro Arizpe",
        fecha: new Date()
    },
    {
        id: uuid.v4(),
        titulo: "Tercer comentario",
        contenido: "Tercer comentario prueba.",
        autor: "Sergio A Canto Arizpe",
        fecha: new Date()
    }
];

app.get('/blog-api/comentarios', (req, res) => { 

    commentList.get()
        .then(comentarios => {
            return res.status(200).json(comentarios);
        })
        .catch(error => {
            res.statusMessage = "No se puede conectar con la base de datos.";
            return res.status(500).send();
        })

});  

app.get('/blog-api/comentarios-por-autor', (req, res) => {

    let autor = req.query.autor;
    
    if (autor && autor !== '') {

        commentList.getByAut(autor)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                return res.status(404).json(error);
            });
    }
    else {
        res.statusMessage ="Autor indefinido.";
        return res.status(406).send();
    }

});  

app.post('/blog-api/nuevo-comentario',jsonParser, (req, res) => {

    let autor = req.body.autor;
    let titulo= req.body.titulo;
    let contenido = req.body.contenido;
    if (contenido && contenido !== '' && titulo && titulo !== '' && autor && autor !== '') {
        let comment = {
            id: uuid.v4(),
            titulo: `${titulo}`,
            contenido: `${contenido}`,
            autor: `${autor}`,
            fecha: new Date()
        };
        commentList.add(comment)
            .then(result => { return res.status(201).json(result); })

            .catch(error => {
                console.log(error);
                return res.status(400).send();
            });
    }

    else {
        res.statusMessage = "Faltan datos.";
        return res.status(406).send();
    }

});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {

    let id = req.params.id;
    
    commentList.delete(id)
        .then(result => { return res.status(200).json(result); })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'No se encontró el id.';
            return res.status(404).send();
        }); 

});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {

    let idP = req.params.id;
    let id = req.body.id;
    let titulo = req.body.titulo;
    let contenido = req.body.contenido;
    let autor = req.body.autor;
    let obj = {};

    console.log(id);

    if (id && id !== '') {
        if (id === idP) {
            if ((contenido && contenido !== '') || (titulo && titulo !== '') || (autor && autor !== '')) {
                if (titulo){
                    elemento.titulo = titulo;
                }
                if (autor){
                    elemento.autor = autor;
                }
                if (contenido){
                    elemento.contenido = contenido;
                }
                console.log(obj);
                commentList.editComment(id, objSend)
                .then(response => {
                    return res.status(202).json({ response });
                })
                .catch(error => {
                    res.statusMessage = 'El id no se encuentra en los comentarios';
                    return res.status(404).send();});
                }
            else {
                res.statusMessage = "No existen datos a modificar.";
                return res.status(406).send();
            }
        }
        else {
            res.statusMessage = "Los ids no coinciden.";
            return res.status(409).send();
        }
    }
    else {
        res.statusMessage = "No se encuentra el id en el cuerpo.";
        return res.status(406).send();
    }

});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL);

module.exports = { app, runServer, closeServer };

/*
app.listen(8080, () => { 
    console.log("servidor en 8080")
}); */