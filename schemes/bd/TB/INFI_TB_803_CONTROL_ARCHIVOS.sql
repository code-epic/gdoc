--
-- INFI_TB_803_CONTROL_ARCHIVOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS
(
  EJECUCION_ID           NUMBER(7),
  SISTEMA_ID             VARCHAR2(10 BYTE),
  FECHA                  DATE                   NOT NULL,
  FECHA_CIERRE           DATE,
  NOMBRE                 VARCHAR2(100 BYTE)     NOT NULL,
  VEHICU_ID              VARCHAR2(25 BYTE),
  STATUS                 VARCHAR2(25 BYTE),
  UNDINV_ID              NUMBER(7),
  IN_RECEPCION           NUMBER(1)              DEFAULT 0,
  USR_NOMBRE             VARCHAR2(50 BYTE),
  RELACION_EJECUCION_ID  NUMBER(7)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS IS 'Contiene la historia de los movimientos de envio y recepci�n de archivos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.EJECUCION_ID IS 'Id de ejecuci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.SISTEMA_ID IS 'Id del sistema';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.FECHA IS 'Fecha de envio';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.FECHA_CIERRE IS 'Fecha de cierre del proceso de envio o recepci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.NOMBRE IS 'Nombre del archivo generado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.VEHICU_ID IS 'Id del veh�culo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.STATUS IS 'Generado, Recibido, Cierre';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.UNDINV_ID IS 'Id de la unidad de inversi�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.IN_RECEPCION IS '1=si es de recepci�n ';

COMMENT ON COLUMN ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS.RELACION_EJECUCION_ID IS 'Id de ejecuci�n relacionado a otro';

--
-- IDX_803_CONTROL_ARCHIVOS  (Index) 
--
CREATE INDEX ADM_INFI.IDX_803_CONTROL_ARCHIVOS ON ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS
(FECHA_CIERRE, STATUS)
LOGGING
TABLESPACE INDX
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
-- PK_803  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_803 ON ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS
(EJECUCION_ID)
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
-- INFI_TB_803_CONTROL_ARCHIVOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_803_CONTROL_ARCHIVOS FOR ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_803_CONTROL_ARCHIVOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS ADD (
  CONSTRAINT PK_803
 PRIMARY KEY
 (EJECUCION_ID)
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
-- Foreign Key Constraints for Table INFI_TB_803_CONTROL_ARCHIVOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS ADD (
  CONSTRAINT FK_803_018 
 FOREIGN KEY (VEHICU_ID) 
 REFERENCES ADM_INFI.INFI_TB_018_VEHICULOS (VEHICU_ID));

ALTER TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS ADD (
  CONSTRAINT FK_803_106 
 FOREIGN KEY (UNDINV_ID) 
 REFERENCES ADM_INFI.INFI_TB_106_UNIDAD_INVERSION (UNDINV_ID));

ALTER TABLE ADM_INFI.INFI_TB_803_CONTROL_ARCHIVOS ADD (
  CONSTRAINT FK_803_802 
 FOREIGN KEY (SISTEMA_ID) 
 REFERENCES ADM_INFI.INFI_TB_802_SISTEMA (SISTEMA_ID));

