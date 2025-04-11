--
-- INFI_TB_Z11_PROCESOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z11_PROCESOS
(
  Z11_COD_PROCESO            NUMBER(22)         NOT NULL,
  Z10_CO_CODIGO_ARCHIVO      NUMBER(22)         NOT NULL,
  Z11_NU_NUMERO_PROCESO      VARCHAR2(100 BYTE) NOT NULL,
  Z11_FE_FECHA_INICIO        DATE               NOT NULL,
  Z11_FE_FECHA_FINAL         DATE,
  Z11_NO_NOMBRE_USUARIO      VARCHAR2(20 BYTE)  NOT NULL,
  Z11_NU_NUMERO_CAMPOS       NUMBER(22),
  Z11_DE_DESCRIPCION_ESTADO  VARCHAR2(15 BYTE)  NOT NULL,
  Z11_NU_NUM_REG_LEIDOS      NUMBER(22),
  Z11_NU_NUM_REG_BUENOS      NUMBER(22),
  Z11_NU_NUM_REG_MALOS       NUMBER(22)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z11_PROCESOS IS 'Tabla que guarda un LOG de todas las ejecuciones de validación de datos de los registros leidos en cada archivo procesado. Cada proceso tiene un conjunto de registros que se cargan en Z12.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_COD_PROCESO IS 'Codigo del Proceso. Campo autogenerado por SEQUENCE incrementado automaticamente. Identifica unicamente el proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z10_CO_CODIGO_ARCHIVO IS 'Codigo del archivo al cual pertenece el proceso. FK con Z10.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NU_NUMERO_PROCESO IS 'Numero que identifica al proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_FE_FECHA_INICIO IS 'Fecha y hora de inicio del proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_FE_FECHA_FINAL IS 'Fecha y fin del proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NO_NOMBRE_USUARIO IS 'Nombre del usuario que ejecuto el proceso. Valor ingresado por Pantalla. Uso referencial de quien ejecuta la carga.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NU_NUMERO_CAMPOS IS 'Numero de campos utilizados del archivo fisico original leido.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_DE_DESCRIPCION_ESTADO IS 'Descripcion del estado del proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NU_NUM_REG_LEIDOS IS 'Total de numero de registros leidos del archivo suministrado por el Cliente para el proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NU_NUM_REG_BUENOS IS 'Numero de registros buenos dentro del proceso. Un registro bueno es aquel que ninguno de sus campos tuvo problemas de validacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z11_PROCESOS.Z11_NU_NUM_REG_MALOS IS 'Numero de registros con problemas de validacion. Para que un registro se considere malo, basta que solo uno del total de los campos del registro tenga problemas.';


--
-- INFI_TB_Z11_PROCESOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z11_PROCESOS FOR ADM_INFI.INFI_TB_Z11_PROCESOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z11_PROCESOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z11_PROCESOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z11_PROCESOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z11_PROCESOS TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z11_PROCESOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z11_PROCESOS ADD (
  PRIMARY KEY
 (Z11_COD_PROCESO)
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
-- Foreign Key Constraints for Table INFI_TB_Z11_PROCESOS 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z11_PROCESOS ADD (
  FOREIGN KEY (Z10_CO_CODIGO_ARCHIVO) 
 REFERENCES ADM_INFI.INFI_TB_Z10_ARCHIVOS (Z10_CO_CODIGO_ARCHIVO));


