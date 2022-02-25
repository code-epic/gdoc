--
-- INFI_TB_Z12_REGISTROS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z12_REGISTROS
(
  Z12_CO_CODIGO_REGISTRO  NUMBER(22)            NOT NULL,
  Z11_COD_PROCESO         NUMBER(22)            NOT NULL,
  Z12_NU_NUMERO_REGISTRO  NUMBER(22),
  Z12_CAMPO1_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO1_RESULTADO    NUMBER(22),
  Z12_CAMPO1_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO2_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO2_RESULTADO    NUMBER(22),
  Z12_CAMPO2_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO3_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO3_RESULTADO    NUMBER(22),
  Z12_CAMPO3_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO4_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO4_RESULTADO    NUMBER(22),
  Z12_CAMPO4_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO5_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO5_RESULTADO    NUMBER(22),
  Z12_CAMPO5_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO6_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO6_RESULTADO    NUMBER(22),
  Z12_CAMPO6_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO7_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO7_RESULTADO    NUMBER(22),
  Z12_CAMPO7_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO8_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO8_RESULTADO    NUMBER(22),
  Z12_CAMPO8_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO9_VALOR        VARCHAR2(200 BYTE),
  Z12_CAMPO9_RESULTADO    NUMBER(22),
  Z12_CAMPO9_MENSAJE      VARCHAR2(200 BYTE),
  Z12_CAMPO10_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO10_RESULTADO   NUMBER(22),
  Z12_CAMPO10_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO11_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO11_RESULTADO   NUMBER(22),
  Z12_CAMPO11_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO12_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO12_RESULTADO   NUMBER(22),
  Z12_CAMPO12_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO13_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO13_RESULTADO   NUMBER(22),
  Z12_CAMPO13_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO14_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO14_RESULTADO   NUMBER(22),
  Z12_CAMPO14_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO15_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO15_RESULTADO   NUMBER(22),
  Z12_CAMPO15_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO16_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO16_RESULTADO   NUMBER(22),
  Z12_CAMPO16_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO17_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO17_RESULTADO   NUMBER(22),
  Z12_CAMPO17_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO18_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO18_RESULTADO   NUMBER(22),
  Z12_CAMPO18_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO19_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO19_RESULTADO   NUMBER(22),
  Z12_CAMPO19_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO20_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO20_RESULTADO   NUMBER(22),
  Z12_CAMPO20_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO21_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO21_RESULTADO   NUMBER(22),
  Z12_CAMPO21_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO22_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO22_RESULTADO   NUMBER(22),
  Z12_CAMPO22_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO23_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO23_RESULTADO   NUMBER(22),
  Z12_CAMPO23_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO24_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO24_RESULTADO   NUMBER(22),
  Z12_CAMPO24_MENSAJE     VARCHAR2(200 BYTE),
  Z12_CAMPO25_VALOR       VARCHAR2(200 BYTE),
  Z12_CAMPO25_RESULTADO   NUMBER(22),
  Z12_CAMPO25_MENSAJE     VARCHAR2(200 BYTE),
  Z12_ESTATUS             NUMBER(22)
)
TABLESPACE DATA
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       2147483645
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
           )
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

COMMENT ON TABLE ADM_INFI.INFI_TB_Z12_REGISTROS IS 'Contiene los registros cargados en el Sistema desde fuentes externas. En este momento son registros que han pasado por un proceso de validacion. Existen registros con problemas y registros buenos. Los registros buenos, son los que leera el proceso de transformacion de datos.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO12_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO13_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO13_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO13_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO14_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO14_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO14_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO15_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO15_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO15_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO16_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO16_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO16_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO17_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO17_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO17_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO18_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO18_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO18_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO19_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO19_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO19_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO20_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO20_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO20_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO21_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO21_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO21_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO22_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO3_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO3_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO4_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO4_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO4_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO5_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO5_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO5_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO6_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO6_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO6_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO7_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO7_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO7_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO8_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO8_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO8_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO9_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO9_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO9_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO10_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO10_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO10_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO11_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO11_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO11_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO12_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO12_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO3_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CO_CODIGO_REGISTRO IS 'Codigo que identifica el registro. Se genera a través de un SEQUENCE automaticamnete incrementandose de 1 en 1.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z11_COD_PROCESO IS 'Codigo que identifica el Proceso al cual pertenece el registro. FK sobre Z11.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_NU_NUMERO_REGISTRO IS 'Identifica el numero de registro con respecto al archivo origen procesado. Numero secuencial asignado a los registros leidos del archivo fisico, comenzando con 1.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO1_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO1_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO1_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO2_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO2_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO2_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO22_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO23_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO23_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO23_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO24_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO24_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO24_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO25_VALOR IS 'Valor que contiene el campo. Esto aplica para todos los campos, desde el 1, hasta el 25. Representa el valor leido para el campo en el archivo origen y el cual se debe cargar en la Base de Datos final de la aplicacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO25_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO25_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo. Este campo de mensaje aplica para todos los campos, desde el 1 hasta el 25.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_ESTATUS IS 'Status del registro para efectos de transformacion. Si posee 1, significa que todos sus campos estan bien y puede ser transformado para su carga. Si tiene 0 significa que algun campo tiene error.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z12_REGISTROS.Z12_CAMPO22_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación. Esto aplica para los todos los campos desde el 1 hasta el 25.';


--
-- INFI_TB_Z12_REGISTROS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z12_REGISTROS FOR ADM_INFI.INFI_TB_Z12_REGISTROS;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z12_REGISTROS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z12_REGISTROS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z12_REGISTROS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z12_REGISTROS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z12_REGISTROS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z12_REGISTROS ADD (
  PRIMARY KEY
 (Z12_CO_CODIGO_REGISTRO)
    USING INDEX 
    TABLESPACE DATA
    PCTFREE    10
    INITRANS   2
    MAXTRANS   255
    STORAGE    (
                INITIAL          64K
                NEXT             1M
                MINEXTENTS       1
                MAXEXTENTS       2147483645
                PCTINCREASE      0
               ));


-- 
-- Foreign Key Constraints for Table INFI_TB_Z12_REGISTROS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z12_REGISTROS ADD (
  FOREIGN KEY (Z11_COD_PROCESO) 
 REFERENCES ADM_INFI.INFI_TB_Z11_PROCESOS (Z11_COD_PROCESO));


