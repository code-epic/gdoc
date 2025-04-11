--
-- INFI_TB_107_UI_BLOTTER  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_107_UI_BLOTTER
(
  UNDINV_ID                     NUMBER(7)       NOT NULL,
  BLOTER_ID                     VARCHAR2(25 BYTE) NOT NULL,
  UIBLOT_IN_DISPONIBLE          NUMBER(1)       DEFAULT 0,
  UIBLOT_HORARIO_DESDE          TIMESTAMP(6)    NOT NULL,
  UIBLOT_HORARIO_HASTA          TIMESTAMP(6)    NOT NULL,
  UIBLOT_PEDIDO_FE_INI          DATE            NOT NULL,
  UIBLOT_PEDIDO_FE_FIN          DATE            NOT NULL,
  UIBLOT_SERIAL_COMISIONES      VARCHAR2(50 BYTE),
  UIBLOT_SERIAL_CAPITAL         VARCHAR2(50 BYTE),
  TPPEVA_ID                     VARCHAR2(25 BYTE),
  CTESEG_ID                     VARCHAR2(25 BYTE),
  UIBLOT_IN_DEFECTO             NUMBER(1)       DEFAULT 0,
  UIBLOT_IN_TESORERIA           NUMBER(1)       DEFAULT 0,
  UIBLOT_HORARIO_DESDE_ULT_DIA  DATE,
  UIBLOT_HORARIO_HASTA_ULT_DIA  DATE,
  UIBLOT_GANANCIA_RED           NUMBER(5,2),
  UIBLOT_IN_RECOMPRA            NUMBER(1)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_107_UI_BLOTTER IS 'Define los Blotter relacionados a la UI. 
Toda UI debe tener por lo menos un Blotter asociado. 
El Blotter debe estar previamente definido 
Con esta relación se define que Blotter seran utilizados para la toma de ordenes, 
criterios de validacion, de envio de datos a emisor, etc. 
que permiten parametrizar el comportamiento del Sistema en cuanto 
a la toma de orden, envio de datos al emisor, etc.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UNDINV_ID IS 'ID de la Unidad de Inversión. FK con TB106.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.BLOTER_ID IS 'ID del Blotter. FK con TB102';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_IN_DISPONIBLE IS 'Indicador que define, sí el Blotter esta disponible para la Toma de Ordenes. Este indicador es independiente de las Fechas y Horarios establecidos. Si el Indicador esta en 1, significa que el Blotter esta disponible, pero se debe validar la restricción que pueda tener por Horario y por Fecha desde y hasta. Si tiene 0 significa que el Blotter NO permite que se tomen orden, independientemente que el Horario y la Fecha desde y hasta lo permitan. Usado básicamente para desactivar temporalmente un Blotter, sin necesidad de tener que cambiar el horario y/o las fechas.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_HORARIO_DESDE IS 'Define el Horario Desde en que el Blotter puede tomar ordenes.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_HORARIO_HASTA IS 'Define el Horario hasta, en que el Blotter permite la Toma de ordenes.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_PEDIDO_FE_INI IS 'Define la Fecha y Hora desde en que el Blotter permite que se tomen ordenes.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_PEDIDO_FE_FIN IS 'Define la Fecha y Hora hasta,  en que el Blotter permite que se tomen ordenes.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_SERIAL_COMISIONES IS 'Define el serial contable que se debe utilizar para todas las Transacciones Financieras asociadas al Blotter para Comisiones.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_SERIAL_CAPITAL IS 'Define el serial contable que se debe utilizar para todas las Transacciones Financieras asociadas al Blotter para Capital.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.TPPEVA_ID IS 'ID de los Tipos de Persona Validos que pueden procesar una Orden por el Blotter.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.CTESEG_ID IS 'ID del Segmento de cliente, a los cuales se les permite procesar una orden por el Blotter.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_IN_DEFECTO IS 'Indicador que define cual es el Blotter por defecto para una Unidad de Inversión. Un Blotter con el Indicador de Restringido, NO puede ser seleccionado como Blotter por defecto.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_IN_TESORERIA IS 'Indicador de Blotter por defecto para Tesoreria.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_HORARIO_DESDE_ULT_DIA IS 'Horario del último día en el que los blotter pueden tomar las ordenes. Este horario es diferente porque el el ente emisor para el último día de toma de ordenes pauta una hora de cierre';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_HORARIO_HASTA_ULT_DIA IS 'Horario del último día en el que los blotter pueden tomar las ordenes. Este horario es diferente porque el el ente emisor para el último día de toma de ordenes pauta una hora de cierre';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_GANANCIA_RED IS 'Indica el porcentaje de ganancia de la red en el momento de una toma de orden de un instrumento de tipo inventario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_107_UI_BLOTTER.UIBLOT_IN_RECOMPRA IS 'Indica si el blotter permite que se pacte una recompra al momento de una toma de orden. 1=Indica que se puede pactar la recompra. 0=No se puede pactar recompra';

--
-- PK_107  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_107 ON ADM_INFI.INFI_TB_107_UI_BLOTTER
(UNDINV_ID, BLOTER_ID)
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
-- INFI_TB_107_UI_BLOTTER  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_107_UI_BLOTTER FOR ADM_INFI.INFI_TB_107_UI_BLOTTER;

GRANT DELETE ON  ADM_INFI.INFI_TB_107_UI_BLOTTER TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_107_UI_BLOTTER TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_107_UI_BLOTTER TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_107_UI_BLOTTER TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_107_UI_BLOTTER 
-- 
ALTER TABLE ADM_INFI.INFI_TB_107_UI_BLOTTER ADD (
  CONSTRAINT PK_107
 PRIMARY KEY
 (UNDINV_ID, BLOTER_ID)
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
-- Foreign Key Constraints for Table INFI_TB_107_UI_BLOTTER 
-- 
ALTER TABLE ADM_INFI.INFI_TB_107_UI_BLOTTER ADD (
  CONSTRAINT FK_107_102 
 FOREIGN KEY (BLOTER_ID) 
 REFERENCES ADM_INFI.INFI_TB_102_BLOTER (BLOTER_ID));

ALTER TABLE ADM_INFI.INFI_TB_107_UI_BLOTTER ADD (
  CONSTRAINT FK_107_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID)
    ON DELETE CASCADE);


