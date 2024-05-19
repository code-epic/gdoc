
DROP TABLE IF EXISTS estructura_temp;

CREATE TABLE estructura_temp (
  oid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  NIVEL_1 TEXT  NOT NULL,
  NIVEL_2 TEXT NOT NULL,
  abrev_2 TEXT NOT NULL,
  NIVEL_3 TEXT NOT NULL,
  OBS_3 TEXT NOT NULL,
  LEGAL_3 TEXT NOT NULL,
  UBICA_3 TEXT NOT NULL,
  abrev_3 TEXT NOT NULL,
  NIVEL_4 TEXT NOT NULL,
  abrev_4 TEXT NOT NULL,
  legal_4 TEXT NOT NULL,
  UBICACION_4 TEXT NOT NULL,
  obser_4 TEXT NOT NULL,
  NIVEL_5 TEXT NOT NULL,
  UBICACION_5 TEXT NOT NULL,
  ABREV_5 TEXT NOT NULL,
  Columna1 TEXT NOT NULL,
  legal_5 TEXT NOT NULL,
  Columna2 TEXT NOT NULL,
  NIVEL_6 TEXT NOT NULL,
  legal_6 TEXT NOT NULL,
  ABREV_6 TEXT NOT NULL,
  UBICA_6 TEXT NOT NULL,
  cont TEXT NOT NULL DEFAULT (''),
   FULLTEXT (NIVEL_1,cont)
);


UPDATE estructura_temp SET cont= CONCAT( NIVEL_2 ,' ',
  abrev_2 ,' ',
  NIVEL_3 ,' ',
  OBS_3 ,' ',
  LEGAL_3 ,' ',
  UBICA_3 ,' ',
  abrev_3 ,' ',
  NIVEL_4 ,' ',
  abrev_4 ,' ',
  legal_4 ,' ',
  UBICACION_4 ,' ',
  obser_4 ,' ',
  NIVEL_5 ,' ',
  UBICACION_5 ,' ',
  ABREV_5 ,' ',
  Columna1 ,' ',
  legal_5 ,' ',
  Columna2 ,' ',
  NIVEL_6 ,' ',
  legal_6 ,' ',
  ABREV_6 ,' ',
  UBICA_6) WHERE oid > 0;

SELECT * FROM estructura_temp WHERE MATCH (NIVEL_1,cont)  AGAINST ('"Dirección De Personal Civil"' IN NATURAL LANGUAGE MODE);
SELECT * FROM estructura_temp WHERE MATCH (NIVEL_1,cont)  AGAINST ('"resoluciones"' IN NATURAL LANGUAGE MODE);
SELECT * FROM estructura_temp WHERE MATCH (NIVEL_1,cont)  AGAINST ('OGH' IN NATURAL LANGUAGE MODE);



-- mppd.resoluciones_mppd definition

