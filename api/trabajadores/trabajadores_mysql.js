import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'
import bcrypt from 'bcryptjs';

const trabajadoresMysql = {
    // Función para insertar un/a nuevo/a trabajador/a en la base de datos
    postTrabajadores: async (trabajador) => {
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            // Hashing the password before storing it in the database
            const hashedPassword = bcrypt.hashSync(trabajador.password, 10); // 10 is the salt rounds
            trabajador.password = hashedPassword; // Replace plain password with hashed password
            // Ejecución de inserción a la base de datos
            const [resp] = await conn.query('INSERT INTO trabajadores SET ?', trabajador)
            await conn.end()
            /* Asigna el id generado automáticamente por la base de datos
             a la propiedad trabajadorId del objeto trabajador */
            trabajador.trabajadorId = resp.insertId
            return trabajador
        } catch (error) {
            if (conn) await conn.end() // Si hay una conexión abierta, se cierra
            throw (error) // Se lanza un error
        }
    },
    // Función para obtener todos los trabajadores de la base de datos
    getTrabajadorMsql: async () => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select 
                t.*, gt.nombre as nombreGrupo
                from trabajadores t 
                left join grupos_trabajadores gt on gt.grupoId = t.grupoId `
            const [resp] = await conn.query(sql)
            await conn.end() // Cierre de la conexión
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para obtener un/a trabajador/a por su id
    getTrabajadorById: async (trabajadorId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select * from trabajadores where trabajadorId = ${trabajadorId}`
            const [resp] = await conn.query(sql) // Ejecución de la consulta SQL
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
    // Función para actualizar un trabajador en la base de datos
    putTrabajadorMsql: async (trabajador) => {
        let conn = undefined;
        try {
            let cfg = mysqlConnection.obtenerConexion();
            conn = await mysql.createConnection(cfg);
            // Leemos el valor actual del trabajador
            let sql = `SELECT * FROM trabajadores WHERE trabajadorId = ${trabajador.trabajadorId}`
            const [r] = await conn.query(sql)
            let trabajador_ant = r[0]
            /* FIXED: Evitamos de hashear otra vez la contraseña actual en el caso de que
             el usuario no cambia la contraseña y cambia otras informaciones 
             verificamos si el password que nos pasa no es igual a password anterior
             */
            if (trabajador.password !== trabajador_ant.password) {
                // Hashing the password before updating it in the database
                const hashedPassword = bcrypt.hashSync(trabajador.password, 10);
                trabajador.password = hashedPassword;
            }
            sql = `UPDATE trabajadores SET ? WHERE trabajadorId = ?`
            // Ejecución de la consulta SQL
            const [resp] = await conn.query(sql, [trabajador, trabajador.trabajadorId])
            await conn.end();
            return resp;
        } catch (error) {
            if (conn) await conn.end();
            throw (error)
        }
    },
    //  Función para eliminar un/a trabajador/a de la base de datos
    deleteTrabajadorById: async (trabajadorId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `DELETE FROM trabajadores WHERE trabajadorId= ${trabajadorId}`
            const [resp] = await conn.query(sql)
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
}


export default trabajadoresMysql;