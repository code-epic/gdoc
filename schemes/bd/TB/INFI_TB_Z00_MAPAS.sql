--
-- INFI_TB_Z00_MAPAS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z00_MAPAS
(
  Z00_COD_MAPA           NUMBER(22)             NOT NULL,
  Z00_NOM_MAPA           VARCHAR2(200 BYTE),
  Z00_DES_MAPA           VARCHAR2(200 BYTE),
  Z00_NUM_CAMPOS         NUMBER(22)             NOT NULL,
  Z00_NUM_FILAS          NUMBER(22),
  Z10_CO_CODIGO_ARCHIVO  NUMBER(22)             NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z00_MAPAS IS 'Tabla que almacena los diferentes Mapas Logicos usados para Carga Inicial. Cada Archivo puede tener 1 o mas Mapas logicos para procesar su carga. El Mapa se usa para identificar como se procesan los campos por el proceso que lee las hojas excel y la carga en las tablas temporales. Cada Mapa tiene asociados diferentes campos en Z02 para dar los criterios de cada campo dentro del proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z00_COD_MAPA IS 'Codigo que identifica el Mapa al momento de cargar los datos del Archivo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z00_NOM_MAPA IS 'Nombre Logico dado al Mapa. Se recomiendo utilizar ARCHIVONNMM, donde NN es el numero de archivo y MM es una secuencia para cada uno de los Mapas.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z00_DES_MAPA IS 'Descripción del Mapa';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z00_NUM_CAMPOS IS 'Indicador de numero de campos que utilizará el Mapa al momento de la carga de los archivos en las tablas temporales';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z00_NUM_FILAS IS 'Indicador de numero de filas de los archivos a procesar en la carga.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z00_MAPAS.Z10_CO_CODIGO_ARCHIVO IS 'ID del archivo al cual corresponde el Mapa. Es el ID de la tabla Z10.';


--
-- INFI_TB_Z00_MAPAS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z00_MAPAS FOR ADM_INFI.INFI_TB_Z00_MAPAS;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z00_MAPAS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z00_MAPAS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z00_MAPAS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z00_MAPAS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z00_MAPAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z00_MAPAS ADD (
  PRIMARY KEY
 (Z00_COD_MAPA)
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
-- Foreign Key Constraints for Table INFI_TB_Z00_MAPAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z00_MAPAS ADD (
  FOREIGN KEY (Z10_CO_CODIGO_ARCHIVO) 
 REFERENCES ADM_INFI.INFI_TB_Z10_ARCHIVOS (Z10_CO_CODIGO_ARCHIVO));


