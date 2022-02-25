--
-- INFI_TB_Z10_ARCHIVOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z10_ARCHIVOS
(
  Z10_CO_CODIGO_ARCHIVO       NUMBER(22)        NOT NULL,
  Z10_NO_NOMBRE_ARCHIVO       VARCHAR2(200 BYTE) NOT NULL,
  Z10_DE_DESCRIPCION_FORMATO  VARCHAR2(5 BYTE),
  Z10_DE_DESCRIPCION_ARCHIVO  VARCHAR2(200 BYTE),
  Z10_DE_DESCRIPCION_ESTADO   VARCHAR2(10 BYTE),
  Z01_CO_CODIGO_ENTIDAD       NUMBER(22)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z10_ARCHIVOS IS 'Permite definir que archivos vamos a leer para cargar. Por cada Hoja Excel a cargar, se debe definir un archivo, y luego a través de los Mapas, se definen las caracteristicas de los campos a cargar.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z10_CO_CODIGO_ARCHIVO IS 'Identifica el codigo del archivo. Asignado manualmente por el equipo de Mega Soft. Identifica en forma unica a cada archivo que se utilice en el proceso de carga. se recomienda darle de prefijo este numero al archivo fisico utilizado.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z10_NO_NOMBRE_ARCHIVO IS 'Nombre del Archivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z10_DE_DESCRIPCION_FORMATO IS 'Descripción del formato del archivo (XLS, TXT, CSV, etc.). Solo a manera de referencia';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z10_DE_DESCRIPCION_ARCHIVO IS 'Descripcion del archivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z10_DE_DESCRIPCION_ESTADO IS 'Descripcion del estado del archivo (identifica si se esta procesando o no).';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z10_ARCHIVOS.Z01_CO_CODIGO_ENTIDAD IS 'Codigo que identifica la Entidad a la que esta asociado el Archivo. FK sobre Z01. Se refiere a la entidad logica que se debe poblar con los datos leidos. Esta entidad es problada por los procesos e Transformación y Carga Final.';


--
-- INFI_TB_Z10_ARCHIVOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z10_ARCHIVOS FOR ADM_INFI.INFI_TB_Z10_ARCHIVOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z10_ARCHIVOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z10_ARCHIVOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z10_ARCHIVOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z10_ARCHIVOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z10_ARCHIVOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z10_ARCHIVOS ADD (
  PRIMARY KEY
 (Z10_CO_CODIGO_ARCHIVO)
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


