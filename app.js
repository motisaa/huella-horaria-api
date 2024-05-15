"use strict";
import express from 'express'; // Importa el framework Express.js
import cors from 'cors';
import bodyParser from 'body-parser'; // Importa el middleware Body Parser
import winston from './winston.js'; // Importa el módulo Winston
import path from 'path';
const app = express(); // Initialize express application
import empresasRouter from './api/empresas/empresas_controlador.js';
import adminsRouter from './api/administradores/administradores_controlador.js'
import trabajadoresRouter from './api/trabajadores/trabajadores_controlador.js';
import fichajesRouter from './api/fichajes/fichajes_controlador.js';
import gruposRouter from './api/grupos/grupos_controlador.js';
import versionRouter from './api/version/version_controlador.js';
import loginRouter from './api/login/login_controlador.js'

// FIXED de chatGPT: utilizamo el módulo path de Node.js para obtener el directorio actual
// porque variable interno __dirname no está definido en el ámbito de los módulos de ES.
const __dirname = path.resolve()

const appServer = {
    createServer: () => {
        winston.info('crear servidor');
        app.use(cors());
        
        /*
        La opción extended se establece en false, lo que significa que
        solo se analizarán los datos que no estén en forma de objeto o matriz.
        Esto es útil cuando solo se espera recibir datos simples de formulario.
        */
        // Middleware para analizar cuerpos de solicitudes codificadas en URL
        app.use(bodyParser.urlencoded({ extended: false }));
        // Middleware para analizar cuerpos de solicitudes JSON
        app.use(bodyParser.json());
        // desde www sirve archivos
        app.use(express.static(__dirname + '/www'));
        
        // fixed: las rutas de api tienen que ir después de bodyParser
        app.use('/v1/empresas', empresasRouter);
        app.use('/v1/administradores', adminsRouter);
        app.use('/v1/trabajadores', trabajadoresRouter);
        app.use('/v1/fichajes', fichajesRouter);
        app.use('/v1/version', versionRouter);
        app.use('/v1/login', loginRouter);
        //adding router of group
        app.use('/v1/grupos_trabajadores', gruposRouter);
        
        // cuando las llamadas no son de api sirves el fichero index.html del directorio www
        app.use((req, res, next) => {
            res.sendFile(path.join(__dirname, "www", "index.html"));
        });


        // Middleware para manejar errores
        app.use((error, res) => {
            res.status(error.status || 500);
            res.json({
                error: {
                    message: error.message
                }
            });
        });
    },
    // Método para lanzar el servidor
    launchServer: () => {
        winston.info('servidor lanzado');
        // Obtiene el puerto del entorno o utiliza el puerto 8080 como predeterminado
        const port = process.env.PORT || 8080;
        winston.info(`Server huella horaria listen at port ${port}`);
        // El servidor comienza a escuchar las solicitudes entrantes
        const server = app.listen(port, () => { });
    }
};

// Exportamos el objeto appServer para su uso en otros archivos
export default appServer;