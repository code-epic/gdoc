--
-- INFI_TB_Z02_CAMPOS_MAPA  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA
(
  Z02_COD_CAMPO_MAPA          NUMBER(22)        NOT NULL,
  Z02_DES_FORMATO             VARCHAR2(50 BYTE) NOT NULL,
  Z02_NUM_LONGITUD            NUMBER(22),
  Z00_COD_MAPA                NUMBER(22)        NOT NULL,
  Z02_DE_VALIDACION_CAMPO     VARCHAR2(50 BYTE),
  Z02_NUM_POSICION_SECUENCIA  NUMBER(22)        NOT NULL,
  Z02_NO_NOMBRE_CAMPO         VARCHAR2(200 BYTE),
  Z02_DE_VALORES_LISTA        VARCHAR2(200 BYTE),
  Z02_NU_NUMERO_MAXIMO        NUMBER(22),
  Z02_NU_NUMERO_MINIMO        NUMBER(22),
  Z02_NU_MENOR_CAMPO          NUMBER(22),
  Z02_OPERADOR_CAMPO          VARCHAR2(15 BYTE),
  Z02_REQUERIDO               VARCHAR2(3 BYTE),
  Z02_OUT_CAMPO               VARCHAR2(40 BYTE),
  Z02_IN_CAMPO_CONSTANTE      NUMBER(22),
  Z02_VALOR_DEFECTO           VARCHAR2(200 BYTE),
  Z02_IN_SEQUENCE             VARCHAR2(80 BYTE)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA IS 'Tabla para definir los campos asociados a un mapa en particular. En este Mapa de Campos se definen las caracteristicas de validación de los campos, que campos se desean transformar, que campos se desean cargar finanalmente. En esta definición tambien se indica si en la transaformación de los registros el campo toma su valor de los registros o es un valor constante. Tambien se puede identificar que campos estan asociados a un SEQUENCE.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_COD_CAMPO_MAPA IS 'Codigo que identifica al Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_DES_FORMATO IS 'Descripcion de forma a utilizar para el campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NUM_LONGITUD IS 'Longitud maxima permitida para el Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z00_COD_MAPA IS 'Codigo del Mapa al cual pertenece el Campo. FK asociada a Z00.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_DE_VALIDACION_CAMPO IS 'Descripcion del Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NUM_POSICION_SECUENCIA IS 'Secuencia del Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NO_NOMBRE_CAMPO IS 'Nombre del Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_DE_VALORES_LISTA IS 'Valores permitidos dentro del Campo. Separados por coma.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NU_NUMERO_MAXIMO IS 'valor maximo que puede tener un campo numerico.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NU_NUMERO_MINIMO IS 'Valor minimo que puede tener un campo numerico.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_NU_MENOR_CAMPO IS 'Numero menor que puede tener el Campo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_OPERADOR_CAMPO IS 'Operador utilizado para validacion.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_REQUERIDO IS 'Indicador de que el campo es requerido.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_OUT_CAMPO IS 'Indica el campo de salida donde se transforma. Nombre fisico en la tabla donde se va a grabar. Usado por los procesos de transformacion y de carga final.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_IN_CAMPO_CONSTANTE IS 'Indicador de que Campo posee valor constante. Utilizado para definir campos que deben ser llenados automaticamente por proceso de transformacion. Se debe llenar el valor de Z02_VALOR DEFECTO. 1= indica que es un campo de este tipo.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_VALOR_DEFECTO IS 'Campo usado para campos con indicador de campo constate en 1 (Z02_IN_CAMPO_CONSTANTE=1). Se registra el valor constante que se desea que el proceso de transformacion asigne en la tabla intermedia';

COMMENT ON COLUMN ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA.Z02_IN_SEQUENCE IS 'Indicador de que el Campo esta relacionado con un SEQUENCE. Si este campo tiene un valor, indica que SEQUENCE se debe utilizar.';


--
-- INFI_TB_Z02_CAMPOS_MAPA  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_Z02_CAMPOS_MAPA FOR ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA;

GRANT DELETE ON  ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_Z02_CAMPOS_MAPA 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA ADD (
  PRIMARY KEY
 (Z02_COD_CAMPO_MAPA)
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
-- Foreign Key Constraints for Table INFI_TB_Z02_CAMPOS_MAPA 
-- 
ALTER TABLE ADM_INFI.INFI_TB_Z02_CAMPOS_MAPA ADD (
  FOREIGN KEY (Z00_COD_MAPA) 
 REFERENCES ADM_INFI.INFI_TB_Z00_MAPAS (Z00_COD_MAPA));


