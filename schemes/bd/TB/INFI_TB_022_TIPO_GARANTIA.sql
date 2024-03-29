--
-- INFI_TB_022_TIPO_GARANTIA  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_022_TIPO_GARANTIA
(
  TIPGAR_ID           VARCHAR2(25 BYTE)         NOT NULL,
  TIPGAR_DESCRIPCION  VARCHAR2(200 BYTE)        NOT NULL,
  TIPGAR_STATUS       NUMBER(3)                 NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_022_TIPO_GARANTIA IS 'Tabla para el manejo de los tipos de garant�a cuando se efect�a un bloqueo de t�tulos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_022_TIPO_GARANTIA.TIPGAR_ID IS 'Id de tipo de garant�a';

COMMENT ON COLUMN ADM_INFI.INFI_TB_022_TIPO_GARANTIA.TIPGAR_DESCRIPCION IS 'Descripci�n del tipo de garant�a';

COMMENT ON COLUMN ADM_INFI.INFI_TB_022_TIPO_GARANTIA.TIPGAR_STATUS IS 'Status de el tipo de garant�a';

--
-- PK_022  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_022 ON ADM_INFI.INFI_TB_022_TIPO_GARANTIA
(TIPGAR_ID)
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
-- INFI_TB_022_TIPO_GARANTIA  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_022_TIPO_GARANTIA FOR ADM_INFI.INFI_TB_022_TIPO_GARANTIA;

GRANT DELETE ON  ADM_INFI.INFI_TB_022_TIPO_GARANTIA TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_022_TIPO_GARANTIA TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_022_TIPO_GARANTIA TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_022_TIPO_GARANTIA TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_022_TIPO_GARANTIA 
-- 
ALTER TABLE ADM_INFI.INFI_TB_022_TIPO_GARANTIA ADD (
  CONSTRAINT PK_022
 PRIMARY KEY
 (TIPGAR_ID)
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


