import mysql from 'mysql2/promise'
import mysqlConnection from '../conexiones/conexion_mysql.js'
import bcrypt from 'bcryptjs';

const administradoresMysql = {
    // Función para insertar un nuevo admin en la base de datos
    postAdmins: async (admin) => {
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            //Verificar si el nombre de usuario ya existe en la tabla administradores
            let sql = 'SELECT * FROM administradores WHERE usuario = ?';
            const [existingUserAdmin] = await conn.query(sql, [admin.usuario]);
            if (existingUserAdmin.length > 0) {
                return { error: 'El nombre de usuario ya existe, por favor elija otro.' };
            }
            sql = 'SELECT * FROM trabajadores WHERE usuario = ?'
            // Verificar si el nombre de usuario ya existe en la tabla trabajadores
            const [existingUserWorker] = await conn.query(sql, [admin.usuario]);
            if (existingUserWorker.length > 0) {
                return { error: 'El nombre de usuario ya existe, por favor elija otro.' };
            }
            // Hashing the password before storing it in the database
            const hashedPassword = bcrypt.hashSync(admin.password, 10); // 10 is the salt rounds
            admin.password = hashedPassword; // Replace plain password with hashed password
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
            // Leemos el valor actual del admin
            let sql = `SELECT * FROM administradores WHERE adminId = ${admin.adminId}`
            const [r] = await conn.query(sql)
            let adminAnt = r[0]
            //Verificar si el nombre de usuario ya existe en la tabla administradores
            if(admin.usuario !== adminAnt.usuario){
                sql = 'SELECT * FROM administradores WHERE usuario = ?';
                const [existingUserAdmin] = await conn.query(sql, [admin.usuario]);
                if (existingUserAdmin.length > 0) {
                    return { error: 'El nombre de usuario ya existe, por favor elija otro.' };
                }
            }
            //Verificar si el nombre de usuario ya existe en la tabla trabajadores
            sql = 'SELECT * FROM trabajadores WHERE usuario = ?';
            const [existingUserWorker] = await conn.query(sql, [admin.usuario]);
            if (existingUserWorker.length > 0) {
                return { error: 'El nombre de usuario ya existe, por favor elija otro.' };
            }
            /* FIXED: Evitamos de hashear otra vez la contraseña actual en el caso de que
             el usuario no cambia la contraseña y cambia otras informaciones 
             verificamos si el password nuevo que nos pasa no es igual a su password 
             guardado en BD
             */
            if (admin.password !== adminAnt.password) {
                const hashedPassword = bcrypt.hashSync(admin.password, 10);
                admin.password = hashedPassword;
            }
             sql = `UPDATE administradores SET ? WHERE adminId = ?`
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
}


export default administradoresMysql;