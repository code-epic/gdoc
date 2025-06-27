--
-- INFI_TB_221_SWIFT_DETALLES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_221_SWIFT_DETALLES
(
  ID_TICKET        NUMBER(12),
  ID_ORDEN_INFI    NUMBER(12)                   NOT NULL,
  CONTENIDO_SWIFT  BLOB
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
LOB (CONTENIDO_SWIFT) STORE AS 
      ( TABLESPACE  DATA 
        ENABLE      STORAGE IN ROW
        CHUNK       8192
        PCTVERSION  0
        NOCACHE
        STORAGE    (
                    INITIAL          64K
                    NEXT             1M
                    MINEXTENTS       1
                    MAXEXTENTS       2147483645
                    PCTINCREASE      0
                    BUFFER_POOL      DEFAULT
                   )
      )
NOCACHE
NOPARALLEL
MONITORING;

COMMENT ON TABLE ADM_INFI.INFI_TB_221_SWIFT_DETALLES IS 'Tabla que contiene el contenido del archivo SWIFT en formato txt asociado a una solicitud Sitme/Subasta.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_221_SWIFT_DETALLES.ID_TICKET IS 'Identificador de solicitud Clavenet Empresarial/Personal';

COMMENT ON COLUMN ADM_INFI.INFI_TB_221_SWIFT_DETALLES.ID_ORDEN_INFI IS 'Identificador de orden INFI';

COMMENT ON COLUMN ADM_INFI.INFI_TB_221_SWIFT_DETALLES.CONTENIDO_SWIFT IS 'Archivo txt con el SWIFT asociado a la solicitud';

