--
-- INFI_TB_814_CALC_MES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_814_CALC_MES
(
  CALCULO_MES_ID  NUMBER(7)                     NOT NULL,
  USUARIO_ID      NUMBER(7)                     NOT NULL,
  FECHA_DESDE     DATE                          NOT NULL,
  FECHA_HASTA     DATE                          NOT NULL,
  TRANSA_ID       VARCHAR2(25 BYTE)             NOT NULL,
  FECHA_CONSULTA  DATE
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

COMMENT ON TABLE ADM_INFI.INFI_TB_814_CALC_MES IS 'Tabla para almacenar temporalmente los cálculos referenres a un cliente para el cobro de comisiones o el pago de cupones o amortizaciones';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.CALCULO_MES_ID IS 'Id del calculo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.USUARIO_ID IS 'Id del usuario que efectúa la operación';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.FECHA_DESDE IS 'Fecha desde para la consulta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.FECHA_HASTA IS 'Fecha hasta para la consulta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.TRANSA_ID IS 'Id de la transacción de negocio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_814_CALC_MES.FECHA_CONSULTA IS 'Representa la fecha en que se creo el registro';

--
-- PK_814  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_814 ON ADM_INFI.INFI_TB_814_CALC_MES
(CALCULO_MES_ID)
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
-- INFI_TB_814_CALC_MES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_814_CALC_MES FOR ADM_INFI.INFI_TB_814_CALC_MES;

GRANT DELETE ON  ADM_INFI.INFI_TB_814_CALC_MES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_814_CALC_MES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_814_CALC_MES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_814_CALC_MES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_814_CALC_MES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_814_CALC_MES ADD (
  CONSTRAINT PK_814
 PRIMARY KEY
 (CALCULO_MES_ID)
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
-- Foreign Key Constraints for Table INFI_TB_814_CALC_MES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_814_CALC_MES ADD (
  CONSTRAINT FK_814_012 
 FOREIGN KEY (TRANSA_ID) 
 REFERENCES ADM_INFI.INFI_TB_012_TRANSACCIONES (TRANSA_ID));


