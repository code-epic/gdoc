--
-- INFI_TB_099_SEQUENCE_NUMBERS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS
(
  TABLE_NAME  VARCHAR2(80 BYTE)                 NOT NULL,
  NEXT_ID     INTEGER                           NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS IS 'Tabla utilizada por el Sistema, para llevar control de campos de Tipo SEQUENCE por Tabla. En esta tabla se registran todos los campos SEQUENCE que utiliza la aplicación. El manejo de los incrementos se hace a través de una función estandar de Fundación.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS.TABLE_NAME IS 'Nombre de la Tabla que requiere que se lleve el SEQUENCE. Solo se permite un SEQUENCE por Tabla.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS.NEXT_ID IS 'Valor asignado actualizado para el SEQUENCE de la Tabla.';

--
-- INFI_PK_099_PK1  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.INFI_PK_099_PK1 ON ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS
(TABLE_NAME)
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
-- INFI_TB_099_SEQUENCE_NUMBERS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_099_SEQUENCE_NUMBERS FOR ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS;

GRANT DELETE ON  ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_099_SEQUENCE_NUMBERS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_099_SEQUENCE_NUMBERS ADD (
  CONSTRAINT INFI_PK_099_PK1
 PRIMARY KEY
 (TABLE_NAME)
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


