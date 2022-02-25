--
-- INFI_TB_111_UI_BLOTTER_RANGOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS
(
  UNDINV_ID                       NUMBER(7)     NOT NULL,
  BLOTER_ID                       VARCHAR2(25 BYTE) NOT NULL,
  TIPPER_ID                       VARCHAR2(1 BYTE) NOT NULL,
  UIBLOT_PRECIO_MINIMO            NUMBER(5,2)   NOT NULL,
  UIBLOT_PRECIO_MAXIMO            NUMBER(5,2),
  UIBLOT_UMI_INV_MTO_MIN          NUMBER(14),
  UIBLOT_UMI_INV_MTO_MAX          NUMBER(14),
  UIBLOT_UMI_UM_CANT_MIN          NUMBER(5),
  UIBLOT_UMI_UM_CANT_MAX          NUMBER(5),
  UIBLOT_PCT_MAX_FINAN            NUMBER(5,2)   NOT NULL,
  UIBLOT_COMISION_EMISOR          NUMBER(8,4)   NOT NULL,
  UIBLOT_TRNFIN_TIPO              VARCHAR2(3 BYTE) NOT NULL,
  UIBLOT_TASA_PROP_MIN            NUMBER(8,4)   DEFAULT 0,
  MANEJO_CORRESPONSAL             NUMBER(1)     DEFAULT -1                    NOT NULL,
  UIBLOT_UMI_INV_MTO_MIN_A_VALOR  NUMBER(14)    DEFAULT 3000                  NOT NULL,
  UIBLOT_TASA_PROP_MAX            NUMBER(8,4)   DEFAULT 0,
  UIBLOT_TIPO                     NUMBER(1)     DEFAULT 1                     NOT NULL
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

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_TIPO IS 'Indica si el tipo de persona aplica para para Electronico o Efectivo.-1 = No aplica. 1 = Electronico, 2= Efectivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UNDINV_ID IS 'Unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.BLOTER_ID IS 'Id de blotter';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.TIPPER_ID IS 'Tipo de persona válido';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_PRECIO_MINIMO IS 'Precio mínimo que se puede ofrecer en la toma de una orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_PRECIO_MAXIMO IS 'Precio máximo que se puede ofrecer en la toma de una orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_UMI_INV_MTO_MIN IS 'Unidad Mínima de Inversión. Aplica cuanto es INVENTARIO. NO aplica cuando es SUBASTA.  Define el monto mínimo que debe tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_UMI_INV_MTO_MAX IS 'Unidad Minima de Inversión. Aplica cuanto es INVENTARIO. NO aplica cuando es SUBASTA.  Define el monto máximo que puede tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_UMI_UM_CANT_MIN IS 'Unidad Mínima de Inversión. Aplica cuanto es SUBASTA. NO aplica cuando es INVENTARIO.  Define la cantidad mínima de Unidades de Inversión debe tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_UMI_UM_CANT_MAX IS 'Unidad Mínima de Inversión. Aplica cuanto es SUBASTA. NO aplica cuando es INVENTARIO.  Define la cantidad máxima de Unidades de Inversión puede tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_PCT_MAX_FINAN IS 'Porcentaje máximo de financiamiento. Si es 0 indica que no permite financiamiento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_COMISION_EMISOR IS 'Comisión que cobra el emisor y que está atada al tipo de persona en el momento de una toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_TRNFIN_TIPO IS 'Especifica el tipo de operación sobre las transacciones financiera generadas en una toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_TASA_PROP_MIN IS 'Tasa propuesta mínima';

COMMENT ON COLUMN ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS.UIBLOT_UMI_INV_MTO_MIN_A_VALOR IS 'Campo para guardar el monto minimo para alto valor';

--
-- PK_111_UI  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_111_UI ON ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS
(UNDINV_ID, BLOTER_ID, TIPPER_ID, UIBLOT_TIPO)
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
-- INFI_TB_111_UI_BLOTTER_RANGOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_111_UI_BLOTTER_RANGOS FOR ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_111_UI_BLOTTER_RANGOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS ADD (
  CONSTRAINT PK_111_UI
 PRIMARY KEY
 (UNDINV_ID, BLOTER_ID, TIPPER_ID, UIBLOT_TIPO)
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
-- Foreign Key Constraints for Table INFI_TB_111_UI_BLOTTER_RANGOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS ADD (
  CONSTRAINT FK_111_200 
 FOREIGN KEY (TIPPER_ID) 
 REFERENCES ADM_INFI.INFI_TB_200_TIPO_PERSONAS (TIPPER_ID));

ALTER TABLE ADM_INFI.INFI_TB_111_UI_BLOTTER_RANGOS ADD (
  CONSTRAINT FK_111_805 
 FOREIGN KEY (UIBLOT_TRNFIN_TIPO) 
 REFERENCES ADM_INFI.INFI_TB_805_TRNFIN_TIPO (TRNFIN_TIPO));


