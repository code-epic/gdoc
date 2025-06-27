--
-- INFI_TB_016_EMPRESAS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_016_EMPRESAS
(
  EMPRES_ID                      VARCHAR2(25 BYTE) NOT NULL,
  EMPRES_NOMBRE                  VARCHAR2(50 BYTE) NOT NULL,
  EMPRES_RIF                     VARCHAR2(11 BYTE) NOT NULL,
  EMPRES_IN_EMISOR               NUMBER(1)      NOT NULL,
  EMPRES_IN_DEPOSITARIO_CENTRAL  NUMBER(1)      NOT NULL,
  EMPRES_STATUS                  NUMBER(1)      NOT NULL,
  EMPRES_EMAIL                   VARCHAR2(50 BYTE),
  EMPRES_SIGLAS                  VARCHAR2(4 BYTE),
  EMPRES_CUENTA                  VARCHAR2(20 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_016_EMPRESAS IS 'Permite definir una lista de empresas que participan en una Unidad de Inversion, en los diferentes roles aplicables como: Emisor, Depositario Central, etc.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_ID IS 'Id de la empresa';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_NOMBRE IS 'Nombre';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_RIF IS 'Rif';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_IN_EMISOR IS 'Indica si la empresa es emisor';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_IN_DEPOSITARIO_CENTRAL IS 'Indica si la empresa como depositario central';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_STATUS IS 'Status. 1=activo 0=inactivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_EMAIL IS 'Email para Contactos.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_SIGLAS IS 'Indica las siglas de la empresa. El valor es usado para la generación de comisiones por depositario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_016_EMPRESAS.EMPRES_CUENTA IS 'Numero de cuenta en el BDV que posee la empresa';

--
-- PK_016  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_016 ON ADM_INFI.INFI_TB_016_EMPRESAS
(EMPRES_ID)
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
-- INFI_TB_016_EMPRESAS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_016_EMPRESAS FOR ADM_INFI.INFI_TB_016_EMPRESAS;

GRANT DELETE ON  ADM_INFI.INFI_TB_016_EMPRESAS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_016_EMPRESAS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_016_EMPRESAS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_016_EMPRESAS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_016_EMPRESAS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_016_EMPRESAS ADD (
  CONSTRAINT PK_016
 PRIMARY KEY
 (EMPRES_ID)
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


