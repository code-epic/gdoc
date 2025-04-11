--
-- INFI_TB_900_AUDITORIA_SW  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_900_AUDITORIA_SW
(
  AUDITORIA_ID  NUMBER(15)                      NOT NULL,
  DIRECCION_IP  VARCHAR2(20 BYTE)               NOT NULL,
  CODIGO_CANAL  VARCHAR2(4 BYTE)                NOT NULL,
  PETICION      VARCHAR2(100 BYTE)              NOT NULL,
  USUARIO       VARCHAR2(15 BYTE),
  FECHA         DATE                            NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_900_AUDITORIA_SW IS 'Tabla para registrar las invocaciones hacia los servicios web';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.AUDITORIA_ID IS 'Id del registro';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.DIRECCION_IP IS 'Dirección ip desde donde es invocado el servicio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.CODIGO_CANAL IS 'Código del canal que realiza la petición';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.PETICION IS 'Contiene el nombre del servicio y de la operación que es invocado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.USUARIO IS 'Usuario que invoca el servicio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_900_AUDITORIA_SW.FECHA IS 'Fecha en el que fue invocado el servicio';

--
-- PK_900  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_900 ON ADM_INFI.INFI_TB_900_AUDITORIA_SW
(AUDITORIA_ID)
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
-- Non Foreign Key Constraints for Table INFI_TB_900_AUDITORIA_SW 
-- 
ALTER TABLE ADM_INFI.INFI_TB_900_AUDITORIA_SW ADD (
  CONSTRAINT PK_900
 PRIMARY KEY
 (AUDITORIA_ID)
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


