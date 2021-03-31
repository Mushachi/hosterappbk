var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var conexion = require('../config/dbconexion');

/* Creacion de las rutas */
// Consulta todos los empleados
router.get('/', function(req, res, next) {
  const query = "SELECT * FROM empleado";

  conexion.query(query, (error, result)=>{
      if (error) { res.send(error); }

      res.send(result);
  });
});

// Consulta de un cliente por nombre
router.get('/nombre/:nombre', (req, res)=> {
  const nombre = req.params.nombre;

  conexion.query("SELECT * FROM empleado WHERE nombre = ?", nombre, (error, result)=> {
      if(error) { res.send(error); }

      res.send(result);
  });
});

router.get('/nombre', (req, res)=> {
  const nombre = req.body.nombre;

  conexion.query("SELECT * FROM empleado WHERE nombre = ?", nombre, (error, result)=> {
      if(error) { res.send(error); }

      res.send(result);
  });
});

// Registro de cliente por post
router.post('/', [
  check('nombre').isLength({min:5}),
  check('apellidos').isLength({min:5}),
  check('correo').isEmail(),
  check('clave').isStrongPassword({minLength:5,minNumbers:1,minSymbols:1,minUppercase:1,minLowercase:1}),
  check('tipo').isNumeric(),
  check('activo').isNumeric()
], (req, res)=>{
  const errores = validationResult(req);

  if (!errores.isEmpty()){
      return res.status(422).json({error: errores.array()})
  }
  
  const query = "INSERT INTO empleado SET ?";
  conexion.query(query, req.body, (error, result)=>{
      if (error){ res.send(error); }
      res.status(201).send("Registro guardado");
  });
});

// Para hacer Inicio de Sesion
router.post('/iniciosesion', [
  check('correo').isEmail(),
  check('clave').isStrongPassword({minLength:5,minNumbers:1,minSymbols:1,minUppercase:1,minLowercase:1})
], (req, res)=> {

  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).json({error: errores.array()});
  }

  const query = "SELECT * FROM empleado WHERE correo = ? AND clave = ?";

  conexion.query(query, [
    req.body.correo,
    req.body.clave
  ], (error, result)=> {
    if (error) {
      res.send(error);
    }

    res.send(result);
  })

});

// Modificación de cliente
router.put('/', [
  check('nombre').isLength({min:5}),
  check('apellidos').isLength({min:5}),
  check('correo').isEmail(),
  check('clave').isStrongPassword({minLength:5,minNumbers:1,minSymbols:1,minUppercase:1,minLowercase:1}),
  check('tipo').isNumeric(),
  check('activo').isNumeric()
], (req, res)=> {
  const errores = validationResult(req);

  if (!errores.isEmpty()){
      return res.status(422).json({error: errores.array()})
  }

  conexion.query('UPDATE empleado SET nombre = ?, correo = ?, telefono = ? WHERE idCliente = ?', [
      req.body.nombre,
      req.body.apellidos,
      req.body.correo,
      req.body.clave,
      req.body.tipo,
      req.body.activo
  ], (error, result)=> {
      if(error) {
          res.send(error);
      }

      res.send("Empleado modificado");
  });
});

// Eliminación de cliente
router.delete('/', (req, res)=> {
  conexion.query('DELETE FROM empleado WHERE nombre = ?', req.body.nombre, (error, result)=> {
      if(error) {
          res.send(error);
      }

      if(result.affectedRows > 0){
          res.send("Empleado Eliminado");
      }
      else {

      }
  });
  // res.send("Eliminación por nombre.");
});

module.exports = router;