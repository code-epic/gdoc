--
-- INFI_TB_856_TMP_IBS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_856_TMP_IBS
(
  TMP_CLOB        CLOB                          DEFAULT EMPTY_CLOB(),
  FECHA_CREACION  DATE                          NOT NULL,
  PARGRP_ID       VARCHAR2(3 BYTE)              NOT NULL
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
LOB (TMP_CLOB) STORE AS 
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

COMMENT ON TABLE ADM_INFI.INFI_TB_856_TMP_IBS IS 'Tabla de almacenamiento temporal para las interfaces con INFI';

COMMENT ON COLUMN ADM_INFI.INFI_TB_856_TMP_IBS.TMP_CLOB IS 'Clob que se utiliza para almacenar temporalmente cada archivo interface';

COMMENT ON COLUMN ADM_INFI.INFI_TB_856_TMP_IBS.FECHA_CREACION IS 'Fecha de insercion de cada archivo interface';

COMMENT ON COLUMN ADM_INFI.INFI_TB_856_TMP_IBS.PARGRP_ID IS 'ID de la interface con la cual se relaciona el archivo';

