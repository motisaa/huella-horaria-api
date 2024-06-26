import express from 'express';
import { body, param, validationResult } from 'express-validator'
import fichajesMysql from './fichajes_mysql.js';
import auth from '../middleware/auth.js';
import moment from 'moment'

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
router.post('/', auth, async (req, res, next) => {
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
router.get('/', auth, async (req, res, next) => {
    try {
        // Obtiene todos fichajes de la base de datos
        let fichajes = await fichajesMysql.getFichajesMsql();
        // Devuelve fichajes obtenidos
        res.json(fichajes);
    } catch (error) {
        next(error)
    }
});

router.get('/fichajes_trabajador/:id', auth, async (req, res, next) => {
    try {
        let fichajes = await fichajesMysql.getFichajesTrabajador(req.params.id)
        // Devuelve fichajes obtenidos
        res.json(fichajes);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', reglaFichajeId, auth, async (req, res, next) => {
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
router.put('/', reglaFichajePut, auth, async (req, res, next) => {
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
router.delete('/:id', reglaFichajeId, auth, async (req, res, next) => {
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

router.get('/serverTime/date', async (req, res, next) => {
    let fecha = new Date()
    try {
        res.json({
            fechaUtc: fecha,
            fecha: moment(fecha).format('YYYY-MM-DD HH:mm')
        });
    } catch (error) {
        next(error);
    }
});

export default router;