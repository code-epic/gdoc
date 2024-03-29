--
-- INFI_TB_039_BENEFICIARIOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_039_BENEFICIARIOS
(
  BENEFICIARIO_ID      NUMBER(3)                NOT NULL,
  BENEFICIARIO_NOMBRE  VARCHAR2(50 BYTE)        NOT NULL,
  BENEFICIARIO_DESC    VARCHAR2(200 BYTE)       NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_039_BENEFICIARIOS IS 'Tabla para el registro de beneficiarios usados en el bloqueo de t�tulos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_039_BENEFICIARIOS.BENEFICIARIO_ID IS 'Id del beneficiario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_039_BENEFICIARIOS.BENEFICIARIO_NOMBRE IS 'Nombre del beneficiario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_039_BENEFICIARIOS.BENEFICIARIO_DESC IS 'Descripci�n del beneficiario. ';

--
-- PK_039  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_039 ON ADM_INFI.INFI_TB_039_BENEFICIARIOS
(BENEFICIARIO_ID)
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
-- INFI_TB_039_BENEFICIARIOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_039_BENEFICIARIOS FOR ADM_INFI.INFI_TB_039_BENEFICIARIOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_039_BENEFICIARIOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_039_BENEFICIARIOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_039_BENEFICIARIOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_039_BENEFICIARIOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_039_BENEFICIARIOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_039_BENEFICIARIOS ADD (
  CONSTRAINT PK_039
 PRIMARY KEY
 (BENEFICIARIO_ID)
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


