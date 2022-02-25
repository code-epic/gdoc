--
-- INFI_TB_106_UNIDAD_INVERSION  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION
(
  UNDINV_ID                    NUMBER(7)        NOT NULL,
  UNDINV_NOMBRE                VARCHAR2(100 BYTE) NOT NULL,
  UNDINV_DESCRIPCION           VARCHAR2(200 BYTE),
  INSFIN_ID                    VARCHAR2(50 BYTE) NOT NULL,
  UNDINV_EMISION               VARCHAR2(50 BYTE),
  UNDINV_SERIE                 VARCHAR2(50 BYTE),
  UNDINV_TASA_CAMBIO           NUMBER(15,6)     NOT NULL,
  UNDINV_FE_EMISION            DATE             NOT NULL,
  UNDINV_IN_VTA_EMPLEADOS      NUMBER(1)        NOT NULL,
  TPPEVA_ID                    VARCHAR2(25 BYTE) NOT NULL,
  UNDINV_PRECIO_MINIMO         NUMBER(5,2),
  UNDINV_COMENTARIOS           VARCHAR2(400 BYTE),
  UNDINV_DOC_BDV               CLOB,
  UNDINV_DOC_EMISOR            CLOB,
  UNDINV_FE_ADJUDICACION       DATE,
  UNDINV_FE_LIQUIDACION        DATE,
  UNDINV_FE_CIERRE             DATE             NOT NULL,
  UNDINV_IN_RECOMPRA_NETEO     NUMBER(1)        NOT NULL,
  MONEDA_ID                    VARCHAR2(3 BYTE) NOT NULL,
  UNDINV_UMI_INV_TOTAL         NUMBER,
  UNDINV_UMI_INV_MTO_MIN       NUMBER,
  UNDINV_UMI_INV_MTO_MAX       NUMBER,
  UNDINV_UMI_UM_CANT_MIN       NUMBER,
  UNDINV_UMI_UM_CANT_MAX       NUMBER,
  UNDINV_STATUS                VARCHAR2(50 BYTE),
  AUT_USUARIO_USERID           VARCHAR2(25 BYTE),
  AUT_USUARIO_NOMBRE           VARCHAR2(50 BYTE),
  AUT_USUARIO_ROL_NOMBRE       VARCHAR2(50 BYTE),
  AUT_ESTACION                 VARCHAR2(50 BYTE),
  AUT_IP                       VARCHAR2(50 BYTE),
  AUT_FECHA                    DATE,
  UPD_USUARIO_USERID           VARCHAR2(25 BYTE),
  UPD_USUARIO_NOMBRE           VARCHAR2(50 BYTE),
  UPD_USUARIO_ROL_NOMBRE       VARCHAR2(50 BYTE),
  UPD_ESTACION                 VARCHAR2(50 BYTE),
  UPD_IP                       VARCHAR2(50 BYTE),
  UPD_FECHA                    DATE,
  EMPRES_ID                    VARCHAR2(25 BYTE),
  UNDINV_UMI_INV_DISPONIBLE    NUMBER,
  UNDINV_UMI_UNIDAD            NUMBER(14,4),
  UNDINV_PCT_MAX_FINAN         NUMBER(5,2),
  UNDINV_PRECIO_MAXIMO         NUMBER(5,2),
  UNDINV_MULTIPLOS             NUMBER,
  UNDINV_IN_PEDIDO_MONTO       NUMBER(1)        NOT NULL,
  UNDINV_TASA_POOL             NUMBER(8,4),
  UNDINV_RENDIMIENTO           NUMBER(5,2),
  UNDINV_MERCADO               VARCHAR2(10 BYTE),
  UNDINV_IN_PRECIO_SUCIO       NUMBER(1),
  UNDINV_FE_LIQUIDACION_HORA1  DATE,
  UNDINV_FE_LIQUIDACION_HORA2  DATE,
  PAGO_IN_BCV                  VARCHAR2(1 BYTE),
  IN_COBRO_BATCH_ADJ           NUMBER(1)        DEFAULT 1,
  IN_COBRO_BATCH_LIQ           NUMBER(1)        DEFAULT 1,
  DIAS_APERTURA_CUENTA         NUMBER(3)        DEFAULT 90                    NOT NULL,
  INDC_PERMITE_CANCELACION     NUMBER(1)        DEFAULT 1                     NOT NULL,
  UNDINV_ACTIVE                NUMBER(1)        DEFAULT 0,
  UNDINV_STATUS_CONCILIACION   NUMBER(1)        DEFAULT 0                     NOT NULL,
  MONTO_EXPRESS                NUMBER(8,5)      DEFAULT 0                     NOT NULL,
  MONTO_ACUMULADO_SOLIC        NUMBER(20,7)     DEFAULT 0,
  TIPO_NEGOCIO                 NUMBER(1)        DEFAULT 0                     NOT NULL,
  NRO_JORNADA                  VARCHAR2(20 BYTE),
  UNDINV_PERIODO_VENTA         NUMBER(4)        DEFAULT 0                     NOT NULL,
  UNDINV_MULTIPLOS_EFECTIVO    NUMBER           DEFAULT 0                     NOT NULL,
  UNDINV_UMAX_UNIDAD           NUMBER(14,4)     DEFAULT 0                     NOT NULL,
  UNDINV_TASA_CAMBIO_OFER      NUMBER(15,6),
  COMISION_IGTF                NUMBER(8,4)      DEFAULT 0,
  TIPO_SOLICITUD               NUMBER(1)        DEFAULT 0,
  CONTROL_DES                  NUMBER(1)        DEFAULT 1
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
LOB (UNDINV_DOC_EMISOR) STORE AS 
      ( TABLESPACE  DATA 
        ENABLE      STORAGE IN ROW
        CHUNK       8192
        PCTVERSION  10
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
  LOB (UNDINV_DOC_BDV) STORE AS 
      ( TABLESPACE  DATA 
        ENABLE      STORAGE IN ROW
        CHUNK       8192
        PCTVERSION  10
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

COMMENT ON TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION IS 'Todas las entidades necesarias para manejar 
la información de las Unidades de Inversión, sus  
titulos asociados, empresas, indicadores de cotejo, etc. 
todo proceso requiere de la definición de una Unidad de Inversion 
Depende del Tipo de Instrumento Financiero, contendrá un titulo 
o "N" titulos 
Cada UI puede tener una empresa relacionada con un rol en  
particular (emisor, agente colocador, etc). Una empresa  
puede tener mas de un rol en la UI 
La UI puede tener uno o mas Indicadores de Cotejo relacionados (estos 
seran utilizado al momento de la toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_PERIODO_VENTA IS 'Indica tiempo en dias para la periocidad de venta a los clientes de divisas. 0 = No aplica.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_MULTIPLOS_EFECTIVO IS 'Indica los multiplos de inversion que puede efectuar un cliente para la compra divsas en efectivo. 0 = No aplica.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMAX_UNIDAD IS 'Indica  el monto maximo de una orden para la unidad de inversion. 0 = No aplica. Valor por defecto 0';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_TASA_CAMBIO_OFER IS 'Tasa de Cambio para la oferta, que aplica al proceso de la Toma de Ordenes de la Unidad de Inversión. Esta tasa solo aplica durante el proceso de Venta, desde la Toma de Orden, hasta la Liquidación de la Orden. Para eventos futuros como Pago de Cupones, Pago de Capital, etc, se toma la Tasa que este vigente para ese momento.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.COMISION_IGTF IS 'Campo que contiene el procentaje de comision a cobrar por concepto de IGTF (Impuesto Grandes Transacciones Financieras)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.TIPO_SOLICITUD IS 'Indica tipo de solicitud que puede recibir la unidad de inversion 0=demanda, 1=oferta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_ID IS 'Id de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_NOMBRE IS 'Nombre de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_DESCRIPCION IS 'Descripción de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.INSFIN_ID IS 'Id del instrumento financiero. FK CON TB014.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_EMISION IS 'Define la Emisión a la cual se refiere la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_SERIE IS 'Define la Serie a la cual se refiere la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_TASA_CAMBIO IS 'Tasa de Cambio que aplica al proceso de la Toma de Ordenes de la Unidad de Inversión. Esta tasa solo aplica durante el proceso de Venta, desde la Toma de Orden, hasta la Liquidación de la Orden. Para eventos futuros como Pago de Cupones, Pago de Capital, etc, se toma la Tasa que este vigente para ese momento.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_EMISION IS 'Fecha de Emisión de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_IN_VTA_EMPLEADOS IS 'Indicador que define si se permite venta a Empleados y Contratados de BDV o no. 1=Indica que SI se permite. 0=Indica que NO se permite. El proceso de Toma de Orden, verifica el Tipo de Persona + Cedula en ALTAIR y en la TB030 para validar que no sea un Empleado o Contratado quien esta colocando la orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.TPPEVA_ID IS 'ID del Tipo de persona válido. FK con TBXXX.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_PRECIO_MINIMO IS 'Precio mínimo que se puede ofrecer en la toma de una orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_COMENTARIOS IS 'Comentarios relativos a la Unidad de Inversión de interes para los usuarios de la Red.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_DOC_BDV IS 'Registra un archivo electronico con información preparada por Banco de Venezuela sobre las condiciones y caracteristicas de la Unidad de Inversión. Este documento se permite ver, a través de la Consulta de la Unidad de Inversión, o en la Toma de Orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_DOC_EMISOR IS 'Registra un archivo electronico con información (Prospecto) del Emisor sobre las condiciones y caracteristicas de la Unidad de Inversión. Este documento se permite ver, a través de la Consulta de la Unidad de Inversión, o en la Toma de Orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_ADJUDICACION IS 'Fecha de Adjudicación indicada por el Emisor al momento de Publicar la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_LIQUIDACION IS 'Fecha de Liquidación indicada por el Emisor al momento de Publicar la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_CIERRE IS 'Fecha de Cierre. Fecha de uso interno por INFI, para procesos futuros (V2 o superior) que permitan revisar si luego de esta fecha todavia hay ordenes que no se han cobrados en su totalidad. Usualmente debe ser una cantidad de días posterior a la fecha de liquidación.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_IN_RECOMPRA_NETEO IS 'Indicador que establece, cuando hay pacto de recompra, si se deben netear las transacciones.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.MONEDA_ID IS 'Id de moneda de negociación de la Unidad de Inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_INV_TOTAL IS 'Unidad Mínima de Inversión. Aplica cuanto es INVENTARIO. Define el total de Inventario disponible para la Venta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_INV_MTO_MIN IS 'Unidad Mínima de Inversión. Aplica cuanto es INVENTARIO. NO aplica cuando es SUBASTA.  Define el monto mínimo que debe tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_INV_MTO_MAX IS 'Unidad Minima de Inversión. Aplica cuanto es INVENTARIO. NO aplica cuando es SUBASTA.  Define el monto máximo que puede tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_UM_CANT_MIN IS 'Unidad Mínima de Inversión. Aplica cuanto es SUBASTA. NO aplica cuando es INVENTARIO.  Define la cantidad mínima de Unidades de Inversión debe tener una orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_UM_CANT_MAX IS 'Unidad Mínima de Inversión. Aplica cuanto es SUBASTA. NO aplica cuando es INVENTARIO.  Define la cantidad máxima de Unidades de Inversión puede tener una orden..';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_STATUS IS 'ID del Status de la Unidad de Inversión. FK con TBNNN.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_USUARIO_USERID IS 'Valores de Auditoria. Userid del usuario que autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_USUARIO_NOMBRE IS 'Valores de Auditoria. Nombre del usuario que autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_USUARIO_ROL_NOMBRE IS 'Valores de Auditoria. ROL del usuario que autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_ESTACION IS 'Valores de Auditoria. Estación donde el usuario autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_IP IS 'Valores de Auditoria. Dirección TCP/IP  del equipo, donde el usuario autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.AUT_FECHA IS 'Valores de Auditoria. Fecha cuando el usuario autorizó la Publicación de la Unidad de Inversión.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_USUARIO_USERID IS 'Valores de Auditoria. Userid del ultimo usuario que actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_USUARIO_NOMBRE IS 'Valores de Auditoria. Nombre del ultimo usuario que actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_USUARIO_ROL_NOMBRE IS 'Valores de Auditoria. ROL del ultimo usuario que actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_ESTACION IS 'Valores de Auditoria. Estación donde el ultimo usuario que actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_IP IS 'Valores de Auditoria. Dirección TCP/IP  del equipo, donde el ultimo usuario que actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UPD_FECHA IS 'Valores de Auditoria. Fecha cuando el ultimo usuario , actualizó el registro.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.EMPRES_ID IS 'Identifica la Empresa que funge de Emisor de la Unidad de Inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_INV_DISPONIBLE IS 'Unidad Minima de Inversión. Aplica cuanto es INVENTARIO. Define el total de Inventario disponible a la fecha.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_UMI_UNIDAD IS 'Valor que representa la Unidad Minima de Inversion que debe ser adquirida por el Comprador en la Orden. Aplica solo cuando es subasta. No aplica para cuando es Inventario. ';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_PCT_MAX_FINAN IS 'Porcentaje máximo de financiamiento. Si es 0 indica que no permite financiamiento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_PRECIO_MAXIMO IS 'Precio máximo que se puede ofrecer en la toma de una orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_MULTIPLOS IS 'Indica los multiplos de inversión que puede efectuar un cliente para la compra de los títulos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_IN_PEDIDO_MONTO IS 'Indicador para informar si en la toma de orden se pide por monto. De no estar encendido se debe pedir por cantidad de unidad en la toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_TASA_POOL IS 'Tasa pool definida cuando el instrumento a vender sea de inventario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_RENDIMIENTO IS 'Rendimiento establecido para el cálculo del precio de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_MERCADO IS 'Indica el tipo de mercado. Mercado primario y mercado secundario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_IN_PRECIO_SUCIO IS 'Indicador de precio sucio, si es 1 el sistema debe obviar los cálculos del intereses caídos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_LIQUIDACION_HORA1 IS 'Fecha de liquidación a ejecutar de forma automática en esta primera hora';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_FE_LIQUIDACION_HORA2 IS 'Fecha de liquidación a ejecutar de forma automática en esta segunda hora';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.PAGO_IN_BCV IS 'Indica si el pago fue efectuado al Banco Central de Venezuela 1=si, 0=no null no se ha ejecutado el proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.IN_COBRO_BATCH_ADJ IS 'Indicador de cobro de adjudicación en batch';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.IN_COBRO_BATCH_LIQ IS 'Indicador de cobro de liquidación en batch';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.DIAS_APERTURA_CUENTA IS 'Días de apertura de la Cuenta del Cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.INDC_PERMITE_CANCELACION IS 'Indica si se permite la cancelacion de las ordenes de la unidad de inversion';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.UNDINV_ACTIVE IS 'Indicador si la unidad de inversion se encuentra activa';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.MONTO_ACUMULADO_SOLIC IS 'Monto acumulado de las solicitudes de la unidad de inversion (aplica para SIMADI)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.TIPO_NEGOCIO IS 'Indicador del tipo de valor que maneja el negocio SIMADI 0 N/A 1 Alto Valor 2 Bajo Valor';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.MONTO_EXPRESS IS 'Monto express para el mercado cambiario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_106_UNIDAD_INVERSION.CONTROL_DES IS 'INDICA SI EL REGISTRO PUEDE SER DESBLOQUEADO LUEGO DE RECIBIR LA RESPUESTA DE DICOM';

--
-- IDX_TIPO_NEGOCIO  (Index) 
--
CREATE INDEX ADM_INFI.IDX_TIPO_NEGOCIO ON ADM_INFI.INFI_TB_106_UNIDAD_INVERSION
(TIPO_NEGOCIO)
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
-- PK_106  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_106 ON ADM_INFI.INFI_TB_106_UNIDAD_INVERSION
(UNDINV_ID)
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
-- I_106_UNDINV_STATUS  (Index) 
--
CREATE INDEX ADM_INFI.I_106_UNDINV_STATUS ON ADM_INFI.INFI_TB_106_UNIDAD_INVERSION
(UNDINV_STATUS)
LOGGING
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
NOPARALLEL;

--
-- INFI_TB_106_UNIDAD_INVERSION  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_106_UNIDAD_INVERSION FOR ADM_INFI.INFI_TB_106_UNIDAD_INVERSION;

GRANT DELETE ON  ADM_INFI.INFI_TB_106_UNIDAD_INVERSION TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_106_UNIDAD_INVERSION TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_106_UNIDAD_INVERSION TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_106_UNIDAD_INVERSION TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_106_UNIDAD_INVERSION 
-- 
ALTER TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION ADD (
  CONSTRAINT PK_106
 PRIMARY KEY
 (UNDINV_ID)
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
-- Foreign Key Constraints for Table INFI_TB_106_UNIDAD_INVERSION 
-- 
ALTER TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION ADD (
  CONSTRAINT FK_106_016 
 FOREIGN KEY (EMPRES_ID) 
 REFERENCES ADM_INFI.INFI_TB_016_EMPRESAS (EMPRES_ID));

ALTER TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION ADD (
  CONSTRAINT FK_106_101 
 FOREIGN KEY (INSFIN_ID) 
 REFERENCES ADM_INFI.INFI_TB_101_INST_FINANCIEROS (INSFIN_ID));

ALTER TABLE ADM_INFI.INFI_TB_106_UNIDAD_INVERSION ADD (
  CONSTRAINT FK_106_117 
 FOREIGN KEY (UNDINV_STATUS) 
 REFERENCES ADM_INFI.INFI_TB_117_UNDINV_STATUS (UNDINV_STATUS));