CREATE TABLE `zh_resoluciones_mppd` (
  `id` int ,
  `cedula_resol` varchar(15) NOT NULL,
  `cod_tipo_resol` int NOT NULL,
  `numero_resol` varchar(30)  NOT NULL,
  `fecha_resol` date NOT NULL,
  `asunto` varchar(2000) NOT NULL,
  `cod_pais` int NOT NULL,
  `destino` varchar(1000) NOT NULL,
  `observacion` varchar(2000) NOT NULL,
  `cod_solicitud` int NOT NULL,
  `cod_reserva` int NOT NULL,
  `f_termino` date NOT NULL,
  `termino` int NOT NULL,
  `registrado` varchar(10) NOT NULL,
  `modificado` varchar(10) NOT NULL,
  `f_modificado` datetime NOT NULL,
  `instrucciones` text NOT NULL DEFAULT (''),
  `comando` varchar(256)  NOT NULL DEFAULT (''),
  `unidad_comando` varchar(256)  NOT NULL DEFAULT (''),
  `cod_unidad` varchar(256) NOT NULL DEFAULT (''),
  `distribucion` varchar(256) NOT NULL DEFAULT (''),
  `esta` int DEFAULT NULL,
  `otro_resuelto` varchar(256)NOT NULL DEFAULT (''),
  `motivo` varchar(256) NOT NULL DEFAULT (''),
  `falta` varchar(256) NOT NULL DEFAULT (''),
  `formato` varchar(4) NOT NULL DEFAULT (''),
  `creador` varchar(256) NOT NULL DEFAULT (''),
  `comision_inicio` date DEFAULT NULL,
  `comision_fin` date DEFAULT NULL,
  `fecha_registro` timestamp ,
  `evento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


select * from resoluciones_mppd rm limit 1
ALTER TABLE resoluciones_mppd 
	MODIFY `fecha_resol` VARCHAR(20),
	MODIFY `f_termino` VARCHAR(20),
	MODIFY `f_modificado` VARCHAR(20);

UPDATE resoluciones_mppd SET fecha_resol='1900-01-01'  where fecha_resol='0000-00-00'
UPDATE resoluciones_mppd SET f_termino='1900-01-01'  where f_termino IN ('2021-00-07', '0005-00-00', '0000-10-00', '2006-07-00','2012-00-05','0000-00-00','0000-00-02')
UPDATE resoluciones_mppd SET f_modificado='1900-01-01 01:01:01'  where f_modificado= '1900-01-01 00:00:00'; --'0000-00-00 00:00:00';

ALTER TABLE resoluciones_mppd 
	MODIFY `fecha_resol` DATE  NOT NULL,
	MODIFY `f_termino` DATE  NOT NULL,
	MODIFY `f_modificado` datetime NOT NULL;
	

ALTER TABLE resoluciones_mppd MODIFY `f_modificado`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


SELECT TIMESTAMP("1900-01-01", "01:01:01");

ALTER TABLE resoluciones_mppd MODIFY `f_termino` date NOT NULL default ('1900-01-02');

ALTER TABLE resoluciones_mppd 
	ADD COLUMN documento int NOT NULL,
	ADD COLUMN causa int NOT NULL,
	ADD COLUMN orden int NOT NULL, 
	ADD COLUMN agrado  int  NOT NULL,
	ADD COLUMN anio  int  NOT NULL,
	ADD COLUMN mes  int  NOT NULL,
	ADD COLUMN dia  int  NOT NULL,
	ADD COLUMN fultimoascenso  DATE NOT NULL DEFAULT ('1900-01-01'),
	ADD COLUMN instrucciones TEXT NOT NULL default (''),
	ADD COLUMN comando VARCHAR (256) NOT NULL default (''),
	ADD COLUMN unidad_comando VARCHAR (256) NOT NULL default (''),
	ADD COLUMN cod_unidad VARCHAR (256) NOT NULL default (''),
	ADD COLUMN distribucion VARCHAR (256) NOT NULL default (''),
	ADD COLUMN esta INT,
	ADD COLUMN otro_resuelto VARCHAR (256) NOT NULL default (''),
	ADD COLUMN motivo VARCHAR (256) NOT NULL default (''),
	ADD COLUMN falta VARCHAR (256) NOT NULL default (''),
	ADD COLUMN formato VARCHAR (4) NOT NULL default (''), /*Formato permite saber si es unidad o personal*/
	ADD COLUMN creador VARCHAR (256) NOT NULL default (''),
	ADD COLUMN comision_inicio date ,
	ADD COLUMN comision_fin date ,
	ADD COLUMN fecha_registro timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


ALTER TABLE resoluciones_mppd 
DROP COLUMN documento, 
DROP COLUMN causa,
DROP COLUMN orden, 
DROP COLUMN agrado,
DROP COLUMN anio,
DROP COLUMN mes,
DROP COLUMN dia,
DROP COLUMN fultimoascenso,
DROP COLUMN comando,
DROP COLUMN instrucciones,
DROP COLUMN cod_unidad,
DROP COLUMN unidad_comando,
DROP COLUMN distribucion,
DROP COLUMN esta,
DROP COLUMN otro_resuelto,
DROP COLUMN motivo,
DROP COLUMN falta,
DROP COLUMN formato,
DROP COLUMN creador,
DROP COLUMN comision_inicio,
DROP COLUMN comision_fin,
DROP COLUMN fecha_registro;






select * from resoluciones_mppd rm where f_termino ='0000-00-00' 

ALTER TABLE tipo_resoluciones 
ADD COLUMN tipo INT  DEFAULT (0), 
ADD COLUMN estatus INT DEFAULT (1),
ADD COLUMN creador VARCHAR (256) DEFAULT (''),
ADD COLUMN fecha_registro timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;



ALTER TABLE tipo_resoluciones 
DROP COLUMN tipo , 
DROP COLUMN estatus,
DROP COLUMN creador,
DROP COLUMN fecha_registro;

update tipo_resoluciones set tipo=1 where cod_tipo_resol IN (85);
update tipo_resoluciones set tipo=2 where cod_tipo_resol IN (9,10);
update tipo_resoluciones set tipo=3 where cod_tipo_resol IN (34,35,36,37,28,29,40,84,103,104,105,106,107,108,117);
update tipo_resoluciones set tipo=4 where cod_tipo_resol IN (17,27,79,82);
update tipo_resoluciones set tipo=5 where cod_tipo_resol IN (28,59,60,61,63,64,65,66,67);
-- update tipo_resoluciones set tipo=6 where cod_tipo_resol IN (17);
update tipo_resoluciones set tipo=7 where cod_tipo_resol IN (13);
update tipo_resoluciones set tipo=8 where cod_tipo_resol IN (93);
-- DROP TABLE IF EXISTS n_componente;
CREATE TABLE n_componente (
	id INT NOT NULL AUTO_INCREMENT,
	codigo varchar(10),
	nombre varchar(30),
	descripcion varchar(255),
	status_id int,
	PRIMARY KEY (`id`)
);


CREATE TABLE n_grado (
	id INT NOT NULL AUTO_INCREMENT,
	nombre varchar(30),
	descripcion varchar(255),
	tiempo_ascenso int,
	status_id int,
	codigo int,
	componente_id int,
	 PRIMARY KEY (`id`)
);


ALTER TABLE datos_basicos  
ADD COLUMN orden int NOT NULL, 
ADD COLUMN n_grado int NOT NULL, 
ADD COLUMN n_componente int  NOT NULL,
ADD COLUMN especialidad int  NOT NULL,
ADD COLUMN area  varchar(250)  NOT NULL,
ADD COLUMN estudios  varchar(250)  NOT NULL,
ADD COLUMN condicion  int  NOT NULL,
ADD COLUMN anio  int  NOT NULL,
ADD COLUMN mes  int  NOT NULL,
ADD COLUMN dia  int  NOT NULL,
ADD COLUMN fultimoascenso  DATE NOT NULL DEFAULT ('1900-01-01');


ALTER TABLE datos_basicos  
DROP COLUMN n_grado , 
DROP COLUMN n_componente,
DROP COLUMN especialidad , 
DROP COLUMN area , 
DROP COLUMN estudios,
DROP COLUMN condicion,
DROP COLUMN orden,
DROP COLUMN anio,
DROP COLUMN mes,
DROP COLUMN dia,
DROP COLUMN fultimoascenso ;

UPDATE  datos_basicos SET n_componente=1 WHERE cod_componente = 100;
UPDATE  datos_basicos SET n_componente=2 WHERE cod_componente = 200;
UPDATE  datos_basicos SET n_componente=3 WHERE cod_componente = 300;
UPDATE  datos_basicos SET n_componente=4 WHERE cod_componente = 400;

select * FROM datos_basicos db where db.fecha_nacimiento IS  NULL



ALTER TABLE datos_basicos 
	MODIFY `fecha_resol` VARCHAR(20),
	MODIFY `fecha_promocion` VARCHAR(20),
	MODIFY `fecha_nacimiento` VARCHAR(20);

UPDATE datos_basicos SET fecha_resol='1900-01-01'  where fecha_resol='0000-00-00'
UPDATE datos_basicos SET fecha_promocion='1900-01-01'  where fecha_promocion IN ('0005-00-00', '0000-10-00', '2006-07-00','2012-00-05','0000-00-00','0000-00-02')
UPDATE datos_basicos SET fecha_nacimiento='1900-01-01'  where fecha_nacimiento IS NULL

ALTER TABLE datos_basicos 
	MODIFY `fecha_resol` DATE  NOT NULL,
	MODIFY `fecha_promocion` DATE  NOT NULL,
	MODIFY `fecha_nacimiento` DATE  NOT NULL;
	
	
delimiter $$
$$
CREATE TRIGGER datos_basicos_hitorial
AFTER UPDATE ON datos_basicos FOR EACH ROW 
BEGIN
    INSERT INTO zh_datos_basicos
		(cedula, nombres_apellidos, cod_categoria, cod_grado, cod_componente, cod_clasificacion, 
		cod_tipo_resol, cod_solicitud, cod_reserva, fecha_resol, fecha_promocion, sexo, fecha_nacimiento, 
		observacion, cod_profe1, cod_profe2, n_grado, n_componente, especialidad, area, estudios, condicion)
	VALUES(
		OLD.cedula, OLD.nombres_apellidos, OLD.cod_categoria, OLD.cod_grado, OLD.cod_componente, OLD.cod_clasificacion, 
		OLD.cod_tipo_resol, OLD.cod_solicitud, OLD.cod_reserva, OLD.fecha_resol, OLD.fecha_promocion, 
		OLD.sexo, OLD.fecha_nacimiento, OLD.observacion, OLD.cod_profe1, OLD.cod_profe2, OLD.n_grado, 
		OLD.n_componente, OLD.especialidad, OLD.area, OLD.estudios, OLD.condicion
	);
END $$
delimiter ;


SELECT * FROM n_componente c 
LEFT JOIN n_grado g ON c.id=g.componente_id  
WHERE c.id = 1
ORDER BY g.codigo DESC

-- mppd.grado definition
DROP TABLE IF EXISTS grado 
CREATE TABLE `grado` (
  `cod_grado` int NOT NULL AUTO_INCREMENT,
  `nombres_grado` varchar(50) NOT NULL,
  `nombre_corto` varchar(10) NOT NULL,
  `n_codigo` int,
  PRIMARY KEY (`cod_grado`)
);



SELECT * FROM datos_basicos db   
LEFT JOIN grado g ON db .cod_grado = g.cod_grado 
limit 10


-- mppd.datos_basicos definition
DROP TABLE IF EXISTS zh_datos_basicos;
CREATE TABLE zh_datos_basicos (
  `cedula` varchar(15) NOT NULL,
  `nombres_apellidos`  varchar(60)  NOT NULL,
  `cod_categoria` int DEFAULT NULL,
  `cod_grado` int NOT NULL,
  `cod_componente` int NOT NULL,
  `cod_clasificacion` int NOT NULL,
  `cod_tipo_resol` int NOT NULL,
  `cod_solicitud` int NOT NULL,
  `cod_reserva` int NOT NULL,
  `fecha_resol` date NOT NULL,
  `fecha_promocion` date NOT NULL,
  `sexo` varchar(1) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `observacion` text NOT NULL,
  `cod_profe1` varchar(300) NOT NULL,
  `cod_profe2` varchar(300) NOT NULL,
  `n_grado` int NOT NULL,
  `n_componente` int NOT NULL,
  `especialidad` int NOT NULL,
  `area` varchar(250) NOT NULL,
  `estudios` varchar(250) NOT NULL,
  `condicion` int NOT NULL
);




SELECT * FROM datos_basicos db WHERE db.cedula = '18428522'

-- mppd.datos_basicos definition



DROP TABLE IF EXISTS estructura_temp;
CREATE TABLE estructura_temp (
  oid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nivel_1	TEXT NOT NULL DEFAULT (''), nivel_2	TEXT NOT NULL DEFAULT (''),
  abrev_2	VARCHAR(128) NOT NULL DEFAULT (''), ubica_2 TEXT NOT NULL DEFAULT (''),
  legal_2	TEXT NOT NULL DEFAULT (''), nivel_3	TEXT NOT NULL DEFAULT (''),
  obs_3	TEXT NOT NULL DEFAULT (''), legal_3	TEXT NOT NULL DEFAULT (''),
  ubica_3	TEXT NOT NULL DEFAULT (''), abrev_3	VARCHAR(128) NOT NULL DEFAULT (''),
  nivel_4	TEXT NOT NULL DEFAULT (''),	abrev_4	VARCHAR(128) NOT NULL DEFAULT (''),	
  legal_4	TEXT NOT NULL DEFAULT (''),	ubica_4	TEXT NOT NULL DEFAULT (''),	
  obser_4	TEXT NOT NULL DEFAULT (''),	nivel_5	TEXT NOT NULL DEFAULT (''),	
  ubica_5	TEXT NOT NULL DEFAULT (''),	abrev_5	VARCHAR(128) NOT NULL DEFAULT (''),
  obser_5	TEXT NOT NULL DEFAULT (''), legal_5	TEXT NOT NULL DEFAULT (''),
  nivel_6	TEXT NOT NULL DEFAULT (''), legal_6	TEXT NOT NULL DEFAULT (''),
  abrev_6	VARCHAR(128) NOT NULL DEFAULT (''), ubica_6	TEXT NOT NULL DEFAULT (''),
  nivel_7	TEXT NOT NULL DEFAULT (''), legal_7	TEXT NOT NULL DEFAULT (''),
  ubica_7	TEXT NOT NULL DEFAULT (''), nivel_8 TEXT NOT NULL DEFAULT (''),
  cont TEXT NOT NULL DEFAULT (''),
  FULLTEXT (nivel_1,cont)
);

UPDATE estructura_temp SET cont= CONCAT(
  nivel_1,	' ', nivel_2,	' ', 	abrev_2,	' ', 	ubica_2,	' ', 	legal_2,	' ', 
  nivel_3,	' ', 	obs_3,	' ',  legal_3,	' ', 	ubica_3,	' ', 	abrev_3,	' ', 	
  nivel_4,	' ', 	abrev_4,	' ', 	legal_4,	' ', 	ubica_4,	' ', 	obser_4,	' ', 	
  nivel_5,	' ', 	ubica_5,	' ', 	abrev_5,	' ', 	obser_5,	' ', 	legal_5,	' ', 
  nivel_6,	' ', 	legal_6,	' ', 	abrev_6,	' ', 	ubica_6,	' ', 	nivel_7,	' ', 
  legal_7,	' ', 	ubica_7,	' ', 	nivel_8) 
WHERE oid > 0;