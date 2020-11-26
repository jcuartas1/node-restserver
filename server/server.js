require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion Global de Rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de datos Online');
    });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando Puerto: ${process.env.PORT}`);
});