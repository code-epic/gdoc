--
-- INFI_TB_117_UNDINV_STATUS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_117_UNDINV_STATUS
(
  UNDINV_STATUS              VARCHAR2(50 BYTE)  NOT NULL,
  UNDINV_STATUS_DESCRIPCION  VARCHAR2(50 BYTE)  NOT NULL,
  UNDINV_NIVEL               NUMBER
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

COMMENT ON TABLE ADM_INFI.INFI_TB_117_UNDINV_STATUS IS 'Status de la unidad de inversión. Algunos procesos pueden actualizar el status para evitar la toma de ordenes por una unidad determinada sin importar si el bloter tiene o no permisología para la toma de la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_117_UNDINV_STATUS.UNDINV_STATUS IS 'Status de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_117_UNDINV_STATUS.UNDINV_STATUS_DESCRIPCION IS 'Descripción de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_117_UNDINV_STATUS.UNDINV_NIVEL IS 'Campo que identifica el nivel desde el punto de vista de secuencia del status. Asignado manualmente por personal técnico. Recomendable utilizar rangos de 100 en 100.';

--
-- PK_117  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_117 ON ADM_INFI.INFI_TB_117_UNDINV_STATUS
(UNDINV_STATUS)
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
-- INFI_TB_117_UNDINV_STATUS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_117_UNDINV_STATUS FOR ADM_INFI.INFI_TB_117_UNDINV_STATUS;

GRANT DELETE ON  ADM_INFI.INFI_TB_117_UNDINV_STATUS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_117_UNDINV_STATUS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_117_UNDINV_STATUS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_117_UNDINV_STATUS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_117_UNDINV_STATUS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_117_UNDINV_STATUS ADD (
  CONSTRAINT PK_117
 PRIMARY KEY
 (UNDINV_STATUS)
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


