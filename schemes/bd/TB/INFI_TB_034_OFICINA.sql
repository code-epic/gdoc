--
-- INFI_TB_034_OFICINA  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_034_OFICINA
(
  OFICINA_NRO                     VARCHAR2(25 BYTE) NOT NULL,
  OFICINA_IN_TOMA_ORDEN           NUMBER(1)     DEFAULT 0,
  OFICINA_MAX_MONTO_ORDEN         NUMBER(7,4),
  OFICINA_MAX_MONTO_ORDEN_DIARIO  NUMBER(7,2)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_034_OFICINA IS 'Identifica el número de oficina autorizada';

COMMENT ON COLUMN ADM_INFI.INFI_TB_034_OFICINA.OFICINA_IN_TOMA_ORDEN IS 'Indicador de si la Oficina puede tomar ordenes o no. 0=Indica que la oficina SI esta autorizada. Equivalente tambien a si la oficina no esta en esta tabla. 1=Indica que NO se permite a la oficina tomar ordenes. ';

COMMENT ON COLUMN ADM_INFI.INFI_TB_034_OFICINA.OFICINA_MAX_MONTO_ORDEN IS 'Campo que permite fijar un limite en la toma de ordenes. Si este campo posee valor y la oficina puede tomar ordenes, las mismas no pueden exceder de este monto.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_034_OFICINA.OFICINA_MAX_MONTO_ORDEN_DIARIO IS 'Campo que permite establecer un limite en monto diario para todas las ordenes. Se valida en toma de orden, si este campo existe y es diferente de cero para la oficina. Validado al momento de la toma de orden.';

--
-- INFI_TB_034_OFICINA  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_034_OFICINA FOR ADM_INFI.INFI_TB_034_OFICINA;

GRANT DELETE ON  ADM_INFI.INFI_TB_034_OFICINA TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_034_OFICINA TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_034_OFICINA TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_034_OFICINA TO USU_INFI;

