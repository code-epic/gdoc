--
-- INFI_TB_108_UI_TITULOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_108_UI_TITULOS
(
  UNDINV_ID                     NUMBER(7)       NOT NULL,
  TITULO_ID                     VARCHAR2(25 BYTE) NOT NULL,
  UITITU_PORCENTAJE             NUMBER(10,7)    NOT NULL,
  UITITU_VALOR_EQUIVALENTE      NUMBER(20,7)    NOT NULL,
  UITITU_IN_CONIDB              NUMBER(1)       DEFAULT 0                     NOT NULL,
  UITITU_IN_CONTROL_DISPONIBLE  NUMBER(1)       DEFAULT 0
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

COMMENT ON TABLE ADM_INFI.INFI_TB_108_UI_TITULOS IS 'Toda UI debe tener por lo menos un TITULO asociado. 
El TITULO debe estar previamente definido 
con esta relación se define que TITULOS forman parte de la UI, y sus criterios de toma de ordenes, 
seriales contables asociados, etc. 
El TITULO debe ser previamente creado en OPICS. 
Los datos del TITULO estan principalmente en OPICS, solo se guarda 
de referencia lo minimo requerido en INFI. 
Los datos relacionados al cronograma de pago de Cupones se toman de OPICS, solo se 
guarda para efectos practicos en INFI le proxima fecha de cupon y la fecha del ultimo 
cupon pagado. Similar comportamiento es para el cronograma de Amortización.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.UNDINV_ID IS 'ID de la Unidad de Inversión. FK con TB106.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.TITULO_ID IS 'ID del Título. FK con TB100.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.UITITU_PORCENTAJE IS 'Porcentaje del Título correspondiente a la Unidad Minima de Inversión para la Unidad de Inversión. Define el porcentaje proporcional del Título con respecto a la Unidad Minima. Este porcentaje permite registrar la cantidad que esta obteniendo el Cliente al momento de comprar.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.UITITU_VALOR_EQUIVALENTE IS 'Define el Valor equivalente del Título en Bolivares (Moneda Local), con respecto a la Unidad Minima de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.UITITU_IN_CONIDB IS 'Indica si el título agregado a la unidad debe contemplar el cobro de idb';

COMMENT ON COLUMN ADM_INFI.INFI_TB_108_UI_TITULOS.UITITU_IN_CONTROL_DISPONIBLE IS 'Indica si se valida el monto disponible para la undidad de inversion';

--
-- PK_108  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_108 ON ADM_INFI.INFI_TB_108_UI_TITULOS
(UNDINV_ID, TITULO_ID)
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
-- INFI_TB_108_UI_TITULOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_108_UI_TITULOS FOR ADM_INFI.INFI_TB_108_UI_TITULOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_108_UI_TITULOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_108_UI_TITULOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_108_UI_TITULOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_108_UI_TITULOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_108_UI_TITULOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_108_UI_TITULOS ADD (
  CONSTRAINT PK_108
 PRIMARY KEY
 (UNDINV_ID, TITULO_ID)
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
-- Foreign Key Constraints for Table INFI_TB_108_UI_TITULOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_108_UI_TITULOS ADD (
  CONSTRAINT FK_108_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID)
    ON DELETE CASCADE);


