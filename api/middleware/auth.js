
import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'
async function auth(req, res, next) {
    // Verificar si existe la cabecera/header api-key
    if (!req.header("api-key")) {
        res.status(401);
        return res.json({ message: "API key no proporcionada" });
    }

    // Leer la API key de header de la solicitud HTTP.
    const apiKey = req.header("api-key");
    //clave maestra
    if (apiKey === process.env.API_KEY) {
        next()
        return
    }
    let conn = undefined
    try {
        let cfg = mysqlConnection.obtenerConexion()
        conn = await mysql.createConnection(cfg)
        // Consultar la base de datos para encontrar la empresa con la API key proporcionada
        const [empresaEncontrada] = await conn.query('select * from empresas where apiKey=?', apiKey)
        // Si no se encuentra la empresa con la API key proporcionada, devolver un error 401
        if (!empresaEncontrada || empresaEncontrada.length === 0) {
            res.status(401);
            return res.json({ message: "API key inválida" });
        }
        next();
    } catch (error) {
        // Manejar cualquier error de la base de datos
        console.error("Error al verificar la API key en la base de datos:", error);
        res.status(500);
        return res.json({ message: "Error interno del servidor" });
    } finally {
        // Cerrar la conexión a la base de datos
        if (conn) {
            await conn.end();
        }
    }
}

export default auth;
