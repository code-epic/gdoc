--
-- INFI_TB_215_MENSAJE_OPICS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_215_MENSAJE_OPICS
(
  OPICS_ID      NUMBER(8)                       NOT NULL,
  IN_ENVIADO    NUMBER(1)                       DEFAULT 0                     NOT NULL,
  FECHA_CREADO  DATE                            NOT NULL,
  FECHA_ENVIO   DATE,
  USUARIO_ID    NUMBER(7)                       NOT NULL,
  EJECUCION_ID  NUMBER(8),
  FECHA_VALOR   DATE,
  ORDENE_ID     NUMBER(10)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_215_MENSAJE_OPICS IS 'Almacena los mensajes que deben ser enviados a opics';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.OPICS_ID IS 'Id del mensaje generado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.IN_ENVIADO IS 'Indica si el mensaje fue enviado o no a opics. 1=SI, 0=NO';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.FECHA_CREADO IS 'Fecha de creación del mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.FECHA_ENVIO IS 'Fecha en que fue enviado a opics el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.USUARIO_ID IS 'Id del usuario que generó el mensaje';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.EJECUCION_ID IS 'Id de ejecución cuando el mensaje es montado en el archivo opics';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.FECHA_VALOR IS 'Fecha en la que el proceso automático de opics debe tomar el mensaje y montarlo en el archivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_215_MENSAJE_OPICS.ORDENE_ID IS 'Numero de Orden INFI asociado al Mensaje Opics';

--
-- PK_215  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_215 ON ADM_INFI.INFI_TB_215_MENSAJE_OPICS
(OPICS_ID)
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
-- INFI_TB_215_MENSAJE_OPICS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_215_MENSAJE_OPICS FOR ADM_INFI.INFI_TB_215_MENSAJE_OPICS;

GRANT DELETE ON  ADM_INFI.INFI_TB_215_MENSAJE_OPICS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_215_MENSAJE_OPICS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_215_MENSAJE_OPICS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_215_MENSAJE_OPICS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_215_MENSAJE_OPICS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_215_MENSAJE_OPICS ADD (
  CONSTRAINT PK_215
 PRIMARY KEY
 (OPICS_ID)
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
-- Foreign Key Constraints for Table INFI_TB_215_MENSAJE_OPICS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_215_MENSAJE_OPICS ADD (
  CONSTRAINT FK_215_204 
 FOREIGN KEY (ORDENE_ID) 
 REFERENCES ADM_INFI.INFI_TB_204_ORDENES (ORDENE_ID));


