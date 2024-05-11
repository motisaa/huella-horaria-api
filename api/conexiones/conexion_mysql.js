import { config } from 'dotenv';
/* Llama a la función config para cargar las variables de entorno definidas en el archivo`.env` */
config();

const mysqlConnection = {
    obtenerConexion: () => {
        let configuracion = {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            timezone : "+00:00"
        }
        return configuracion
    }
}

export default mysqlConnection;