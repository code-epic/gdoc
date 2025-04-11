--
-- INFI_TB_906_CIERRE  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_906_CIERRE
(
  DIAS_TRANSCURRIDOS  NUMBER(3)                 DEFAULT 0,
  PASO_EN_EJECUCION   NUMBER(3)                 DEFAULT 0,
  FECHA_SISTEMA       DATE,
  FECHA_PRE_CIERRE    DATE,
  CIERRE_ACTIVO       NUMBER(1)                 DEFAULT 0,
  INDICADOR_FALLA     NUMBER(1)                 DEFAULT 0
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

COMMENT ON TABLE ADM_INFI.INFI_TB_906_CIERRE IS 'Tabla de configuracion del proceso de cierre de la aplicacion';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.PASO_EN_EJECUCION IS 'Es el numero de paso en el que se encuentra o se detiene por algun error el proceso de cierre de la aplicacion';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.FECHA_SISTEMA IS 'Fecha en la que se encuentra la aplicacion';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.FECHA_PRE_CIERRE IS 'Fecha para la cual se deben realizar los calculos del cierre de operativa';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.CIERRE_ACTIVO IS 'Indicador de activacion del proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.INDICADOR_FALLA IS 'Campo Indicador de posibles fallas en el proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_906_CIERRE.DIAS_TRANSCURRIDOS IS 'Calculo de diferencia entre en dia de FECHA_SISTEMA y el FECHA_PRE_CIERRE';

--
-- INFI_TB_906_CIERRE  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_906_CIERRE FOR ADM_INFI.INFI_TB_906_CIERRE;

GRANT DELETE ON  ADM_INFI.INFI_TB_906_CIERRE TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_906_CIERRE TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_906_CIERRE TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_906_CIERRE TO USU_INFI;

