"use strict";
import express from 'express'; // Importa el framework Express.js
import cors from 'cors';
import bodyParser from 'body-parser'; // Importa el middleware Body Parser
import winston from './winston.js'; // Importa el módulo Winston
const app = express(); // Initialize express application
import empresasRouter from './api/empresas/empresas_controlador.js';
import adminsRouter from './api/administradores/administradores_controlador.js'

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
        app.use(bodyParser.urlencoded({extended: false}));
        // Middleware para analizar cuerpos de solicitudes JSON
        app.use(bodyParser.json());
        
        // fixed: las rutas de api tienen que ir después de bodyParser
        app.use('/v1/empresas', empresasRouter);
        app.use('/v1/administradores', adminsRouter);

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
        const server = app.listen(port, () => {});
    }
};

// Exportamos el objeto appServer para su uso en otros archivos
export default appServer;