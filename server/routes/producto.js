const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


/**
 * Obtener productos
 */
app.get('/producto', verificarToken, (req, res) => {
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })


        });


});

/**
 * Obtener un producto por ID
 */
app.get('/producto/:id', verificarToken, (req, res) => {
    //populate usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto consultado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});
/**
 * Buscar un producto
 */
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

});


/**
 * Crear un producto
 */
app.post('/producto', verificarToken, (req, res) => {


    let body = req.body;
    let idUsuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioPro,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.idCategoria,
        usuario: idUsuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

/**
 * Actualizar un producto por ID
 */
app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let usuarioid = req.usuario._id;

    let desProducto = {
        nombre: body.nombre,
        precioUni: body.precioPro,
        descripcion: body.descripcion,
        usuario: usuarioid
    }

    Producto.findByIdAndUpdate(id, desProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto consultado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })



});

/**
 * Borrar un producto por ID
 */
app.delete('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoBorrado
        });

    })

});





module.exports = app;