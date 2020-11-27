const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es necesario']
    },
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser Unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);