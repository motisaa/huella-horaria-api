import express from 'express';
import { body, param, validationResult } from 'express-validator'
import fichajesMysql from './fichajes_mysql.js';

var router = express.Router();

// Se define una regla para validar que el parámetro 'id' no esté vacío
let reglaFichajeId = [
    param('id').notEmpty()
]
// Se define una regla para validar que el cuerpo de la solicitud tenga un campo 'fichajeId' que no esté vacío
let reglaFichajePut = [
    body('fichajeId').notEmpty()
]

//usamos async para poder usar en su interior instrucciones tipo wait.
// Ruta para crear un nuevo fichaje
router.post('/', async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            // Devuelve errores de validación si existen
            res.status(400).send({ errors: result.array() })
            return
        }
        let fichaje = req.body
        //Inserta fichaje nuevo en la base de datos
        fichaje = await fichajesMysql.postFichajes(fichaje)
        res.json(fichaje); // Devuelve el fichaje creado
    } catch (error) {
        next(error)
    }

});

//Ruta para obtener todos los fichajes
router.get('/', async (req, res, next) => {
    try {
        // Obtiene todos fichajes de la base de datos
        let fichajes = await fichajesMysql.getFichajesMsql();
        // Devuelve fichajes obtenidos
        res.json(fichajes);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', reglaFichajeId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let fichaje = await fichajesMysql.getFichajeById(req.params.id);
        if (fichaje.length == 0) {
            // No hay fichaje
            res.status(404).send(`La fichaje con id ${req.params.id} no exixte en la base de datos`)
            return
        }
        res.json(fichaje[0]); // Devuelve el fichaje encontrado
    } catch (error) {
        next(error)
    }
})
// Ruta para actualizar un fichaje
router.put('/', reglaFichajePut, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let fichaje = req.body;
        // Actualiza el fichaje en la base de datos
        await fichajesMysql.putFichajeMsql(fichaje)
        res.json(fichaje); // Devuelve el fichaje actualizada
    } catch (error) {
        next(error)
    }

});

// Ruta para eliminar un fichaje por su id
router.delete('/:id', reglaFichajeId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        // Elimina un fichaje por su id
        let fichaje = await fichajesMysql.deleteFichajeById(req.params.id);
        res.json(fichaje); // Devuelve el fichaje eliminada
    } catch (error) {
        next(error)
    }
});

router.get('/:id/worker', reglaFichajeId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let fichajeWorker = await fichajesMysql.getWorkerNameByFichajeId(req.params.id);
        res.json(fichajeWorker); // Devuelve el resultado encontrado
    } catch (error) {
        next(error)
    }
});

export default router;