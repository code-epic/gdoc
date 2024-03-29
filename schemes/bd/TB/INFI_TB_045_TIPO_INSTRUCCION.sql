--
-- INFI_TB_045_TIPO_INSTRUCCION  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION
(
  TIPO_INSTRUCCION_ID  NUMBER(1),
  INSTRUCCION_NOMBRE   VARCHAR2(20 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION IS 'Contiene los tipos de instrucciones que puede seleccionar un cliente al asociar c�mo desea le sean pagados los cupones, amortizaciones y c�mo desea pagar las comisiones';

COMMENT ON COLUMN ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION.TIPO_INSTRUCCION_ID IS 'Id del tipo de Instruccion';

COMMENT ON COLUMN ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION.INSTRUCCION_NOMBRE IS 'Nombre del tipo de intruccion';

--
-- PK_045  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_045 ON ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION
(TIPO_INSTRUCCION_ID)
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
-- INFI_TB_045_TIPO_INSTRUCCION  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_045_TIPO_INSTRUCCION FOR ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION;

GRANT DELETE ON  ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_045_TIPO_INSTRUCCION 
-- 
ALTER TABLE ADM_INFI.INFI_TB_045_TIPO_INSTRUCCION ADD (
  CONSTRAINT PK_045
 PRIMARY KEY
 (TIPO_INSTRUCCION_ID)
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


