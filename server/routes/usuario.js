const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                }); 
            });
        });
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado
    });

    usuario.save((err, usuario) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        });
    });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);  

    Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, usuario) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        });
    });
});

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let estado = {
        estado: false
    }

    //Usuario.findByIdAndDelete(id, (err, usuario) => {
    Usuario.findByIdAndUpdate(id,estado,{new: true}, (err, usuario) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            usuario
        });
    });
});

module.exports = app;
