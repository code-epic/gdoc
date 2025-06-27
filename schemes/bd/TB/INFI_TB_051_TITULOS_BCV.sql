--
-- INFI_TB_051_TITULOS_BCV  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_051_TITULOS_BCV
(
  TITULO_ID      VARCHAR2(25 BYTE)              NOT NULL,
  TITULO_ID_BCV  VARCHAR2(25 BYTE)              NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_051_TITULOS_BCV IS 'Equivalencia de títulos usados para el envío del archivo BCV';

COMMENT ON COLUMN ADM_INFI.INFI_TB_051_TITULOS_BCV.TITULO_ID IS 'Id del título registrado en OPICS';

COMMENT ON COLUMN ADM_INFI.INFI_TB_051_TITULOS_BCV.TITULO_ID_BCV IS 'Valor como es esperado en el archivo BCV';

--
-- PK_051  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_051 ON ADM_INFI.INFI_TB_051_TITULOS_BCV
(TITULO_ID)
LOGGING
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
NOPARALLEL;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_051_TITULOS_BCV 
-- 
ALTER TABLE ADM_INFI.INFI_TB_051_TITULOS_BCV ADD (
  CONSTRAINT PK_051
 PRIMARY KEY
 (TITULO_ID)
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


