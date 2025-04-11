--
-- INFI_TB_Z01_ENTIDAD  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z01_ENTIDAD
(
  Z01_CO_CODIGO_ENTIDAD       NUMBER(22)        NOT NULL,
  Z01_NO_NOMBRE_ENTIDAD       VARCHAR2(50 BYTE) NOT NULL,
  Z01_DE_DESCRIPCION_ENTIDAD  VARCHAR2(200 BYTE),
  Z01_NO_TABLA_ENTIDAD_1      VARCHAR2(200 BYTE),
  Z01_NO_TABLA_ENTIDAD_2      VARCHAR2(200 BYTE),
  Z01_NO_TABLA_ENTIDAD_3      VARCHAR2(200 BYTE),
  Z01_TRF_REGISTROS           NUMBER(7),
  Z01_CAR_REGISTROS           NUMBER(7),
  Z01_UPD_FECHA               DATE,
  Z01_STATUS                  NUMBER(22)        NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z01_ENTIDAD IS 'Tabla que permite definir las Entidades Logicas que se utilizan para la Carga Inicial de Datos. Esta Entidad permite relacionar las tablas fisicas donde se cargan los datos por el proceso de Transformación de registros. Permite cargar en forma unitaria diferentes tablas, para luego ser procesadas por los procesos de Carga Final.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_CO_CODIGO_ENTIDAD IS 'Codigo que identifica la Identidad.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_NO_NOMBRE_ENTIDAD IS 'Nombre que identifica la Entidad. Nombre logico de referencia.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_DE_DESCRIPCION_ENTIDAD IS 'Descripcion de la Entidad.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_NO_TABLA_ENTIDAD_1 IS 'Nombre fisico de la tabla en la Base de Datos correspondiente a la primera tabla asociada. Toda entidad debe tener por lo menos una tabla fisica asociada.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_NO_TABLA_ENTIDAD_2 IS 'Nombre fisico de la tabla en la Base de Datos correspondiente a la segunda tabla asociada.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_NO_TABLA_ENTIDAD_3 IS 'Nombre fisico de la tabla en la Base de Datos correspondiente a la tercera tabla asociada.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_TRF_REGISTROS IS 'Campo que identifica la cantidad de registros que se cargaron para la Entidad en el proceso de transformacion de datos desde las estructuras iniciales (Z12) a las estructuras intermedias creadas para esto. Actualizado por proceso de transformacion de datos.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_CAR_REGISTROS IS 'Campo que identifica la cantidad de registros que se cargaron para la Entidad en el proceso de carga final  de datos desde las estructuras intermedias  (Z50-Z70) a las estructuras finales de la Base de datos INFI correspondientes.  Actualizado por proceso de carga final de datos.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_UPD_FECHA IS 'Fecha y hora de la ultima actualizado de datos para la entidad. Actualizado por procesos de transformacion o carga final.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z01_ENTIDAD.Z01_STATUS IS 'Status de la Entidad. Actualizado por proceso de Carga final. 0= Indica que no se ha culminado el proceso de la carga de los datos finalmente. 1= Indica que la Entidad fue procesad y espera por confirmación del Cliente de su aceptación. 2= Indica que el proceso para esta entidad esta culminado (este se coloca manualmente)';

--
-- INFI_PK_Z01_PK1  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.INFI_PK_Z01_PK1 ON ADM_INFI.INFI_TB_Z01_ENTIDAD
(Z01_CO_CODIGO_ENTIDAD)
NOLOGGING
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
            BUFFER_POOL      DEFAULT
           )
PARALLEL ( DEGREE 4 INSTANCES 1 );

--
-- INFI_TB_Z01_ENTIDAD  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z01_ENTIDAD FOR ADM_INFI.INFI_TB_Z01_ENTIDAD;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z01_ENTIDAD TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z01_ENTIDAD TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z01_ENTIDAD TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z01_ENTIDAD TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z01_ENTIDAD 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z01_ENTIDAD ADD (
  CONSTRAINT INFI_PK_Z01_PK1
 PRIMARY KEY
 (Z01_CO_CODIGO_ENTIDAD)
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


