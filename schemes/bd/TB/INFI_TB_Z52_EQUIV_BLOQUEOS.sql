--
-- INFI_TB_Z52_EQUIV_BLOQUEOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS
(
  TIPO_BLOQUEO_INFI      VARCHAR2(50 BYTE),
  TIPO_BLOQUEO_ARCHIVOS  VARCHAR2(50 BYTE)
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

--
-- INFI_TB_Z52_EQUIV_BLOQUEOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z52_EQUIV_BLOQUEOS FOR ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS TO USU_INFI;

-- 
-- Foreign Key Constraints for Table INFI_TB_Z52_EQUIV_BLOQUEOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z52_EQUIV_BLOQUEOS ADD (
  CONSTRAINT Z52_700 
 FOREIGN KEY (TIPO_BLOQUEO_INFI) 
 REFERENCES ADM_INFI.INFI_TB_700_TIPO_BLOQUEO (TIPBLO_ID));

