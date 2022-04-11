// imports
const express = require('express');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017';
const app = express();

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

// conectar a la base de datos
mongo.connect(uri, (err, con) => {

    // collection
    const employersCollection = con.db('work').collection('employers');

    // en caso de error finalizar
    if(err){
        console.log(`No se puede conectar con la uri ${uri}`);
        process.exit(1);
    }

    app.get('/employers',(req, res) => {
        employersCollection.find({}).toArray((err, employers) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(employers, null, 2));
        });
    });

    app.post('/employers',(req, res) => {
        employersCollection.insert(req.body, (err, respuesta) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta, null, 2));
        });
    });

    app.put('/employers/:id', (req, res) => {
        employersCollection.update({ _id: req.params.id }, { $set: req.body }, (err, respuesta) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta, null, 2));
        });
    });

    app.delete('/employers/:id', (req, res) => {
        const _id = req.params.id;
        employersCollection.remove({ _id }, (err, respuesta) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta, null, 2));
        });
    });

    app.listen(3000);

    console.log('Listening on http://localhost:3000');

});
