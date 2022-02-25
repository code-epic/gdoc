--
-- INFI_TB_Z14_ENTIDAD_REG_ERR  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR
(
  Z01_CO_CODIGO_ENTIDAD  VARCHAR2(100 BYTE)     NOT NULL,
  Z14_CO_PROCESO         NUMBER(22)             NOT NULL,
  Z14_NU_REGISTRO        NUMBER(22)             NOT NULL,
  Z14_MENSAJE            VARCHAR2(200 BYTE)     NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR IS 'Tabla que contiene los errores especificos encontrados por el proceso de transformacion para una entidad particular.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR.Z01_CO_CODIGO_ENTIDAD IS 'Codigo que identifica la entidad a la cual esta asociado este procesamiento. FK con Z01.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR.Z14_CO_PROCESO IS 'Codigo que identifica el proceso del archivo utilizado como entrada para cargar en las tablas intermedias.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR.Z14_NU_REGISTRO IS 'Identifica el numero de registro que contiene problemas.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR.Z14_MENSAJE IS 'Identifica el codigo del errore encontrado al momento de querer hacer el INSERT en la tabla intermedia.';

--
-- INFI_TB_Z14_ENTIDAD_REG_ERR  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z14_ENTIDAD_REG_ERR FOR ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z14_ENTIDAD_REG_ERR TO USU_INFI;

