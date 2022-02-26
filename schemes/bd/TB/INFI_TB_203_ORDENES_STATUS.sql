--
-- INFI_TB_203_ORDENES_STATUS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_203_ORDENES_STATUS
(
  ORDSTA_ID           VARCHAR2(25 BYTE)         NOT NULL,
  ORDSTA_NOMBRE       VARCHAR2(40 BYTE)         NOT NULL,
  ORDSTAT_SECUENCIA   NUMBER                    NOT NULL,
  ORDSTA_DESCRIPCION  VARCHAR2(100 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_203_ORDENES_STATUS IS 'Define los diferentes status que puede tomar una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_203_ORDENES_STATUS.ORDSTA_ID IS 'Id del status de la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_203_ORDENES_STATUS.ORDSTA_NOMBRE IS 'Nombre del status';

COMMENT ON COLUMN ADM_INFI.INFI_TB_203_ORDENES_STATUS.ORDSTAT_SECUENCIA IS 'Secuencia usada como referencia para determinar el orden en el que deber�an marcarse las ordenes';

COMMENT ON COLUMN ADM_INFI.INFI_TB_203_ORDENES_STATUS.ORDSTA_DESCRIPCION IS 'Descripci�n del status';

--
-- PK_203  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_203 ON ADM_INFI.INFI_TB_203_ORDENES_STATUS
(ORDSTA_ID)
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
-- INFI_TB_203_ORDENES_STATUS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_203_ORDENES_STATUS FOR ADM_INFI.INFI_TB_203_ORDENES_STATUS;

GRANT DELETE ON  ADM_INFI.INFI_TB_203_ORDENES_STATUS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_203_ORDENES_STATUS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_203_ORDENES_STATUS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_203_ORDENES_STATUS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_203_ORDENES_STATUS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_203_ORDENES_STATUS ADD (
  CONSTRAINT PK_203
 PRIMARY KEY
 (ORDSTA_ID)
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

