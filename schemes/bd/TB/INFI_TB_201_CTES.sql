--
-- INFI_TB_201_CTES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_201_CTES
(
  CLIENT_ID                  NUMBER(8)          NOT NULL,
  TIPPER_ID                  VARCHAR2(1 BYTE)   NOT NULL,
  CLIENT_CEDRIF              NUMBER(10)         NOT NULL,
  CLIENT_NOMBRE              VARCHAR2(100 BYTE) NOT NULL,
  CLIENT_CTA_CUSTOD_ID       NUMBER(7)          NOT NULL,
  CLIENT_CTA_CUSTOD_FECHA    DATE               NOT NULL,
  CLIENT_DIRECCION           VARCHAR2(255 BYTE),
  CLIENT_TELEFONO            VARCHAR2(50 BYTE),
  CLIENT_TIPO                VARCHAR2(20 BYTE),
  CLIENT_CORREO_ELECTRONICO  VARCHAR2(100 BYTE),
  CLIENT_EMPLEADO            NUMBER(1),
  CTESEG_ID                  VARCHAR2(3 BYTE),
  NUMERO_PERSONA             NUMBER(15)         DEFAULT -1                    NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_201_CTES IS 'Define los atributos basicos a nivel de Clientes dentro del Sistema.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.NUMERO_PERSONA IS 'Numero de persona en el bdv valor por defecto -1';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_ID IS 'ID del Cliente. Valor asignado a través de un SEQUENCE.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.TIPPER_ID IS 'ID del Tipo de Persona del Cliente. FK con TB200.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_CEDRIF IS 'Numero de Cedula o RIF del Cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_NOMBRE IS 'Nombre del Cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_CTA_CUSTOD_ID IS 'Numero de la Cuenta Custodia del Cliente. Asignado en forma automática a través de un SEQUENCE. El número de Cuenta Custodia de un Cliente, se mantiene desde que se asigna por primera vez. Así luego no posea Títulos en Custodia, el número asignado, será siempre para ese Cliente.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_CTA_CUSTOD_FECHA IS 'Fecha en que se le asignó al Cliente la Cuenta para Custodia. Solo se actualiza esta fecha la primera vez.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_DIRECCION IS 'Dirección del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_TELEFONO IS 'Teléfono del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_TIPO IS 'Tipo de cliente, particular, etc.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_CORREO_ELECTRONICO IS 'Correo electrónico del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_201_CTES.CLIENT_EMPLEADO IS 'Indica si es o no empleado. SI=1 No=0';

--
-- INFI_201_CEDRIF_TIPPER_ID  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.INFI_201_CEDRIF_TIPPER_ID ON ADM_INFI.INFI_TB_201_CTES
(CLIENT_CEDRIF, TIPPER_ID)
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
-- PK_201  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_201 ON ADM_INFI.INFI_TB_201_CTES
(CLIENT_ID)
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
-- INFI_TB_201_CTES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_201_CTES FOR ADM_INFI.INFI_TB_201_CTES;

GRANT DELETE ON  ADM_INFI.INFI_TB_201_CTES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_201_CTES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_201_CTES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_201_CTES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_201_CTES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_201_CTES ADD (
  CONSTRAINT PK_201
 PRIMARY KEY
 (CLIENT_ID)
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

ALTER TABLE ADM_INFI.INFI_TB_201_CTES ADD (
  CONSTRAINT INFI_201_CEDRIF_TIPPER_ID
 UNIQUE (CLIENT_CEDRIF, TIPPER_ID)
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
-- Foreign Key Constraints for Table INFI_TB_201_CTES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_201_CTES ADD (
  CONSTRAINT FK_201_200 
 FOREIGN KEY (TIPPER_ID) 
 REFERENCES ADM_INFI.INFI_TB_200_TIPO_PERSONAS (TIPPER_ID));


