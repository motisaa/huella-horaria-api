import mysql from 'mysql2/promise' 
import mysqlConnection from '../conexiones/conexion_mysql.js'

const administradoresMysql = {
    // Función para insertar una nueva empresa en la base de datos
    postEmpresas: async (admin) => { 
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            // Ejecución de inserción a la base de datos
            const [resp] = await conn.query('INSERT INTO empresas SET ?', admin)
            await conn.end()
            /* Asigna el id generado automáticamente por la base de datos
             a la propiedad adminId del objeto admin */
            admin.adminId = resp.insertId
            return admin
        } catch (error) {
            if (conn) await conn.end() // Si hay una conexión abierta, se cierra
            throw(error) // Se lanza un error
        }
    }
}

export default administradoresMysql;