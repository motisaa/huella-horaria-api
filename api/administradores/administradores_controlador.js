import express from 'express';
import { body, param, validationResult } from 'express-validator'
import administradoresMysql from './administradores_mysql.js';

var router = express.Router();
// Definición de reglas de validación para la creación de un admin
    let reglasAdmin = [
        // El nombre de admin no debe estar vacío
        body('nombre').notEmpty(),
        body('apellido1').notEmpty(),
        body('usuario').notEmpty(),
        body('password').notEmpty(),
    ]

let reglasAdminId = [
    param('id').notEmpty()
]

let reglasAdminPut = [
    body('adminId').notEmpty()
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
        let response = await administradoresMysql.postAdmins(admin)
        if (response.error) {
         // Conflict: El nombre de usuario ya existe
         res.status(409).json(response.error);
        } else {
            res.json(response); // Devuelve el admin creado
        }
        
    } catch (error) {
        next(error)
    }

});

//Ruta para obtener todos los admins
router.get('/', async (req, res, next) => {
    try {
        // Obtiene todos admins de la base de datos
        let admins = await administradoresMysql.getAdminsMsql();
        // Devuelve admins obtenidos
        res.json(admins);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', reglasAdminId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let admin = await administradoresMysql.getAdminById(req.params.id);
        if (admin.length == 0) {
            // No hay admin
            res.status(404).send(`La admin con id ${req.params.id} no exixte en la base de datos`)
            return
        }
        res.json(admin[0]); // Devuelve el admin encontrado
    } catch (error) {
        next(error)
    }
})
// Ruta para actualizar un admin
router.put('/', reglasAdminPut, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let admin = req.body;
        // Actualiza el admin en la base de datos
        let response = await administradoresMysql.putAdminsMsql(admin)
        if (response.error) {
            // Conflict: El nombre de usuario ya existe
            res.status(409).json(response.error);
        } else {
            res.json(admin); // Devuelve el admin actualizada   
        }
    } catch (error) {
        next(error)
    }
});

// Ruta para eliminar un admin por su id
router.delete('/:id', reglasAdminId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        // Elimina un admin por su id
        let admin = await administradoresMysql.deleteAdminById(req.params.id);
        res.json(admin); // Devuelve el admin eliminada
    } catch (error) {
        next(error)
    }
});

export default router;