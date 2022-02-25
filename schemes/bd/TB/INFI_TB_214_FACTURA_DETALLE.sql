--
-- INFI_TB_214_FACTURA_DETALLE  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_214_FACTURA_DETALLE
(
  FACTURA_DETALLE_ID    NUMBER(10)              NOT NULL,
  FACTURA_ID            NUMBER(10)              NOT NULL,
  SERVICIO              VARCHAR2(45 BYTE)       NOT NULL,
  CANTIDAD              NUMBER(13,2)            NOT NULL,
  TASA_MONTO            NUMBER(9,6),
  MONTO_OPERACION       NUMBER(15,5)            NOT NULL,
  MONEDA_ID             VARCHAR2(3 BYTE)        NOT NULL,
  CANTIDAD_OPERACIONES  NUMBER(3)               DEFAULT 0
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

COMMENT ON TABLE ADM_INFI.INFI_TB_214_FACTURA_DETALLE IS 'Muestra el detalle de la factura';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.FACTURA_DETALLE_ID IS 'Id de detalle de la factura';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.FACTURA_ID IS 'Id de la factura';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.SERVICIO IS 'Descripción del servicio cobrado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.CANTIDAD IS 'Cantidad del servicio, puede ser aplicado a monto o cantidad de operaciones';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.TASA_MONTO IS 'Tasa o monto que debe aplicarse';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.MONTO_OPERACION IS 'Monto a cobrar por el servicio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_214_FACTURA_DETALLE.MONEDA_ID IS 'Id de la moneda relacionada al monto';

--
-- PK_214  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_214 ON ADM_INFI.INFI_TB_214_FACTURA_DETALLE
(FACTURA_DETALLE_ID)
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
-- INFI_TB_214_FACTURA_DETALLE  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_214_FACTURA_DETALLE FOR ADM_INFI.INFI_TB_214_FACTURA_DETALLE;

GRANT DELETE ON  ADM_INFI.INFI_TB_214_FACTURA_DETALLE TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_214_FACTURA_DETALLE TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_214_FACTURA_DETALLE TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_214_FACTURA_DETALLE TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_214_FACTURA_DETALLE 
-- 
ALTER TABLE ADM_INFI.INFI_TB_214_FACTURA_DETALLE ADD (
  CONSTRAINT PK_214
 PRIMARY KEY
 (FACTURA_DETALLE_ID)
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
-- Foreign Key Constraints for Table INFI_TB_214_FACTURA_DETALLE 
-- 
ALTER TABLE ADM_INFI.INFI_TB_214_FACTURA_DETALLE ADD (
  CONSTRAINT FK_214_213 
 FOREIGN KEY (FACTURA_ID) 
 REFERENCES ADM_INFI.INFI_TB_213_FACTURA (FACTURA_ID)
    ON DELETE CASCADE);


