--
-- INFI_TB_102_BLOTER  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_102_BLOTER
(
  BLOTER_ID                 VARCHAR2(25 BYTE)   NOT NULL,
  BLOTER_DESCRIPCION        VARCHAR2(200 BYTE)  NOT NULL,
  BLOTER_HORARIO_DESDE      TIMESTAMP(6),
  BLOTER_HORARIO_HASTA      TIMESTAMP(6),
  BLOTER_IN_RESTRINGIDO     NUMBER(1)           NOT NULL,
  BLOTER_IN_CARTERA_PROPIA  NUMBER(1)           NOT NULL,
  TPPEVA_ID                 VARCHAR2(25 BYTE)   NOT NULL,
  CTESEG_ID                 VARCHAR2(25 BYTE)   NOT NULL,
  BLOTER_STATUS             NUMBER(1)           NOT NULL,
  BLOTER_IN_RED             NUMBER(1),
  ID_AGRUPACION             NUMBER,
  BLOTER_IN_CLAVENET        NUMBER(1),
  ID_CANAL                  NUMBER(8)           DEFAULT 1                     NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_102_BLOTER IS 'Permite definir los Blotter as ser utilizados, con sus parametros por Defecto. Cuando se asocie cada uno de los Blotter  
a la Unidad de Inversion, se pueden redefinir estos atributos para dicha UI.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_IN_CARTERA_PROPIA IS 'Indicador que define que el Blotter es de uso para las compras de Cartera propia de BDV. 1=Indica que el Blotter es usado para registrar ordenes relacionadas a las compras de Cartera Propia. 0=Indica que el Blotter no es usado por registrar ordenes de compra para Cartera propia. Indicador importante para efectos de proceso de Liquidación y de Generación de Deal Ticket para OPICS.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.TPPEVA_ID IS 'Tipo de persona válido';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.CTESEG_ID IS 'Id del segmento del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_STATUS IS 'Status de bloter. 1=activo, 0=inactivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_IN_RED IS 'Indicador que define que el Blotter es de uso de la Red Comercial. 1=Indica que el Blotter es usado por la Red. 0=Indica que el Blotter no es usado por la Red. Indicador importante para efectos de proceso de Liquidación y de Generación de Deal Ticket para OPICS.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.ID_AGRUPACION IS 'Indica como deben agruparse los datos en el momento de enviar ordenes a opics';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_ID IS 'Id del bloter';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_DESCRIPCION IS 'Descripción';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_HORARIO_DESDE IS 'Horario para definir el momento de una toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_HORARIO_HASTA IS 'Horario para definir el momento de una toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_IN_RESTRINGIDO IS 'Indica si el bloter está restringido para la toma de ordenes. 1 (si) 0 (no)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.BLOTER_IN_CLAVENET IS 'Indica si el blotter es usado para claveNet. Solo debe estar un bloter con este indicador encendido';

COMMENT ON COLUMN ADM_INFI.INFI_TB_102_BLOTER.ID_CANAL IS 'Identificador del canal asociado al blotter';

--
-- PK_102  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_102 ON ADM_INFI.INFI_TB_102_BLOTER
(BLOTER_ID)
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
-- INFI_TB_102_BLOTER  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_102_BLOTER FOR ADM_INFI.INFI_TB_102_BLOTER;

GRANT DELETE ON  ADM_INFI.INFI_TB_102_BLOTER TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_102_BLOTER TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_102_BLOTER TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_102_BLOTER TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_102_BLOTER 
-- 
ALTER TABLE ADM_INFI.INFI_TB_102_BLOTER ADD (
  CONSTRAINT CHK_102_1
 CHECK (BLOTER_STATUS in (0,1)));

ALTER TABLE ADM_INFI.INFI_TB_102_BLOTER ADD (
  CONSTRAINT PK_102
 PRIMARY KEY
 (BLOTER_ID)
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
-- Foreign Key Constraints for Table INFI_TB_102_BLOTER 
-- 
ALTER TABLE ADM_INFI.INFI_TB_102_BLOTER ADD (
  CONSTRAINT FK_102_806 
 FOREIGN KEY (ID_AGRUPACION) 
 REFERENCES ADM_INFI.INFI_TB_806_AGRUPACION (ID_AGRUPACION));

ALTER TABLE ADM_INFI.INFI_TB_102_BLOTER ADD (
  CONSTRAINT FK_102_904 
 FOREIGN KEY (ID_CANAL) 
 REFERENCES ADM_INFI.INFI_TB_904_CANAL (CANAL_ID));


