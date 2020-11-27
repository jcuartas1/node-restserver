const express = require('express');
const _ = require('underscore');

let { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria')


/**
 * Mostrar todas las categorias
 */
app.get('/categoria', verificarToken, (req, res) => {



    Categoria.find({})
        .sort('nombre')
        .populate('idUsuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })


        });

});


/**
 * Mostrar una categoria por ID
 */
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria consultada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

/**
 * Crear nueva categoria
 */
app.post('/categoria', verificarToken, (req, res) => {
    //Regresa la nueva categoria

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        idUsuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });

});

/**
 * Actualizar una categoria por ID  
 */
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let usuarioid = req.usuario._id;

    let desCategoria = {
        nombre: body.nombre,
        idUsuario: usuarioid
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    })
});

/**
 * Eliminar una categoria por ID  
 */
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {

    // Solo un administrador pueda borrar categorias fisicas
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no Encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});


module.exports = app;