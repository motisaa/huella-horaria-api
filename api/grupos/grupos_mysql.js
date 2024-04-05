import mysql from 'mysql2/promise' 
import mysqlConnection from '../conexiones/conexion_mysql.js'

const gruposMysql = {
    postGrupos: async (grupo) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion();
            conn = await mysql.createConnection(cfg);
            const [resp] = await conn.query('INSERT INTO grupos_trabajadores SET ?', grupo);
            await conn.end();
            grupo.grupoId = resp.insertId;
            return grupo;
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    getGrupos: async () => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            const [resp] = await conn.query("SELECT * FROM grupos_trabajadores")
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },

    getGrupoById: async(grupoId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `select * from grupos_trabajadores where grupoId = ${grupoId}`
            const [resp] = await conn.query(sql)
            if (resp.length == 0) return null
            let grupo = resp[0]
            sql = `select * from trabajadoes where grupoId = ${grupoId}`
            // Utlizimos resp2 
            const [resp2] = await conn.query(sql)
            // Agregamos la lista de trabajadores al objeto grupo
            grupo.usuarios = resp2;
            await conn.end()
            return grupo
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },

    putGrupos: async(grupos) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `UPDATE grupos_trabajadores SET ? WHERE grupoId = ?`
            const [resp] = await conn.query(sql, [grupos, grupos.grupoId])
            await conn.end()
            return resp 
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
    deleteGrupoById: async(grupoId) => {
        let conn = undefined
        try {
            let cfg = mysqlConnection.obtenerConexion()
            conn = await mysql.createConnection(cfg)
            let sql = `DELETE FROM grupos_trabajadores WHERE grupoId= ${grupoId}`
            const [resp] = await conn.query(sql, [grupoId])
            await conn.end()
            return resp
        } catch (error) {
            if (conn) await conn.end()
            throw(error)
        }
    },
}

export default gruposMysql;