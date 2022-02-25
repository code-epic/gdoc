--
-- INFI_TB_904_CANAL_PRUEBA  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_904_CANAL_PRUEBA
(
  CODIGO_CANAL  VARCHAR2(4 BYTE)                NOT NULL,
  NOMBRE_CANAL  VARCHAR2(25 BYTE)               NOT NULL,
  ACTIVO        NUMBER(1)                       NOT NULL,
  CANAL_ID      NUMBER(8)                       NOT NULL
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

