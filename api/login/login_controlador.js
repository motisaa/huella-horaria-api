import loginMysql from "./login_mysql.js";
import express from 'express';
import { body, validationResult } from 'express-validator'

var router = express.Router();

const loginValidationRules = [
    body('usuario').notEmpty(),
    body('password').notEmpty(),
];

// Ruta para la autenticación de usuarios
router.post("/", loginValidationRules, async (req, res) => {
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
        const user = await loginMysql.postLogin(usuario, password);
        if (user) {
            // Si el inicio de sesión tiene éxito, devuelve los datos del usuaruio
            return res.json(user);
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