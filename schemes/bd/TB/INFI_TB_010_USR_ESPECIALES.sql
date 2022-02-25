--
-- INFI_TB_010_USR_ESPECIALES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_010_USR_ESPECIALES
(
  USRESP_ID               VARCHAR2(25 BYTE)     NOT NULL,
  USRESP_CAMBIO_COMISION  NUMBER(1)             NOT NULL,
  USRESP_CAMBIO_VEHICULO  NUMBER(1)             NOT NULL,
  USRESP_MULTIBLOTTER     NUMBER(1)             NOT NULL,
  USRESP_FINANCIAMIENTO   NUMBER(1)             NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_010_USR_ESPECIALES IS 'Permite definir los usuarios que tienen caracteristicas especiales  
al momento de tomar una orden, como que pueden cambiar la 
comision, etc. Se usa el mismo USERID de la Tabla del Sistema  
de Seguridad. Si el usuario no esta en esta tabla, se asume que  
es un usuario normal.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_010_USR_ESPECIALES.USRESP_ID IS 'Id del usuario registrado en el sistema';

COMMENT ON COLUMN ADM_INFI.INFI_TB_010_USR_ESPECIALES.USRESP_CAMBIO_COMISION IS 'Indica si permite cambio de comision 1=si 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_010_USR_ESPECIALES.USRESP_CAMBIO_VEHICULO IS 'Indica si permite cambio de vehículo 1=si 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_010_USR_ESPECIALES.USRESP_MULTIBLOTTER IS 'Indica si puede seleccionar entre multiples bloter a la hora de la toma de una orden. 1=si 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_010_USR_ESPECIALES.USRESP_FINANCIAMIENTO IS 'Indica si puede establecer un financiamiento 1=si 0=no';

--
-- PK_010  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_010 ON ADM_INFI.INFI_TB_010_USR_ESPECIALES
(USRESP_ID)
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
-- INFI_TB_010_USR_ESPECIALES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_010_USR_ESPECIALES FOR ADM_INFI.INFI_TB_010_USR_ESPECIALES;

GRANT DELETE ON  ADM_INFI.INFI_TB_010_USR_ESPECIALES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_010_USR_ESPECIALES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_010_USR_ESPECIALES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_010_USR_ESPECIALES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_010_USR_ESPECIALES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_010_USR_ESPECIALES ADD (
  CONSTRAINT PK_010
 PRIMARY KEY
 (USRESP_ID)
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


