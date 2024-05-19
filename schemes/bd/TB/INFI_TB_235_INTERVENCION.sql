--
-- INFI_TB_235_INTERVENCION  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_235_INTERVENCION
(
  COD_CLIENT          VARCHAR2(12 BYTE),
  NOMBRE_CLIENT       VARCHAR2(20 BYTE),
  FECHA_VALOR         VARCHAR2(10 BYTE),
  TIPO_OPERACION      VARCHAR2(5 BYTE),
  MTO_DIVISAS         NUMBER(13,2),
  TASA_CAMBIO         FLOAT(126),
  COD_CUENTA_DIVISAS  VARCHAR2(25 BYTE),
  COD_CUENTA_BS       VARCHAR2(25 BYTE),
  COD_MONEDA_ISO      VARCHAR2(5 BYTE),
  COD_BCV             VARCHAR2(20 BYTE),
  STATUS_ENVIO        VARCHAR2(11 BYTE),
  ID_OPER             VARCHAR2(12 BYTE),
  COD_BANCO           VARCHAR2(6 BYTE),
  COMISION1           NUMBER(13,2),
  COMISION2           NUMBER(13,2),
  COMISION3           NUMBER(13,2),
  MTO_TOTAL_BS        NUMBER(13,2),
  MTO_BOLIVARES       NUMBER(13,2),
  STATUS_COBRO        VARCHAR2(50 BYTE),
  DESCRIPCION_COBRO   VARCHAR2(50 BYTE),
  OPERACION           VARCHAR2(4 BYTE)
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
-- INFI_TB_235_INDEXCOMPUESTO  (Index) 
--
CREATE INDEX ADM_INFI.INFI_TB_235_INDEXCOMPUESTO ON ADM_INFI.INFI_TB_235_INTERVENCION
(STATUS_ENVIO, FECHA_VALOR, TIPO_OPERACION)
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
-- INFI_TB_235_INTERVENCION  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_235_INTERVENCION FOR ADM_INFI.INFI_TB_235_INTERVENCION;

GRANT DELETE ON  ADM_INFI.INFI_TB_235_INTERVENCION TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_235_INTERVENCION TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_235_INTERVENCION TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_235_INTERVENCION TO USU_INFI;

