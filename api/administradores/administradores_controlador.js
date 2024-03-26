import express from 'express';
import {body, param, validationResult} from 'express-validator'
import adminMysql from './administradores_mysql.js';

var router = express.Router();
// Definición de reglas de validación para la creación de un admin
let reglasAdmin = [
    // El nombre de admin no debe estar vacío
    body('nombre').notEmpty(),
    body('apellido1').notEmpty(),
    // verifica si email de admin no está vacío y es un email de verdad 
    body('email').notEmpty().isEmail,
    body('usuario').notEmpty(),
    body('password').notEmpty(),
]
//usamos async para poder usar en su interior instrucciones tipo wait.
// Ruta para crear un nuevo admin
router.post('/', reglasAdmin, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            // Devuelve errores de validación si existen
            res.status(400).send({ errors: result.array() })
            return
        }
        let admin = req.body
        //Inserta admin nuevo en la base de datos
        empresa = await adminMysql.postEmpresas(admin)
        res.json(admin); // Devuelve el admin creado
    } catch (error) {
        next(error)
    }

});

export default router;