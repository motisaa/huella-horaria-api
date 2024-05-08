import express from 'express';
import { body, param, validationResult } from 'express-validator'
import trabajadoresMysql from './trabajadores_mysql.js';
import auth from '../middleware/auth.js';

var router = express.Router();
// Definición de reglas de validación para la creación de un trabajador
let reglasTrabajador = [
    // El nombre de trabajador no debe estar vacío
    body('nombre').notEmpty(),
    body('apellido1').notEmpty(),
    body('usuario').notEmpty(),
    body('password').notEmpty(),
]
let reglasTrabajadorId = [
    param('id').notEmpty()
]

let reglasTrabajadorPut = [
    body('trabajadorId').notEmpty()
]

//usamos async para poder usar en su interior instrucciones tipo wait.
// Ruta para crear un nuevo trabajador
router.post('/', reglasTrabajador, auth, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            // Devuelve errores de validación si existen
            res.status(400).send({ errors: result.array() })
            return
        }
        let trabajador = req.body
        //Inserta trabajador nuevo en la base de datos
        let response = await trabajadoresMysql.postTrabajadores(trabajador)
        // Manejo de errores
        if (response.error) {
            // Conflict: El nombre de usuario ya existe
            res.status(409).json(response.error);
        } else {
            res.json(response); // Devuelve el trabajador creado
        }
    } catch (error) {
        next(error); // Otro tipo de error, pasa al siguiente middleware de manejo de errore
    }
});

//Ruta para obtener todos los trabajadors
router.get('/', auth, async (req, res, next) => {
    try {
        // Obtiene todos trabajadors de la base de datos
        let trabajadors = await trabajadoresMysql.getTrabajadorMsql();
        // Devuelve trabajadors obtenidos
        res.json(trabajadors);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', reglasTrabajadorId, auth, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let trabajador = await trabajadoresMysql.getTrabajadorById(req.params.id);
        if (trabajador.length == 0) {
            // No hay trabajador
            res.status(404).send(`La trabajador con id ${req.params.id} no exixte en la base de datos`)
            return
        }
        res.json(trabajador[0]); // Devuelve el trabajador encontrado
    } catch (error) {
        next(error)
    }
})
// Ruta para actualizar un trabajador
router.put('/', reglasTrabajadorPut, auth, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let trabajador = req.body;
        // Actualiza el trabajador en la base de datos
        let response = await trabajadoresMysql.putTrabajadorMsql(trabajador)
        // Manejo de errores
        if (response.error) {
            // Conflict: El nombre de usuario ya existe
            res.status(409).json(response.error);
        } else {
            res.json(response); // Devuelve el trabajador actualizada
        }

    } catch (error) {
        next(error); // Otro tipo de error, pasa al siguiente middleware de manejo de errores
    }
});

// Ruta para eliminar un trabajador por su id
router.delete('/:id', reglasTrabajadorId, auth, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        // Elimina un trabajador por su id
        let trabajador = await trabajadoresMysql.deleteTrabajadorById(req.params.id);
        res.json(trabajador); // Devuelve el trabajador eliminada
    } catch (error) {
        next(error)
        /*  ERROR http response status 405.
            MDN: The request method 
            is known by the server but is not supported by the target resource.
            For example, an API may not allow calling DELETE to remove a resource. */
        return res.status(405).json({ error: 'Method not Allowed' });
    }
});



export default router;