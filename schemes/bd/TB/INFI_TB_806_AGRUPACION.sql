--
-- INFI_TB_806_AGRUPACION  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_806_AGRUPACION
(
  ID_AGRUPACION    NUMBER                       NOT NULL,
  NOM_AGRUPACION   VARCHAR2(20 BYTE)            NOT NULL,
  DESC_AGRUPACION  VARCHAR2(100 BYTE)           NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_806_AGRUPACION IS 'Se almacenan las distintas formas de agrupación del envio de los datos a OPICS. Dependiendo del Blotter se pueden agrupar por precio o solo el envio una a una de las ordenes';

COMMENT ON COLUMN ADM_INFI.INFI_TB_806_AGRUPACION.ID_AGRUPACION IS 'Id de la forma de agrupación';

COMMENT ON COLUMN ADM_INFI.INFI_TB_806_AGRUPACION.NOM_AGRUPACION IS 'Nombre de la forma de agrupación de los datos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_806_AGRUPACION.DESC_AGRUPACION IS 'Descripción de la forma de agrupación OPICS';

--
-- PK_806  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_806 ON ADM_INFI.INFI_TB_806_AGRUPACION
(ID_AGRUPACION)
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
-- INFI_TB_806_AGRUPACION  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_806_AGRUPACION FOR ADM_INFI.INFI_TB_806_AGRUPACION;

GRANT DELETE ON  ADM_INFI.INFI_TB_806_AGRUPACION TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_806_AGRUPACION TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_806_AGRUPACION TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_806_AGRUPACION TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_806_AGRUPACION 
-- 
ALTER TABLE ADM_INFI.INFI_TB_806_AGRUPACION ADD (
  CONSTRAINT PK_806
 PRIMARY KEY
 (ID_AGRUPACION)
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


