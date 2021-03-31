var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var conexion = require('../config/dbconexion');

/* Creacion de las rutas */
// Consulta todos los clientes
router.get('/', function(req, res, next) {
    const query = "SELECT * FROM cliente";

    conexion.query(query, (error, result)=>{
        if (error) { res.send(error); }

        res.send(result);
    });
});

// Consulta de un cliente por nombre
router.get('/nombre/:nombre', (req, res)=> {
    const nombre = req.params.nombre;

    conexion.query("SELECT * FROM cliente WHERE nombre = ?", nombre, (error, result)=> {
        if(error) { res.send(error); }

        res.send(result);
    });
});

router.get('/nombre', (req, res)=> {
    const nombre = req.body.nombre;

    conexion.query("SELECT * FROM cliente WHERE nombre = ?", nombre, (error, result)=> {
        if(error) { res.send(error); }

        res.send(result);
    });
});

// Registro de cliente por post
router.post('/', [
    check('nombre').isLength({min:5}),
    check('correo').isEmail(),
    check('telefono').isLength({min:10})
], (req, res)=>{
    const errores = validationResult(req);

    if (!errores.isEmpty()){
        return res.status(422).json({error: errores.array()})
    }

    const query = "INSERT INTO cliente SET ?";
    conexion.query(query, req.body, (error, result)=>{
        if (error){ res.send(error); }
        res.status(201).send("Registro guardado");
    });
});

// Modificación de cliente
router.put('/', [
    check('nombre').isLength({min:5}),
    check('correo').isEmail(),
    check('telefono').isLength({min:10})
], (req, res)=> {
    const errores = validationResult(req);

    if (!errores.isEmpty()){
        return res.status(422).json({error: errores.array()})
    }

    conexion.query('UPDATE cliente SET nombre = ?, correo = ?, telefono = ? WHERE idCliente = ?', [
        req.body.nombre,
        req.body.correo,
        req.body.telefono,
        req.body.idCliente
    ], (error, result)=> {
        if(error) {
            res.send(error);
        }

        res.send("Cliente modificado");
    });
});

// Eliminación de cliente
router.delete('/', (req, res)=> {
    conexion.query('DELETE FROM cliente WHERE nombre = ?', req.body.nombre, (error, result)=> {
        if(error) {
            res.send(error);
        }

        if(result.affectedRows > 0){
            res.send("Cliente Eliminado");
        }
        else {

        }
    });
    res.send("Eliminación por nombre.");
});

module.exports = router;