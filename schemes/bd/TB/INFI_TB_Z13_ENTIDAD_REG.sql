--
-- INFI_TB_Z13_ENTIDAD_REG  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z13_ENTIDAD_REG
(
  Z01_CO_CODIGO_ENTIDAD   VARCHAR2(100 BYTE)    NOT NULL,
  Z13_CO_PROCESO          NUMBER(22)            NOT NULL,
  Z13_FE_PROCESO          DATE                  NOT NULL,
  Z13_REGISTROS_CARGADOS  NUMBER(7)             NOT NULL,
  Z13_REGISTROS_LEIDOS    NUMBER(7)             NOT NULL,
  Z13_USUARIO             VARCHAR2(100 BYTE)    NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z13_ENTIDAD_REG IS 'Tabla que permite llevar un control por Entidad Logica, de los registros leidos (registros validados y listos para cargar) y registros cargados en la Tabla Fisica asociada a la Entidad Logica. Esta tabla es poblada por el proceso de Transformación que lee los registros validados desde Z12, y los carga en Z15.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z01_CO_CODIGO_ENTIDAD IS 'Codigo que identifica la entidad a la cual esta asociado este procesamiento. FK con Z01.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z13_CO_PROCESO IS 'Codigo que identifica el numero de proceso de donde se tomaron los registros para la carga.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z13_FE_PROCESO IS 'Fecha y Hora en que se realizó el proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z13_REGISTROS_CARGADOS IS 'Cantidad de registros cargados en la tabla fisica relacionada a la entidad.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z13_REGISTROS_LEIDOS IS 'Cantidad de registros leidos de Z12 para el proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z13_ENTIDAD_REG.Z13_USUARIO IS 'Usuario que ejecuto el proceso de transformacion. Debe ser ingresado por Pantalla y es de uso referencial.';

--
-- INFI_TB_Z13_ENTIDAD_REG  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z13_ENTIDAD_REG FOR ADM_INFI.INFI_TB_Z13_ENTIDAD_REG;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z13_ENTIDAD_REG TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z13_ENTIDAD_REG TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z13_ENTIDAD_REG TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z13_ENTIDAD_REG TO USU_INFI;

