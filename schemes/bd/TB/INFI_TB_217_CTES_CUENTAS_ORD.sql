--
-- INFI_TB_217_CTES_CUENTAS_ORD  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD
(
  CTES_CUENTAS_ID  NUMBER(9)                    NOT NULL,
  ORDENE_ID        NUMBER(10)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD IS 'Contiene la orden relacionada a una instrucci�n de recompra';

COMMENT ON COLUMN ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD.CTES_CUENTAS_ID IS 'Id de relaci�n de instrucci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD.ORDENE_ID IS 'Id de la orden que contiene la instrucci�n';

--
-- PK_217  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_217 ON ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD
(CTES_CUENTAS_ID, ORDENE_ID)
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
-- INFI_TB_217_CTES_CUENTAS_ORD  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_217_CTES_CUENTAS_ORD FOR ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD;

GRANT DELETE ON  ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_217_CTES_CUENTAS_ORD 
-- 
ALTER TABLE ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD ADD (
  CONSTRAINT PK_217
 PRIMARY KEY
 (CTES_CUENTAS_ID, ORDENE_ID)
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
-- Foreign Key Constraints for Table INFI_TB_217_CTES_CUENTAS_ORD 
-- 
ALTER TABLE ADM_INFI.INFI_TB_217_CTES_CUENTAS_ORD ADD (
  CONSTRAINT FK_217_202 
 FOREIGN KEY (CTES_CUENTAS_ID) 
 REFERENCES ADM_INFI.INFI_TB_202_CTES_CUENTAS (CTES_CUENTAS_ID));

