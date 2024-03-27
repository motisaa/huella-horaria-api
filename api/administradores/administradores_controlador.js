import express from 'express';
import { body, param, validationResult } from 'express-validator'
import administradoresMysql from './administradores_mysql.js';

var router = express.Router();
// Definición de reglas de validación para la creación de un admin
let reglasAdmin = [
    // El nombre de admin no debe estar vacío
    body('nombre').notEmpty(),
    body('apellido1').notEmpty(),
    // verifica si email de admin no está vacío y es un email de verdad 
    body('usuario').notEmpty(),
    body('password').notEmpty(),
    body('email').notEmpty().isEmail
]
let reglasAdminId = [
    param('id').notEmpty()
]

let reglasAdminPut = [
    body('adminId').notEmpty()
]
const loginValidationRules = [
    body('usuario').notEmpty(),
    body('password').notEmpty(),
];

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
        admin = await administradoresMysql.postAdmins(admin)
        res.json(admin); // Devuelve el admin creado
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
        await administradoresMysql.putAdminsMsql(admin)
        res.json(admin); // Devuelve el admin actualizada
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

// Ruta para la autenticación de usuarios administradores
router.post("/login", loginValidationRules, async (req, res) => {
    try {
        // Valida los errores de la solicitud
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, devuelve un mensaje de error con los detalles
            return res.status(400).json({ errors: errors.array() });
        }
        // Obtiene el usuario y la contraseña del cuerpo de la solicitud
        const { usuario, password } = req.body;
        // Intenta iniciar sesión con las credenciales proporcionadas
        const admin = await administradoresMysql.postLogin(usuario, password);
        if (admin) {
            // Si el inicio de sesión tiene éxito, devuelve los datos del administrador
            return res.json(admin);
        } else {
            // Si las credenciales son incorrectas, devuelve un mensaje de error
            return res.status(401).json({ error: 'Nombre de usuario y contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


export default router;