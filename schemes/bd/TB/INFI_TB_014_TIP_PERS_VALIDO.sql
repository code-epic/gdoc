--
-- INFI_TB_014_TIP_PERS_VALIDO  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO
(
  TPPEVA_ID           VARCHAR2(25 BYTE)         NOT NULL,
  TPPEVA_DESCRIPCION  VARCHAR2(50 BYTE)         NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO IS 'Define las diferentes combinaciones de Tipos de Persona Validos. 
Se utilizad para filtrar en los Blotter de las UNidades de Inversion 
a que clientes se puede o no vender. Se debe definir las combinaciones 
aplicables dentro de un Blotter. Si se desea que se permita 
vender a Extranjeros (E) y Venezolanas, se debe crear una con: V-E.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO.TPPEVA_ID IS 'ID que identifica el Tipo de Persona Valido.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO.TPPEVA_DESCRIPCION IS 'Descripción.';

--
-- PK_014  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_014 ON ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO
(TPPEVA_ID)
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
-- INFI_TB_014_TIP_PERS_VALIDO  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_014_TIP_PERS_VALIDO FOR ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO;

GRANT DELETE ON  ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_014_TIP_PERS_VALIDO 
-- 
ALTER TABLE ADM_INFI.INFI_TB_014_TIP_PERS_VALIDO ADD (
  CONSTRAINT PK_014
 PRIMARY KEY
 (TPPEVA_ID)
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


