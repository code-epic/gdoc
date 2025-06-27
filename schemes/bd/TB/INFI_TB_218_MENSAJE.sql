--
-- INFI_TB_218_MENSAJE  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_218_MENSAJE
(
  MENSAJE_ID    NUMBER(8)                       NOT NULL,
  FECHA_CREADO  DATE                            NOT NULL,
  FECHA_ENVIO   DATE,
  FECHA_VALOR   DATE                            NOT NULL,
  USUARIO_NM    VARCHAR2(25 BYTE)               NOT NULL,
  EJECUCION_ID  NUMBER(8),
  ORDENE_ID     NUMBER(10),
  TIPO_MENSAJE  VARCHAR2(20 BYTE)               NOT NULL,
  OBSERVACION   VARCHAR2(500 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_218_MENSAJE IS 'Almacena los mensajes que deben ser enviados a las distintas interfaces';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.MENSAJE_ID IS 'Id del mensaje generado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.FECHA_CREADO IS 'Fecha de creación del mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.FECHA_ENVIO IS 'Fecha en que fue enviado el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.FECHA_VALOR IS 'Fecha de cuando debe enviarse el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.USUARIO_NM IS 'nm del usuario que generó el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.EJECUCION_ID IS 'Id que corresponde al proceso de ejecución';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.ORDENE_ID IS 'Id de la orden al cuál está relacionado el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.TIPO_MENSAJE IS 'Tipo de Mensaje. Este puede ser:CARMEN,ESTADISTCA,BCV,etc';

COMMENT ON COLUMN ADM_INFI.INFI_TB_218_MENSAJE.OBSERVACION IS 'Mensaje de error en el proceso de ejecucion';

--
-- PK_218  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_218 ON ADM_INFI.INFI_TB_218_MENSAJE
(MENSAJE_ID)
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
-- INFI_TB_218_MENSAJE  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_218_MENSAJE FOR ADM_INFI.INFI_TB_218_MENSAJE;

GRANT DELETE ON  ADM_INFI.INFI_TB_218_MENSAJE TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_218_MENSAJE TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_218_MENSAJE TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_218_MENSAJE TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_218_MENSAJE 
-- 
ALTER TABLE ADM_INFI.INFI_TB_218_MENSAJE ADD (
  CONSTRAINT PK_218
 PRIMARY KEY
 (MENSAJE_ID)
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


