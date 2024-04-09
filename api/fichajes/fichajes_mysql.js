import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'

const fichajesMysql = {
    // Función para insertar un nuevo fichaje en la base de datos
    postFichajes: async (fichaje) => {
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            // Ejecución de inserción a la base de datos
            const [resp] = await conn.query('INSERT INTO fichajes SET ?', fichaje)
            await conn.end()
            /* Asigna el id generado automáticamente por la base de datos
             a la propiedad fichajeId del objeto fichaje */
            fichaje.fichajeId = resp.insertId
            return fichaje
        } catch (error) {
            if (conn) await conn.end() // Si hay una conexión abierta, se cierra
            throw (error) // Se lanza un error
        }
    },
    // Función para obtener todos los fichajes de la base de datos
    getFichajesMsql: async () => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            const [resp] = await conn.query("SELECT * FROM fichajes")
            await conn.end() // Cierre de la conexión
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para obtener un fichaje por su id
    getFichajeById: async (fichajeId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select * from fichajes where fichajeId = ${fichajeId}`
            const [resp] = await conn.query(sql) // Ejecución de la consulta SQL
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para actualizar un fichaje en la base de datos
    putFichajeMsql: async (fichaje) => {
        let conn = undefined;
        try {
            let cfg = mysqlConnection.obtenerConexion();
            conn = await mysql.createConnection(cfg);
            let sql = `UPDATE fichajes SET ? WHERE fichajeId = ?`
            // Ejecución de la consulta SQL
            const [resp] = await conn.query(sql, [fichaje, fichaje.fichajeId])
            await conn.end();
            return resp;
        } catch (error) {
            if (conn) await conn.end();
            throw (error)
        }
    },
    //  Función para eliminar un fichaje de la base de datos
    deleteFichajeById: async (fichajeId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `DELETE FROM fichajes WHERE fichajeId= ${fichajeId}`
            const [resp] = await conn.query(sql)
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },

    //Got this function with the help of chatGPT
    getWorkerNameByFichajeId: async (fichajeId) => {
        let conn = undefined;
        try {
            let cfg = mysqlConnection.obtenerConexion();
            conn = await mysql.createConnection(cfg);
            // Convert the fichajeId parameter to a numeric value
            const parsedFichajeId = parseInt(fichajeId);
            // Use parameterized query to prevent SQL injection
            const sql = ` SELECT t.nombre, t.apellido1, t.apellido2
            FROM fichajes f
            INNER JOIN trabajadores t ON f.trabajadorId = t.trabajadorId
            WHERE f.fichajeId = ?`;
            const [resp] = await conn.query(sql, [parsedFichajeId]);
            await conn.end();
            return resp;
        } catch (error) {
            if (conn) await conn.end();
            throw error;
        }
    },

}


export default fichajesMysql;