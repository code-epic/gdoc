--
-- INFI_TB_Z15_REGISTROS_VAL  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z15_REGISTROS_VAL
(
  Z15_CO_CODIGO_REGISTRO  NUMBER(22)            NOT NULL,
  Z11_COD_PROCESO         NUMBER(22),
  Z15_NU_NUMERO_REGISTRO  NUMBER(22),
  Z15_CAMPO_VALOR         VARCHAR2(200 BYTE),
  Z15_CAMPO_MENSAJE       VARCHAR2(200 BYTE),
  Z15_CAMPO_RESULTADO     NUMBER(22),
  Z15_CAMPO_NUMERO        NUMBER(22)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z15_REGISTROS_VAL IS 'Tabla que contiene los mismo registros de Z12, pero con una estructura diferente para facilitar la generación de los Informes. Esta tabla es poblada por el proceso de Transformación de Registros INFICD300.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_CO_CODIGO_REGISTRO IS 'Codigo que identifica el registro. Se genera a través de un SEQUENCE automaticamnete incrementandose de 1 en 1.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z11_COD_PROCESO IS 'Codigo que identifica el Proceso al cual pertenece el registro. FK sobre Z11.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_NU_NUMERO_REGISTRO IS 'Identifica el numero de registro con respecto al archivo origen procesado. Numero secuencial asignado a los registros leidos del archivo fisico, comenzando con 1.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_CAMPO_VALOR IS 'Valor que contiene el campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_CAMPO_MENSAJE IS 'Mensaje descriptivo del error que posee el campo al momento de su validación. Este mensaje esta asociado al formato y al criterio de validacion que no fue superado por el campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_CAMPO_RESULTADO IS 'Indicador de resultado del campo 1. 0=indica que tiene errores el campo se debe consultar el campo de mensaje, y 1=indica que el campo paso el proceso de validación.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z15_REGISTROS_VAL.Z15_CAMPO_NUMERO IS 'Identifica el numero de campo dentro del registro.';

--
-- INFI_TB_Z15_REGISTROS_VAL  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z15_REGISTROS_VAL FOR ADM_INFI.INFI_TB_Z15_REGISTROS_VAL;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z15_REGISTROS_VAL TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z15_REGISTROS_VAL TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z15_REGISTROS_VAL TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z15_REGISTROS_VAL TO USU_INFI;

-- 
-- Foreign Key Constraints for Table INFI_TB_Z15_REGISTROS_VAL 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z15_REGISTROS_VAL ADD (
  CONSTRAINT INFI_FK_Z15_Z11_FK1 
 FOREIGN KEY (Z11_COD_PROCESO) 
 REFERENCES ADM_INFI.INFI_TB_Z11_PROCESOS (Z11_COD_PROCESO));


