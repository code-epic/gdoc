--
-- INFI_TB_901_ACCESO_WS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_901_ACCESO_WS
(
  ACCESO_ID     NUMBER(8)                       NOT NULL,
  DIRECCION_IP  VARCHAR2(20 BYTE)               NOT NULL,
  SERVICIO      VARCHAR2(50 BYTE)               NOT NULL,
  OPERACION     VARCHAR2(50 BYTE)               NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_901_ACCESO_WS IS 'Tabla para validar accesos a los servicios web';

COMMENT ON COLUMN ADM_INFI.INFI_TB_901_ACCESO_WS.ACCESO_ID IS 'Id del registro';

COMMENT ON COLUMN ADM_INFI.INFI_TB_901_ACCESO_WS.DIRECCION_IP IS 'Ip que tiene acceso al servicio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_901_ACCESO_WS.SERVICIO IS 'Servicio web al que tiene la ip indicada';

COMMENT ON COLUMN ADM_INFI.INFI_TB_901_ACCESO_WS.OPERACION IS 'Método asociado al servicio al que tiene acceso la ip configurada';

--
-- PK_901  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_901 ON ADM_INFI.INFI_TB_901_ACCESO_WS
(ACCESO_ID)
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
-- Non Foreign Key Constraints for Table INFI_TB_901_ACCESO_WS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_901_ACCESO_WS ADD (
  CONSTRAINT PK_901
 PRIMARY KEY
 (ACCESO_ID)
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


