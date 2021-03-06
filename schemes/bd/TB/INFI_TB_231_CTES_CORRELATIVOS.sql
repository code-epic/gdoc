--
-- INFI_TB_231_CTES_CORRELATIVOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS
(
  CLIENT_ID              NUMBER(8)              NOT NULL,
  NUMERO_PERSONA         NUMBER(15)             NOT NULL,
  NUMERO_SECU_DOCUMENTO  NUMBER(4)              NOT NULL,
  CLIENT_NOMBRE          VARCHAR2(800 BYTE)     NOT NULL
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

COMMENT ON COLUMN ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS.CLIENT_ID IS 'Id del cliente de base de datos de INFI';

COMMENT ON COLUMN ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS.NUMERO_PERSONA IS 'Numero de persona en el bdv';

COMMENT ON COLUMN ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS.NUMERO_SECU_DOCUMENTO IS 'Numero de correlativo del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS.CLIENT_NOMBRE IS 'Nombre del cliente correlativo';

--
-- INFI_TB_231_CTES_CORRE_PK  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.INFI_TB_231_CTES_CORRE_PK ON ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS
(CLIENT_ID, NUMERO_PERSONA)
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
-- INFI_TB_231_CTES_CORRELATIVOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_231_CTES_CORRELATIVOS FOR ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_231_CTES_CORRELATIVOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS ADD (
  CONSTRAINT INFI_TB_231_CTES_CORRE_PK
 PRIMARY KEY
 (CLIENT_ID, NUMERO_PERSONA)
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
-- Foreign Key Constraints for Table INFI_TB_231_CTES_CORRELATIVOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_231_CTES_CORRELATIVOS ADD (
  CONSTRAINT INFI_TB_201_CLIENT_ID 
 FOREIGN KEY (CLIENT_ID) 
 REFERENCES ADM_INFI.INFI_TB_201_CTES (CLIENT_ID));


