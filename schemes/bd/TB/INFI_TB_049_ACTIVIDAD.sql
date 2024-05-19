--
-- INFI_TB_049_ACTIVIDAD  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_049_ACTIVIDAD
(
  CODIGO_ID           NUMBER(5)                 NOT NULL,
  SECTOR              VARCHAR2(50 BYTE),
  SECTOR_DESCRIPCION  VARCHAR2(500 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_049_ACTIVIDAD IS 'Tabla de sector dela actividad economica de las persona y empresas para operaciones realizadas a través del SITME';


--
-- INFI_TB_049_ACTIVIDAD  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_049_ACTIVIDAD FOR ADM_INFI.INFI_TB_049_ACTIVIDAD;

GRANT DELETE ON  ADM_INFI.INFI_TB_049_ACTIVIDAD TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_049_ACTIVIDAD TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_049_ACTIVIDAD TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_049_ACTIVIDAD TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_049_ACTIVIDAD 
-- 
ALTER TABLE ADM_INFI.INFI_TB_049_ACTIVIDAD ADD (
  PRIMARY KEY
 (CODIGO_ID)
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


