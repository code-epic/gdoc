--
-- INFI_TB_230_EVENTO_MAIL  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_230_EVENTO_MAIL
(
  EVENTO_ID         VARCHAR2(25 BYTE)           NOT NULL,
  EVENTO_NAME       VARCHAR2(50 BYTE),
  EVENTO_DESC       VARCHAR2(100 BYTE),
  TIPO_PRODUCTO_ID  VARCHAR2(10 BYTE)           NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_230_EVENTO_MAIL IS 'Tabla que contiene la informaci�n de los eventos (asociados a un producto) a notificar v�a correo electr�nico';

COMMENT ON COLUMN ADM_INFI.INFI_TB_230_EVENTO_MAIL.EVENTO_NAME IS 'Nombre del evento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_230_EVENTO_MAIL.EVENTO_DESC IS 'Descripci�n del evento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_230_EVENTO_MAIL.TIPO_PRODUCTO_ID IS 'Tipo de Producto al cual se encuentra relacionado el evento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_230_EVENTO_MAIL.EVENTO_ID IS 'Identificador del evento';

--
-- INFI_TB_230_EVENTO_MAIL_PK  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.INFI_TB_230_EVENTO_MAIL_PK ON ADM_INFI.INFI_TB_230_EVENTO_MAIL
(EVENTO_ID)
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
-- INFI_TB_230_EVENTO_MAIL  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_230_EVENTO_MAIL FOR ADM_INFI.INFI_TB_230_EVENTO_MAIL;

GRANT DELETE ON  ADM_INFI.INFI_TB_230_EVENTO_MAIL TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_230_EVENTO_MAIL TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_230_EVENTO_MAIL TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_230_EVENTO_MAIL TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_230_EVENTO_MAIL 
-- 
ALTER TABLE ADM_INFI.INFI_TB_230_EVENTO_MAIL ADD (
  CONSTRAINT PK_230
 PRIMARY KEY
 (EVENTO_ID));


-- 
-- Foreign Key Constraints for Table INFI_TB_230_EVENTO_MAIL 
-- 
ALTER TABLE ADM_INFI.INFI_TB_230_EVENTO_MAIL ADD (
  CONSTRAINT FK_230_019 
 FOREIGN KEY (TIPO_PRODUCTO_ID) 
 REFERENCES ADM_INFI.INFI_TB_019_TIPO_DE_PRODUCTO (TIPO_PRODUCTO_ID));


