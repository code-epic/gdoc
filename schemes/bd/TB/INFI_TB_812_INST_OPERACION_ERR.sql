--
-- INFI_TB_812_INST_OPERACION_ERR  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_812_INST_OPERACION_ERR
(
  INSTRUCCION_ID  NUMBER(10)                    NOT NULL,
  FECHA_ERROR     DATE,
  DESC_ERROR      VARCHAR2(250 BYTE)
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
-- INFI_TB_812_INST_OPERACION_ERR  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_812_INST_OPERACION_ERR FOR ADM_INFI.INFI_TB_812_INST_OPERACION_ERR;

GRANT DELETE ON  ADM_INFI.INFI_TB_812_INST_OPERACION_ERR TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_812_INST_OPERACION_ERR TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_812_INST_OPERACION_ERR TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_812_INST_OPERACION_ERR TO USU_INFI;

