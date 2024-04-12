import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'

const administradoresMysql = {
    // Función para insertar un nueva admin en la base de datos
    postAdmins: async (admin) => {
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            // Ejecución de inserción a la base de datos
            const [resp] = await conn.query('INSERT INTO administradores SET ?', admin)
            await conn.end()
            /* Asigna el id generado automáticamente por la base de datos
             a la propiedad adminId del objeto admin */
            admin.adminId = resp.insertId
            return admin
        } catch (error) {
            if (conn) await conn.end() // Si hay una conexión abierta, se cierra
            throw (error) // Se lanza un error
        }
    },
    // Función para obtener todos los admins de la base de datos
    getAdminsMsql: async () => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            const [resp] = await conn.query("SELECT * FROM administradores")
            await conn.end() // Cierre de la conexión
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para obtener un admin por su ID
    getAdminById: async (adminId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select * from administradores where adminId = ${adminId}`
            const [resp] = await conn.query(sql) // Ejecución de la consulta SQL
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para actualizar un admin en la base de datos
    putAdminsMsql: async (admin) => {
        let conn = undefined;
        try {
            let cfg = mysqlConnection.obtenerConexion();
            conn = await mysql.createConnection(cfg);
            let sql = `UPDATE administradores SET ? WHERE adminId = ?`
            // Ejecución de la consulta SQL
            const [resp] = await conn.query(sql, [admin, admin.adminId])
            await conn.end();
            return resp;
        } catch (error) {
            if (conn) await conn.end();
            throw (error)
        }
    },
    //  Función para eliminar un admin de la base de datos
    deleteAdminById: async (adminId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `DELETE FROM administradores WHERE adminId= ${adminId}`
            const [resp] = await conn.query(sql)
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },


    // postLogin: función asincrónica para autenticar un usuario (admin o trabajador)
    postLogin: async (usuario, password) => {
        let conn = undefined; // Conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion(); // Obtiene la configuración de conexión
            conn = await mysql.createConnection(cfg); // Crea la conexión
            let sql = "SELECT * FROM administradores WHERE usuario = ? AND password = ?";
            const [adminResp] = await conn.query(sql, [usuario, password]); // Ejecuta la consulta para administradores
            if (adminResp.length > 0) {
                await conn.end(); // Cierra la conexión
                return adminResp[0]; // Devuelve los datos del administrador
            }
            // Si no se encontró un administrador, busca en la tabla de trabajadores
            sql = "SELECT * FROM trabajadores WHERE usuario = ? AND password = ?";
            const [workerResp] = await conn.query(sql, [usuario, password]); // Ejecuta la consulta para trabajadores
            if (workerResp.length > 0) {
                await conn.end(); 
                return workerResp[0]; // Devuelve los datos del trabajador
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


export default administradoresMysql;