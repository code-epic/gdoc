--
-- INFI_TB_807_PROCESOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_807_PROCESOS
(
  EJECUCION_ID        NUMBER                    NOT NULL,
  TRANSA_ID           VARCHAR2(25 BYTE)         NOT NULL,
  USUARIO_ID          NUMBER,
  FECHA_INICIO        DATE                      NOT NULL,
  FECHA_FIN           DATE,
  DESC_ERROR          VARCHAR2(1000 BYTE),
  FECHA_VALOR         DATE,
  CICLO_EJECUCION_ID  NUMBER(7)
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

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.EJECUCION_ID IS 'Id de ejecuci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.TRANSA_ID IS 'Id de la transacci�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.USUARIO_ID IS 'Id del usuario que efectu� el proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.FECHA_INICIO IS 'Fecha y hora de inicio del proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.FECHA_FIN IS 'Fecha y hora fin del proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.DESC_ERROR IS 'Descripci�n del error en caso de fallar';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.FECHA_VALOR IS 'Si es un cobro de comisiones que mes se est� cobrando';

COMMENT ON COLUMN ADM_INFI.INFI_TB_807_PROCESOS.CICLO_EJECUCION_ID IS 'Indentificador del ciclo asociado al proceso';

--
-- INFI_TB_807_PROCESOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_807_PROCESOS FOR ADM_INFI.INFI_TB_807_PROCESOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_807_PROCESOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_807_PROCESOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_807_PROCESOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_807_PROCESOS TO USU_INFI;

-- 
-- Foreign Key Constraints for Table INFI_TB_807_PROCESOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_807_PROCESOS ADD (
  CONSTRAINT FK_807_012 
 FOREIGN KEY (TRANSA_ID) 
 REFERENCES ADM_INFI.INFI_TB_012_TRANSACCIONES (TRANSA_ID));


