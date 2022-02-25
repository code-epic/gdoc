--
-- INFI_TB_105_BLOTER_OFICINAS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_105_BLOTER_OFICINAS
(
  BLOTER_ID         VARCHAR2(25 BYTE)           NOT NULL,
  BLOOFC_ID         VARCHAR2(25 BYTE)           NOT NULL,
  BLOOFC_IN_ACCESO  NUMBER(1)                   NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_105_BLOTER_OFICINAS IS 'Permite establecer si una oficina puede o no puede tomar ordenes por el Blotter. Si la oficina no esta en esta relacion, 
se asume que NO puede tomar ordenes por el Blotter. Se toma el codigo de la oficina para validar, la informacion 
devuelta por RACF a traves de la transaccion QG30 de AEA.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_105_BLOTER_OFICINAS.BLOTER_ID IS 'Id de bloter';

COMMENT ON COLUMN ADM_INFI.INFI_TB_105_BLOTER_OFICINAS.BLOOFC_ID IS 'Id de oficina';

COMMENT ON COLUMN ADM_INFI.INFI_TB_105_BLOTER_OFICINAS.BLOOFC_IN_ACCESO IS 'Indica si permite acceso. 1=si, 0=no';

--
-- PK_105  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_105 ON ADM_INFI.INFI_TB_105_BLOTER_OFICINAS
(BLOOFC_ID)
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
-- INFI_TB_105_BLOTER_OFICINAS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_105_BLOTER_OFICINAS FOR ADM_INFI.INFI_TB_105_BLOTER_OFICINAS;

GRANT DELETE ON  ADM_INFI.INFI_TB_105_BLOTER_OFICINAS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_105_BLOTER_OFICINAS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_105_BLOTER_OFICINAS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_105_BLOTER_OFICINAS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_105_BLOTER_OFICINAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_105_BLOTER_OFICINAS ADD (
  CONSTRAINT PK_105
 PRIMARY KEY
 (BLOOFC_ID)
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


