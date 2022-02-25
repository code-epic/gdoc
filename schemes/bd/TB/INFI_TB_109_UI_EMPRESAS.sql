--
-- INFI_TB_109_UI_EMPRESAS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS
(
  UNDINV_ID            NUMBER(7)                NOT NULL,
  EMPRES_ID            VARCHAR2(25 BYTE)        NOT NULL,
  ROLES_ID             VARCHAR2(15 BYTE),
  UIEMPR_CONTACTO_NOM  VARCHAR2(50 BYTE),
  UIEMPR_CONTACTO_TLF  VARCHAR2(25 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS IS 'Define las EMPRESAS ASOCIADOS A LA UI. 
Toda UI debe tener por lo menos una EMPRESA asociada. 
La EMPRESA debe estar previamente definida 
cada Empresa puede jugar mas de un Rol (Colocador, negociador, etc). en la UI 
Los datos relacionados a la Empresa, no estan relacionados con ALTAIR, son datos 
propios definidos en INFI 
Esta relacion e Informacion es solo de referencia para el personal de Tesoreria';

COMMENT ON COLUMN ADM_INFI.INFI_TB_109_UI_EMPRESAS.UNDINV_ID IS 'ID de la Unidad de Inversión. FK con TB106.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_109_UI_EMPRESAS.EMPRES_ID IS 'ID de la Empresa. FK con TB016.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_109_UI_EMPRESAS.ROLES_ID IS 'ID del Rol. FK con TB016. Una empresa puede tener varios roles asignados en una Unidad de Inversión. La definición de cual empresa es el EMISOR de la Unidad de Inversión esta reflejada con el campo EMPRES_ID  a nivel de la TB106. Esta información de las empresas y roles asociados a la Unidad de Inversión es solo de referencia. Solo es informativa, no es utilizada por ningún proceso del Sistema.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_109_UI_EMPRESAS.UIEMPR_CONTACTO_NOM IS 'Nombre de Persona Contacto para los efectos de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_109_UI_EMPRESAS.UIEMPR_CONTACTO_TLF IS 'Télefono de Persona Contacto para los efectos de la Unidad de Inversión.';

--
-- PK_109  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_109 ON ADM_INFI.INFI_TB_109_UI_EMPRESAS
(UNDINV_ID, EMPRES_ID)
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
-- INFI_TB_109_UI_EMPRESAS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_109_UI_EMPRESAS FOR ADM_INFI.INFI_TB_109_UI_EMPRESAS;

GRANT DELETE ON  ADM_INFI.INFI_TB_109_UI_EMPRESAS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_109_UI_EMPRESAS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_109_UI_EMPRESAS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_109_UI_EMPRESAS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_109_UI_EMPRESAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS ADD (
  CONSTRAINT PK_109
 PRIMARY KEY
 (UNDINV_ID, EMPRES_ID)
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
-- Foreign Key Constraints for Table INFI_TB_109_UI_EMPRESAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS ADD (
  CONSTRAINT FK_109_016 
 FOREIGN KEY (EMPRES_ID) 
 REFERENCES ADM_INFI.INFI_TB_016_EMPRESAS (EMPRES_ID));

ALTER TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS ADD (
  CONSTRAINT FK_109_017 
 FOREIGN KEY (ROLES_ID) 
 REFERENCES ADM_INFI.INFI_TB_017_ROLES (ROLES_ID));

ALTER TABLE ADM_INFI.INFI_TB_109_UI_EMPRESAS ADD (
  CONSTRAINT FK_109_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID)
    ON DELETE CASCADE);


