--
-- INFI_TB_002_PARAM_TIPOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_002_PARAM_TIPOS
(
  PARTIP_NOMBRE_PARAMETRO  VARCHAR2(25 BYTE)    NOT NULL,
  PARTIP_DESCRIPCION       VARCHAR2(200 BYTE)   NOT NULL,
  PARGRP_ID                VARCHAR2(3 BYTE)     NOT NULL,
  PARTIP_VALOR_DEFECTO     VARCHAR2(200 BYTE),
  PARVAL_VALOR             VARCHAR2(200 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_002_PARAM_TIPOS IS 'Definicion de los Tipos de Parametros. Se identifican sus atributos y a que Grupo pertenecen. Tod parametro  
debe pertenecer a un Grupo. Puede tener lista de valores asociados, para aquellos 
parametros que solo se permite escojer un valor de dicha lista.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_002_PARAM_TIPOS.PARTIP_NOMBRE_PARAMETRO IS 'Identifica el Parámetro. Nombre con el cual es referenciado en los programas, procesos, etc dentro del Sistema.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_002_PARAM_TIPOS.PARTIP_DESCRIPCION IS 'Descripción de la finalidad del Parámetro y cualquier otra información de utilidad.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_002_PARAM_TIPOS.PARGRP_ID IS 'ID del Grupo al cual pertenece el Parámetro. Permite agrupar los parámetros logicamente en función de su utilidad y uso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_002_PARAM_TIPOS.PARTIP_VALOR_DEFECTO IS 'Campo que permite colocar un valor por defecto, para ser usado de referencia al momento de registrar el valor de un parametro.';

--
-- PK_002  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_002 ON ADM_INFI.INFI_TB_002_PARAM_TIPOS
(PARGRP_ID, PARTIP_NOMBRE_PARAMETRO)
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
-- INFI_TB_002_PARAM_TIPOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_002_PARAM_TIPOS FOR ADM_INFI.INFI_TB_002_PARAM_TIPOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_002_PARAM_TIPOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_002_PARAM_TIPOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_002_PARAM_TIPOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_002_PARAM_TIPOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_002_PARAM_TIPOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_002_PARAM_TIPOS ADD (
  CONSTRAINT PK_002
 PRIMARY KEY
 (PARGRP_ID, PARTIP_NOMBRE_PARAMETRO)
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
-- Foreign Key Constraints for Table INFI_TB_002_PARAM_TIPOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_002_PARAM_TIPOS ADD (
  CONSTRAINT FK_002_001 
 FOREIGN KEY (PARGRP_ID) 
 REFERENCES ADM_INFI.INFI_TB_001_PARAM_GRUPO (PARGRP_ID));


