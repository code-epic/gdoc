--
-- INFI_TB_005_FORMATOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_005_FORMATOS
(
  FORMAT_ID           VARCHAR2(15 BYTE)         NOT NULL,
  FORMAT_DESCRIPCION  VARCHAR2(200 BYTE)        NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_005_FORMATOS IS 'Permite definir los tipos de formatos validos, para ser usados en los procesos  
internos del Sistema. Usado principalmente en procedo de Carga Inicial de  
Datos y en el mantenimiento de parametros.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_005_FORMATOS.FORMAT_ID IS 'Id de formato';

COMMENT ON COLUMN ADM_INFI.INFI_TB_005_FORMATOS.FORMAT_DESCRIPCION IS 'Descripción del formato';

--
-- PK_005  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_005 ON ADM_INFI.INFI_TB_005_FORMATOS
(FORMAT_ID)
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
-- INFI_TB_005_FORMATOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_005_FORMATOS FOR ADM_INFI.INFI_TB_005_FORMATOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_005_FORMATOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_005_FORMATOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_005_FORMATOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_005_FORMATOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_005_FORMATOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_005_FORMATOS ADD (
  CONSTRAINT PK_005
 PRIMARY KEY
 (FORMAT_ID)
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


