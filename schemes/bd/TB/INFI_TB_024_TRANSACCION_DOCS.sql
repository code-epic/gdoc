--
-- INFI_TB_024_TRANSACCION_DOCS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS
(
  TRANSA_ID              VARCHAR2(25 BYTE),
  DOCUMENTO_ID           NUMBER                 NOT NULL,
  TIPPER_ID              VARCHAR2(1 BYTE),
  STATUS_DOCUMENTO       CHAR(1 BYTE)           NOT NULL,
  CRE_USUARIO_USERID     VARCHAR2(10 BYTE)      NOT NULL,
  CRE_FECHA              DATE                   NOT NULL,
  APRO_USUARIO_USERID    VARCHAR2(10 BYTE),
  APRO_FECHA             DATE,
  DOCUMENTO              BLOB                   NOT NULL,
  NOMBRE_DOC             VARCHAR2(100 BYTE),
  UNDINV_ID              NUMBER(7),
  DOCUMENTO_DESCRIPCION  VARCHAR2(500 BYTE)
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
LOB (DOCUMENTO) STORE AS 
      ( TABLESPACE  DATA 
        ENABLE      STORAGE IN ROW
        CHUNK       8192
        PCTVERSION  10
        NOCACHE
        STORAGE    (
                    INITIAL          64K
                    NEXT             1M
                    MINEXTENTS       1
                    MAXEXTENTS       2147483645
                    PCTINCREASE      0
                    BUFFER_POOL      DEFAULT
                   )
      )
NOCACHE
NOPARALLEL
MONITORING;

COMMENT ON TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS IS 'Contiene los documentos que est�n asociados a una determinada transacci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.TRANSA_ID IS 'Id de la transacci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.DOCUMENTO_ID IS 'Id del documento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.TIPPER_ID IS 'Tipo de persona ';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.STATUS_DOCUMENTO IS 'Status en el que se encuentra un documento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.CRE_USUARIO_USERID IS 'C�digo del usuario que crea el documento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.CRE_FECHA IS 'Fecha de creaci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.APRO_USUARIO_USERID IS 'C�digo del usuario que aprueba el documento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_024_TRANSACCION_DOCS.APRO_FECHA IS 'Fecha de aprobaci�n del documento';

--
-- PK_024  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_024 ON ADM_INFI.INFI_TB_024_TRANSACCION_DOCS
(TRANSA_ID, DOCUMENTO_ID, TIPPER_ID)
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
-- INFI_TB_024_TRANSACCION_DOCS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_024_TRANSACCION_DOCS FOR ADM_INFI.INFI_TB_024_TRANSACCION_DOCS;

GRANT DELETE ON  ADM_INFI.INFI_TB_024_TRANSACCION_DOCS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_024_TRANSACCION_DOCS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_024_TRANSACCION_DOCS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_024_TRANSACCION_DOCS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_024_TRANSACCION_DOCS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS ADD (
  CONSTRAINT PK_024
 PRIMARY KEY
 (TRANSA_ID, DOCUMENTO_ID, TIPPER_ID)
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
-- Foreign Key Constraints for Table INFI_TB_024_TRANSACCION_DOCS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS ADD (
  CONSTRAINT FK_024_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID) DISABLE);

ALTER TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS ADD (
  CONSTRAINT FK_024_025 
 FOREIGN KEY (STATUS_DOCUMENTO) 
 REFERENCES ADM_INFI.INFI_TB_025_DOCUMENTOS_STATUS (STATUS_DOCUMENTO));

ALTER TABLE ADM_INFI.INFI_TB_024_TRANSACCION_DOCS ADD (
  CONSTRAINT FK_024_200 
 FOREIGN KEY (TIPPER_ID) 
 REFERENCES ADM_INFI.INFI_TB_200_TIPO_PERSONAS (TIPPER_ID));


