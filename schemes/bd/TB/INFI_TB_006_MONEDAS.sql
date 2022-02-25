--
-- INFI_TB_006_MONEDAS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_006_MONEDAS
(
  MONEDA_ID           VARCHAR2(3 BYTE),
  MONEDA_DESCRIPCION  VARCHAR2(200 BYTE),
  MONEDA_STATUS       NUMBER(1),
  MONEDA_IN_LOCAL     NUMBER(1)                 DEFAULT 0,
  MONEDA_IN_EXCHANGE  NUMBER(1)                 DEFAULT 0,
  MONEDA_SIGLAS       VARCHAR2(3 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_006_MONEDAS IS 'Indicador de que es la Moneda Local del Sistema. Deberia ser Bolivar. Solo una Moneda de todas las definidas lo debe poseer.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_006_MONEDAS.MONEDA_ID IS 'Id de la moneda';

COMMENT ON COLUMN ADM_INFI.INFI_TB_006_MONEDAS.MONEDA_DESCRIPCION IS 'Descripción';

COMMENT ON COLUMN ADM_INFI.INFI_TB_006_MONEDAS.MONEDA_STATUS IS 'Status 1 (Activo) 0 (Inactivo)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_006_MONEDAS.MONEDA_IN_LOCAL IS 'Indicador de que es la Moneda Local del Sistema. Deberia ser Bolivar. Solo una Moneda de todas las definidas lo debe poseer.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_006_MONEDAS.MONEDA_IN_EXCHANGE IS 'Indicador de que es la Moneda para Conversión entre Moneda Extranjera y Moneda Local. Usualmente es el Dolar Americano (USD). Solo lo puede tener encendido una Moneda';

--
-- PK_006  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_006 ON ADM_INFI.INFI_TB_006_MONEDAS
(MONEDA_ID)
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
-- INFI_TB_006_MONEDAS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_006_MONEDAS FOR ADM_INFI.INFI_TB_006_MONEDAS;

GRANT DELETE ON  ADM_INFI.INFI_TB_006_MONEDAS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_006_MONEDAS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_006_MONEDAS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_006_MONEDAS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_006_MONEDAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_006_MONEDAS ADD (
  CHECK ("MONEDA_STATUS" IS NOT NULL));

ALTER TABLE ADM_INFI.INFI_TB_006_MONEDAS ADD (
  CHECK ("MONEDA_ID" IS NOT NULL));

ALTER TABLE ADM_INFI.INFI_TB_006_MONEDAS ADD (
  CHECK ("MONEDA_ID" IS NOT NULL));

ALTER TABLE ADM_INFI.INFI_TB_006_MONEDAS ADD (
  CONSTRAINT PK_006
 PRIMARY KEY
 (MONEDA_ID)
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


