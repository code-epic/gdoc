--
-- INFI_TB_810_PROCESO_INST  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_810_PROCESO_INST
(
  PROCESO_ID      NUMBER(8)                     NOT NULL,
  CLIENT_ID       NUMBER(8)                     NOT NULL,
  FECHA_REGISTRO  DATE                          NOT NULL,
  USUARIO_ID      NUMBER(22)                    NOT NULL
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
-- INFI_TB_810_PROCESO_INST  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_810_PROCESO_INST FOR ADM_INFI.INFI_TB_810_PROCESO_INST;

GRANT DELETE ON  ADM_INFI.INFI_TB_810_PROCESO_INST TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_810_PROCESO_INST TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_810_PROCESO_INST TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_810_PROCESO_INST TO USU_INFI;

