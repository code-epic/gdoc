--
-- INFI_TB_210_ORDENES_REQUISITO  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_210_ORDENES_REQUISITO
(
  ORDENE_REQUISITO_ID   NUMBER(11)              NOT NULL,
  ORDENE_ID             NUMBER(10)              NOT NULL,
  FECHA_RECEPCION       DATE,
  RECEPCION_USUARIO_NM  VARCHAR2(25 BYTE),
  INDICA_ID             VARCHAR2(3 BYTE)
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

COMMENT ON COLUMN ADM_INFI.INFI_TB_210_ORDENES_REQUISITO.ORDENE_REQUISITO_ID IS 'Id �nico que identifica el registro';

COMMENT ON COLUMN ADM_INFI.INFI_TB_210_ORDENES_REQUISITO.ORDENE_ID IS 'N�mero de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_210_ORDENES_REQUISITO.FECHA_RECEPCION IS 'Fecha en que fu� recibido el requisito';

COMMENT ON COLUMN ADM_INFI.INFI_TB_210_ORDENES_REQUISITO.RECEPCION_USUARIO_NM IS 'Usuario que efectu� la recepci�n del documento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_210_ORDENES_REQUISITO.INDICA_ID IS 'Id del indicador';


--
-- INFI_TB_210_ORDENES_REQUISITO  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_210_ORDENES_REQUISITO FOR ADM_INFI.INFI_TB_210_ORDENES_REQUISITO;

GRANT DELETE ON  ADM_INFI.INFI_TB_210_ORDENES_REQUISITO TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_210_ORDENES_REQUISITO TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_210_ORDENES_REQUISITO TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_210_ORDENES_REQUISITO TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_210_ORDENES_REQUISITO 
-- 
ALTER TABLE ADM_INFI.INFI_TB_210_ORDENES_REQUISITO ADD (
  PRIMARY KEY
 (ORDENE_REQUISITO_ID)
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
-- Foreign Key Constraints for Table INFI_TB_210_ORDENES_REQUISITO 
-- 
ALTER TABLE ADM_INFI.INFI_TB_210_ORDENES_REQUISITO ADD (
  CONSTRAINT FK_210_011 
 FOREIGN KEY (INDICA_ID) 
 REFERENCES ADM_INFI.INFI_TB_011_INDICADORES (INDICA_ID));


