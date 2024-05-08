CREATE DATABASE /*!32312 IF NOT EXISTS*/`huella_horaria` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `huella_horaria`;

/*Table structure for table `administradores` */

DROP TABLE IF EXISTS `administradores`;

CREATE TABLE `administradores` (
  `adminId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de administradores',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre de administrador',
  `apellido1` varchar(100) NOT NULL COMMENT 'El primer apellido de administrador',
  `apellido2` varchar(100) DEFAULT NULL COMMENT 'El segundo apellido de administrador(se mantiene como nulo, ya que en algunos países no tienen dos apellidos)',
  `usuario` varchar(100) NOT NULL COMMENT 'El nombre de usuario de administrador para hacer login en su cuenta',
  `password` varchar(255) NOT NULL COMMENT 'La contraseña de la cuenta de administrador',
  `empresaId` int(11) DEFAULT NULL COMMENT 'El identificador de empresa al que pertenece el administrador',
  `email` varchar(100) DEFAULT NULL COMMENT 'email de admin',
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `administradores_unique` (`usuario`),
  KEY `administradores_empresas_FK` (`empresaId`),
  CONSTRAINT `administradores_empresas_FK` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

/*Table structure for table `empresas` */

DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
  `empresaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la empresa',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre de la empresa',
  `direccion` varchar(255) DEFAULT NULL COMMENT 'Dirección de la empresa',
  `apiKey` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Esta tabla almacena la información de las empresas';

/*Table structure for table `fichajes` */

DROP TABLE IF EXISTS `fichajes`;

CREATE TABLE `fichajes` (
  `fichajeId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del fichaje',
  `trabajadorId` int(11) NOT NULL COMMENT 'El identificador único del trabajador al que pertenece el fichaje',
  `fechaHora` datetime NOT NULL COMMENT 'La fecha y la hora del fichaje',
  `longitud` decimal(11,8) DEFAULT NULL COMMENT 'La coordenada geográfica de longitud se describe con 11 dígitos para la parte entera y 8 dígitos para la parte decimal. Esta medida, indica la ubicación de un lugar en dirección Este u Oeste desde el meridiano de Greenwich.',
  `latitud` decimal(11,8) DEFAULT NULL COMMENT 'La coordenada geográfica de latitud se describe con 11 dígitos para la parte entera y 8 dígitos para la parte decimal. La latitud indica la ubicación de un lugar en dirección Norte o Sur desde el ecuador.',
  `tipo` varchar(100) DEFAULT NULL COMMENT 'Indica el tipo de fichaje si es entrada o salida',
  PRIMARY KEY (`fichajeId`),
  KEY `fichajes_trabajadores_FK` (`trabajadorId`),
  CONSTRAINT `fichajes_trabajadores_FK` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8 COMMENT='Esta tabla guarda la información de fichajes de entrada y salido de los trabjadores';

/*Table structure for table `grupos_trabajadores` */

DROP TABLE IF EXISTS `grupos_trabajadores`;

CREATE TABLE `grupos_trabajadores` (
  `grupoId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del grupo',
  `nombre` varchar(100) NOT NULL COMMENT 'El nombre del grupo',
  `empresaId` int(11) DEFAULT NULL COMMENT 'Indentificador de la empresa al que el grupo pertanece.',
  PRIMARY KEY (`grupoId`),
  KEY `grupos_trabajadores_empresas_FK` (`empresaId`),
  CONSTRAINT `grupos_trabajadores_empresas_FK` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='Esta tabla guarda la información de los grupos de trabajadores';

/*Table structure for table `trabajadores` */

DROP TABLE IF EXISTS `trabajadores`;

CREATE TABLE `trabajadores` (
  `trabajadorId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del trabajador',
  `empresaId` int(11) NOT NULL COMMENT 'El identificador de empresa al que pertenece el trabajador',
  `apellido1` varchar(100) NOT NULL COMMENT 'El primer apellido del trabajador',
  `apellido2` varchar(100) DEFAULT NULL COMMENT 'El segundo apellido de trabajador(se mantiene como nulo, ya que en algunos países no tienen dos apellidos)',
  `usuario` varchar(100) NOT NULL COMMENT 'El nombre de usuario de la cuenta del trabajador para hacer login',
  `password` varchar(255) NOT NULL COMMENT 'la contraseña de la cuenta del trabajador',
  `grupoId` int(11) DEFAULT NULL COMMENT 'Identificador del grupo al que pertanece el trabajador',
  `email` varchar(100) DEFAULT NULL COMMENT 'email del trabajador',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'el nombre del trabajador',
  PRIMARY KEY (`trabajadorId`),
  UNIQUE KEY `trabajadores_unique` (`usuario`),
  KEY `trabajadores_grupos_trabajadores_FK` (`grupoId`),
  KEY `trabajadores_empresas_FK` (`empresaId`),
  CONSTRAINT `trabajadores_grupos_trabajadores_FK` FOREIGN KEY (`grupoId`) REFERENCES `grupos_trabajadores` (`grupoId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COMMENT='Esta tabla almacena las informaciones de trabajadores';

