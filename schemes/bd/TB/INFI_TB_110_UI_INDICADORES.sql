--
-- INFI_TB_110_UI_INDICADORES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_110_UI_INDICADORES
(
  UNDINV_ID            NUMBER(7)                NOT NULL,
  INDICA_ID            VARCHAR2(3 BYTE)         NOT NULL,
  UIINDI_ID_REQUERIDO  NUMBER(1)                NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_110_UI_INDICADORES IS 'Define los Indicadores de Cotejo relacionados a la UI. 
Estos Indicadores son opcionales. Si existen, puede ser 1 o "N".  
Los Indicadores, deben estar previamente definidos. 
Aca incluimos los que queremos asociar a la UI, y definimos si son requeridos su chequeo o no. 
Estos indicadores son guias de "Checklist" de tipo SI/NO al momento de la Toma de Orden 
El objetivo es poder contar con una lista de chequeo, para que el usuario al momento de cerrar 
la orden verifique aspectos manuales. Por Ejemplo: Contar con fotocopia de la Cedula del Cliente. 
Aca definimos si el proceso puede continar, si el Indicador esta marcado como NO.  
Si colocamos que el indicador es requerido, el proceso de Toma de Orden, solo continuará 
su flujo si el usuario a marcado SI en el mismo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_110_UI_INDICADORES.UNDINV_ID IS 'ID de la Unidad de Inversión. FK con TB106.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_110_UI_INDICADORES.INDICA_ID IS 'ID del Indicador de Cotejo. FK con TB011.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_110_UI_INDICADORES.UIINDI_ID_REQUERIDO IS 'Indicador de que se debe validar como SI el Indicador al momento de la Orden para permitir continuar con el proceso. Si tiene 1 significa que el proceso de Toma de Orden valida que ese Indicador se haya marcado como SI por el usuario, para poder permitir que se continúe con el proceso de la Toma de Orden.';

--
-- PK_110  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_110 ON ADM_INFI.INFI_TB_110_UI_INDICADORES
(UNDINV_ID, INDICA_ID)
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
-- INFI_TB_110_UI_INDICADORES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_110_UI_INDICADORES FOR ADM_INFI.INFI_TB_110_UI_INDICADORES;

GRANT DELETE ON  ADM_INFI.INFI_TB_110_UI_INDICADORES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_110_UI_INDICADORES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_110_UI_INDICADORES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_110_UI_INDICADORES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_110_UI_INDICADORES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_110_UI_INDICADORES ADD (
  CONSTRAINT PK_110
 PRIMARY KEY
 (UNDINV_ID, INDICA_ID)
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
-- Foreign Key Constraints for Table INFI_TB_110_UI_INDICADORES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_110_UI_INDICADORES ADD (
  CONSTRAINT FK_110_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID)
    ON DELETE CASCADE);


