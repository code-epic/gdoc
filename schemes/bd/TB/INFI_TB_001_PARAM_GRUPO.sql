--
-- INFI_TB_001_PARAM_GRUPO  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_001_PARAM_GRUPO
(
  PARGRP_ID           VARCHAR2(3 BYTE)          NOT NULL,
  PARGRP_NOMBRE       VARCHAR2(25 BYTE)         NOT NULL,
  PARGRP_DESCRIPCION  VARCHAR2(200 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_001_PARAM_GRUPO IS 'Definición de los Grupos de Parametros. Permite restringir a nivel de Rol de usuario de Seguridad quienes  
pueden modificar los valores. Permite agrupar los parametros que esten relacionados a un 
modulo o funcion particular.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_001_PARAM_GRUPO.PARGRP_ID IS 'ID del Grupo. Clave Primaria. No se puede duplicar.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_001_PARAM_GRUPO.PARGRP_NOMBRE IS 'Nombre con que se identifica el Grupo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_001_PARAM_GRUPO.PARGRP_DESCRIPCION IS 'Descripción de la finalidad del Grupo y que parametros asocia.';


--
-- INFI_TB_001_PARAM_GRUPO  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_001_PARAM_GRUPO FOR ADM_INFI.INFI_TB_001_PARAM_GRUPO;

GRANT DELETE ON  ADM_INFI.INFI_TB_001_PARAM_GRUPO TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_001_PARAM_GRUPO TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_001_PARAM_GRUPO TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_001_PARAM_GRUPO TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_001_PARAM_GRUPO 
-- 
ALTER TABLE ADM_INFI.INFI_TB_001_PARAM_GRUPO ADD (
  PRIMARY KEY
 (PARGRP_ID)
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


