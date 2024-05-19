--
-- INFI_TB_910_FILTRO_CTES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_910_FILTRO_CTES
(
  CLIENT_ID         NUMBER(22,8),
  TIPO_PRODUCTO_ID  VARCHAR2(10 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_910_FILTRO_CTES IS 'Tabla registra los clientes a excluir en la ADJUDICACIÓN/CRUCE  de solicitudes en INFI. Guarda solo la información actual';

COMMENT ON COLUMN ADM_INFI.INFI_TB_910_FILTRO_CTES.CLIENT_ID IS 'Id de cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_910_FILTRO_CTES.TIPO_PRODUCTO_ID IS 'Tipo de producto asociado a la carga de registros';

--
-- INFI_TB_910_FILTRO_CTES_PK  (Index) 
--
CREATE INDEX ADM_INFI.INFI_TB_910_FILTRO_CTES_PK ON ADM_INFI.INFI_TB_910_FILTRO_CTES
(CLIENT_ID, TIPO_PRODUCTO_ID)
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
-- INFI_TB_910_FILTRO_CTES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_910_FILTRO_CTES FOR ADM_INFI.INFI_TB_910_FILTRO_CTES;

GRANT DELETE ON  ADM_INFI.INFI_TB_910_FILTRO_CTES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_910_FILTRO_CTES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_910_FILTRO_CTES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_910_FILTRO_CTES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_910_FILTRO_CTES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_910_FILTRO_CTES ADD (
  CONSTRAINT PK_910
 PRIMARY KEY
 (TIPO_PRODUCTO_ID, CLIENT_ID));


-- 
-- Foreign Key Constraints for Table INFI_TB_910_FILTRO_CTES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_910_FILTRO_CTES ADD (
  CONSTRAINT FK_910_201 
 FOREIGN KEY (CLIENT_ID) 
 REFERENCES ADM_INFI.INFI_TB_201_CTES (CLIENT_ID));

ALTER TABLE ADM_INFI.INFI_TB_910_FILTRO_CTES ADD (
  CONSTRAINT FK_910_019 
 FOREIGN KEY (TIPO_PRODUCTO_ID) 
 REFERENCES ADM_INFI.INFI_TB_019_TIPO_DE_PRODUCTO (TIPO_PRODUCTO_ID));


