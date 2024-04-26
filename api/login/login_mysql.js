import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'
import bcrypt from 'bcryptjs';

const loginMysql = {
    // postLogin: función asincrónica para autenticar un usuario (admin o trabajador)
    postLogin: async (usuario, password) => {
        let conn = undefined; // Conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion(); // Obtiene la configuración de conexión
            conn = await mysql.createConnection(cfg); // Crea la conexión
            let sql = "SELECT * FROM administradores WHERE usuario = ?";
            const [adminResp] = await conn.query(sql, [usuario]); // Ejecuta la consulta para administradores
            if (adminResp.length > 0) {
                const admin = adminResp[0]
                const passwordMatch = bcrypt.compareSync(password, admin.password);
                if (passwordMatch) {
                    await conn.end(); // Cierra la conexión
                    admin.tipo = "ADMINISTRADOR";
                    return admin; // Devuelve los datos del administrador
                }
            }
            // Si no se encontró un administrador, busca en la tabla de trabajadores
            sql = "SELECT * FROM trabajadores WHERE usuario = ?";
            const [workerResp] = await conn.query(sql, [usuario]); // Ejecuta la consulta para trabajadores
            if (workerResp.length > 0) {
                const trabajador = workerResp[0]
                const passwordMatch = bcrypt.compareSync(password, trabajador.password);
                if (passwordMatch) {
                    await conn.end(); // Cierra la conexión
                    trabajador.tipo = "TRABAJADOR";
                    return trabajador; // Devuelve los datos del trabajador
                }
            }
            // Si no se encontró ni administrador ni trabajador, devuelve nada
            await conn.end();
            return;
        } catch (error) {
            if (conn) await conn.end(); // Si hay una conexión, la cierra
            throw error; // Lanza el error
        }
    },
}
export default loginMysql;