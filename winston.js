// the following code is provide by the company I am working with: Ariadna software
"use strict";
import appRoot from 'app-root-path';
import { createLogger, transports as _transports } from 'winston';
import { config } from 'dotenv';

config();

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: process.env.WINSTON_FILELEVEL || 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    /* 
    Limitamos el tamaño del fichero a 5MB.
    */
    maxsize: 5242880, // 5MB
     /* 
      ¿Pero qué pasa cuando se llena? 
       Pues de ese tema se encarga la siguiente opción.
       Por tener ese valor en 5, lo que hará winston es crear un nuevo archivo y 
       si se llena otro más. hasta un máximo de 5, cuando se llega a 5
       se machaca el log más antiguo. Luego por mucho que grabe winston.info 
       nos superará los 5 x 5MB = 25MB.
     */
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: process.env.ARIFACE2_WINSTON_CONSOLELEVEL || 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
  transports: [
    new _transports.File(options.file),
    new _transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
// use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

export default logger;
