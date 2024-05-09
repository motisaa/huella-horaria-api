import mysql from 'mysql2/promise' 
import mysqlConnection from '../conexiones/conexion_mysql.js'

const empresasMysql = {
    // Función para insertar una nueva empresa en la base de datos
    postEmpresas: async (empresa) => { 
        let conn = undefined // Inicialización de la conexión a la base de datos
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            // Ejecución de inserción a la base de datos
            const [resp] = await conn.query('INSERT INTO empresas SET ?', empresa)
            await conn.end()
            /* Asigna el id generado automáticamente por la base de datos
             a la propiedad empresaId del objeto empresa */
            empresa.empresaId = resp.insertId
            return empresa
        } catch (error) {
            if (conn) await conn.end() // Si hay una conexión abierta, se cierra
            throw(error) // Se lanza un error
        }
    },
    // Función para obtener todas las empresas de la base de datos
    getEmpresasMsql: async () => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            const [resp] = await conn.query("SELECT * FROM empresas")
            await conn.end() // Cierre de la conexión
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    // Función para obtener una empresa por su ID
    getEmpresaById: async(empresaId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select * from empresas where empresaId = ${empresaId}`
            const [resp] = await conn.query(sql) // Ejecución de la consulta SQL
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    // Función para actualizar una empresa en la base de datos
    putEmpresasMsql: async(empresa) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `UPDATE empresas SET ? WHERE empresaId = ?`
            // Ejecución de la consulta SQL
            const [resp] = await conn.query(sql, [empresa, empresa.empresaId])
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    //  Función para eliminar una empresa de la base de datos
    deleteEmpresaById: async(empresaId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `DELETE FROM empresas WHERE empresaId= ${empresaId}`
            const [resp] = await conn.query(sql)
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    buscarEmpresaPorCodigo: async (codigo) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            const [resp] = await conn.query(`SELECT * FROM empresas WHERE codigo='${codigo}'`)
            await conn.end()
            if (resp.length === 0) return null
            let empresa = resp[0]
            return empresa
        } catch (error) {
            if (conn) await conn.end()
            throw (error)
        }
    },
}

export default empresasMysql;