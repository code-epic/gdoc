--
-- INFI_TB_204_ORDENES  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_204_ORDENES
(
  ORDENE_ID                      NUMBER(10)     NOT NULL,
  UNIINV_ID                      NUMBER(7),
  CLIENT_ID                      NUMBER(8)      NOT NULL,
  ORDSTA_ID                      VARCHAR2(25 BYTE) NOT NULL,
  SISTEMA_ID                     VARCHAR2(10 BYTE),
  EMPRES_ID                      VARCHAR2(25 BYTE),
  CONTRAPARTE                    VARCHAR2(50 BYTE),
  TRANSA_ID                      VARCHAR2(25 BYTE) NOT NULL,
  ENVIADO                        NUMBER(1),
  ORDENE_CTE_SEG_BCO             VARCHAR2(50 BYTE),
  ORDENE_CTE_SEG_SEG             VARCHAR2(50 BYTE),
  ORDENE_CTE_SEG_SUB             VARCHAR2(50 BYTE),
  ORDENE_CTE_SEG_INFI            VARCHAR2(50 BYTE),
  ORDENE_PED_FE_ORDEN            DATE           NOT NULL,
  ORDENE_PED_FE_VALOR            DATE           NOT NULL,
  ORDENE_PED_MONTO               NUMBER(19,4),
  ORDENE_PED_TOTAL_PEND          NUMBER(19,4),
  ORDENE_PED_TOTAL               NUMBER(19,4),
  ORDENE_PED_INT_CAIDOS          NUMBER(15,4),
  BLOTER_ID                      VARCHAR2(25 BYTE),
  ORDENE_PED_CTA_BSNRO           VARCHAR2(20 BYTE),
  ORDENE_PED_CTA_BSTIP           VARCHAR2(20 BYTE),
  CTECTA_NUMERO                  VARCHAR2(50 BYTE),
  ORDENE_PED_PRECIO              NUMBER(15,4),
  ORDENE_PED_RENDIMIENTO         NUMBER(15,5),
  ORDENE_PED_IN_BDV              NUMBER(1)      NOT NULL,
  MONEDA_ID                      VARCHAR2(3 BYTE),
  ORDENE_PED_RCP_PRECIO          NUMBER(15,4),
  ORDENE_ADJ_MONTO               NUMBER(19,4),
  ORDENE_USR_NOMBRE              VARCHAR2(50 BYTE),
  ORDENE_USR_CEN_CONTABLE        VARCHAR2(50 BYTE),
  ORDENE_USR_SUCURSAL            VARCHAR2(50 BYTE),
  ORDENE_USR_TERMINAL            VARCHAR2(50 BYTE),
  ORDENE_VEH_TOM                 VARCHAR2(25 BYTE),
  ORDENE_VEH_COL                 VARCHAR2(25 BYTE),
  ORDENE_VEH_REC                 VARCHAR2(25 BYTE),
  ORDENE_EJEC_ID                 NUMBER(10),
  ORDENE_FE_ULT_ACT              DATE,
  ORDENE_PED_COMISIONES          NUMBER(15,4),
  ORDENE_FECHA_ADJUDICACION      DATE,
  ORDENE_FECHA_LIQUIDACION       DATE,
  ORDENE_FECHA_CUSTODIA          DATE,
  ORDENE_FINANCIADO              NUMBER(1),
  ID_OPICS                       NUMBER(8),
  EJECUCION_ID                   NUMBER(10),
  ORDENE_COMISION_EMISOR         NUMBER(5,2),
  ORDENE_TASA_POOL               NUMBER(10,4),
  ORDENE_GANANCIA_RED            NUMBER(5,2),
  ORDENE_COMISION_OFICINA        NUMBER(12,2),
  ORDENE_COMISION_OPERACION      NUMBER(12,2),
  ORDENE_OPERAC_PEND             NUMBER(1)      DEFAULT 0,
  ORDENE_FE_CANCELACION          DATE,
  ORDENE_ID_RELACION             NUMBER(10),
  ORDENE_TASA_CAMBIO             NUMBER(15,6),
  SECTOR_ID                      NUMBER(5),
  CODIGO_ID                      NUMBER(5),
  CONCEPTO_ID                    NUMBER(5),
  ORDENE_OBSERVACION             VARCHAR2(800 BYTE),
  TIPO_PRODUCTO_ID               VARCHAR2(10 BYTE),
  NUMERO_GRUPO                   NUMBER(2),
  CTA_ABONO                      NUMBER(1),
  ORDENE_ESTATUS_BCV             NUMBER(1)      DEFAULT 0                     NOT NULL,
  ORDENE_ID_BCV                  VARCHAR2(20 BYTE) DEFAULT 0 NOT NULL,
  ORDENE_PED_PORC_COMISION_IGTF  NUMBER(15,4)   DEFAULT 0,
  ORDENE_PED_COMISION_IGTF       NUMBER(15,4)   DEFAULT 0
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

COMMENT ON TABLE ADM_INFI.INFI_TB_204_ORDENES IS 'Es el registro de lo que pasa en una transacción. Toda transacción genera una orden por cliente.
Los campos de la tabla deben ser interpretados en base a la transacción que se está efectuando, por ejemplo si es una de toma de ordenes en el campo ORDENE_PED_TOTAL será el total a pagar.
Si es una de venta este campo reflejará el total expresado en montos que se desea vender.
Si es un pago de cupones debe entenderse como el total que se le va a cancelar al cliente.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_GANANCIA_RED IS 'Porcentaje de ganancia que obtiene la red por la venta de instrumentos de tipo inventario. Para mercado primario es el porcentaje definido a nivel de blotter rangos por tipo de persona. Cuando es mercado secundario es precio final operacion (pool) - precio venta valores (precio de compra)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_COMISION_OFICINA IS 'Comisión que se gana la oficina por la venta. Es la multiplicación de comision emiror * ganancia de red / 100';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_COMISION_OPERACION IS 'Comisión total de la operación (Valor nominal * comision oficina * plazo) / base de cálculo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_OPERAC_PEND IS 'Indica si la orden posee operaciones pendientes 1=si 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_ID_RELACION IS 'Id que indica el número de orden con la que esta relacionada esta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.SECTOR_ID IS 'Referencia al sector_id de infi_tb_048_sector_productivo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.CODIGO_ID IS 'Referencia al codigo_id de infi_tb_049_actividad';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.CONCEPTO_ID IS 'Referencia al codigo_id de infi_tb_050_conceptos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_OBSERVACION IS 'Campo para almacenar observaciones relacionadas a la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.NUMERO_GRUPO IS 'Número de grupo al que pertenece la orden. Es usado en el proceso de liquidación';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_ID IS 'Id de la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.UNIINV_ID IS 'Id de la unidad de inversión';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.CLIENT_ID IS 'Id del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDSTA_ID IS 'Status de la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.SISTEMA_ID IS 'Id del sistema a donde debe ser enviada la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.EMPRES_ID IS 'ID del Depositario Central del Título.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.CONTRAPARTE IS 'Indica la contraparte en el momento de la venta';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.TRANSA_ID IS 'Id de la transacción';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ENVIADO IS 'Indica si la orden fue enviada en los archivos que necesita el BCV. 1=si, 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_CTE_SEG_BCO IS 'Segmento de ALTAIR que tenia el Cliente asignado en el momento de la toma de orden. Porción de Banca.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_CTE_SEG_SEG IS 'Segmento de ALTAIR que tenia el Cliente asignado en el momento de la toma de orden. Porción de Segmento.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_CTE_SEG_SUB IS 'Segmento de ALTAIR que tenia el Cliente asignado en el momento de la toma de orden. Porción de SubSegmento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_CTE_SEG_INFI IS 'Segmento de INFI que tenia el Cliente asignado en el momento de la toma de orden.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_FE_ORDEN IS 'Fecha en la que se agregó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_FE_VALOR IS 'Fecha Valor de la Transacción.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_MONTO IS 'Monto pedido para la compra de títulos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_TOTAL_PEND IS 'Monto total pendiente por cobrar';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_TOTAL IS 'Monto total de la orden. Aplica la suma de comisiones';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_INT_CAIDOS IS 'El monto total de los intereses caidos';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.BLOTER_ID IS 'Id de bloter';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_CTA_BSNRO IS 'Numero de Cuenta para la aplicación de la Transacción Financiera.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_CTA_BSTIP IS 'Tipo de cuenta, para la aplicación de la Transacción Financiera.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.CTECTA_NUMERO IS 'Número de cuenta del cliente que se va a usar para la operación, si la misma es a través de SWIFT.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_PRECIO IS 'Precio ofrecido para la Compra.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_RENDIMIENTO IS 'Rendimiento.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_IN_BDV IS 'Indicador para referirise a compra para cartera propia de BDV. 1=si, 0=no';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.MONEDA_ID IS 'Id de la moneda';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_RCP_PRECIO IS 'Precio para el pacto de Recompra.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_ADJ_MONTO IS 'Monto adjudicado. Siempre debe ser menor o igual al monto pedido';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_USR_NOMBRE IS 'Nombre del usuario que tomó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_USR_CEN_CONTABLE IS 'Centro contable al que pertenece el usuario que tomó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_USR_SUCURSAL IS 'Sucursal del usuario que tomó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_USR_TERMINAL IS 'Terminal del usuario que tomó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_VEH_TOM IS 'Vehículo tomador';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_VEH_COL IS 'Vehículo colocador';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_VEH_REC IS 'Vehículo recompra';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_EJEC_ID IS 'Id de ejecución. Si varias ordenes tienen el mismo ID identifica que fueron generadas por un mismo proceso.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_FE_ULT_ACT IS 'Fecha de última actualización';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_COMISIONES IS 'Monto total de las comisiones que se aplican sobre la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_FECHA_ADJUDICACION IS 'Fecha en que se adjudico';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_FECHA_LIQUIDACION IS 'Fecha en que se liquidó la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_FECHA_CUSTODIA IS 'Fecha en que paso a custodia';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_FINANCIADO IS 'Porcentaje de financiamiento';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ID_OPICS IS 'Indica el id correspondiente a la generacion del registro que se envia a OPICS. Este id indica que la orden fue incorporada en un determinado registro';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_COMISION_EMISOR IS 'Porcentaje de comisión que se gana una oficina por la venta de títulos en mercado primario. Solo aplica a unidades de inversión de tipo inventario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_TASA_POOL IS 'Tasa pool ofrecida en la definición de la unidad de inversión. Solo cuando es de tipo inventario y de mercado secundario';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_ESTATUS_BCV IS '0 = Sin Verificar, 1 = Enviada y Aprobada por BCV, 2 = Enviada y Rechazada por BCV';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_ID_BCV IS 'Guarda la referencia interna suministrada por el BCV';

COMMENT ON COLUMN ADM_INFI.INFI_TB_204_ORDENES.ORDENE_PED_PORC_COMISION_IGTF IS 'Monto de comision por concepto de IGTF (Impuesto a Grandes Transacciones Financieras';

--
-- IDX_TRANSA_ID  (Index) 
--
CREATE INDEX ADM_INFI.IDX_TRANSA_ID ON ADM_INFI.INFI_TB_204_ORDENES
(TRANSA_ID)
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
-- IDX_ORDENE_PED_FE_ORDEN  (Index) 
--
CREATE INDEX ADM_INFI.IDX_ORDENE_PED_FE_ORDEN ON ADM_INFI.INFI_TB_204_ORDENES
(ORDENE_PED_FE_ORDEN)
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
-- INDX_204_UNIINV  (Index) 
--
CREATE INDEX ADM_INFI.INDX_204_UNIINV ON ADM_INFI.INFI_TB_204_ORDENES
(UNIINV_ID)
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
-- INX_204_RELACION  (Index) 
--
CREATE INDEX ADM_INFI.INX_204_RELACION ON ADM_INFI.INFI_TB_204_ORDENES
(ORDENE_ID_RELACION)
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
-- INFI_TB_204_ORDENES  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_204_ORDENES FOR ADM_INFI.INFI_TB_204_ORDENES;

GRANT DELETE ON  ADM_INFI.INFI_TB_204_ORDENES TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_204_ORDENES TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_204_ORDENES TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_204_ORDENES TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_204_ORDENES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  PRIMARY KEY
 (ORDENE_ID)
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
-- Foreign Key Constraints for Table INFI_TB_204_ORDENES 
-- 
ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_012 
 FOREIGN KEY (TRANSA_ID) 
 REFERENCES ADM_INFI.INFI_TB_012_TRANSACCIONES (TRANSA_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_016 
 FOREIGN KEY (EMPRES_ID) 
 REFERENCES ADM_INFI.INFI_TB_016_EMPRESAS (EMPRES_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_018_1 
 FOREIGN KEY (ORDENE_VEH_TOM) 
 REFERENCES ADM_INFI.INFI_TB_018_VEHICULOS (VEHICU_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_018_2 
 FOREIGN KEY (ORDENE_VEH_COL) 
 REFERENCES ADM_INFI.INFI_TB_018_VEHICULOS (VEHICU_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_018_3 
 FOREIGN KEY (ORDENE_VEH_REC) 
 REFERENCES ADM_INFI.INFI_TB_018_VEHICULOS (VEHICU_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_102 
 FOREIGN KEY (BLOTER_ID) 
 REFERENCES ADM_INFI.INFI_TB_102_BLOTER (BLOTER_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_019 
 FOREIGN KEY (TIPO_PRODUCTO_ID) 
 REFERENCES ADM_INFI.INFI_TB_019_TIPO_DE_PRODUCTO (TIPO_PRODUCTO_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_203 
 FOREIGN KEY (ORDSTA_ID) 
 REFERENCES ADM_INFI.INFI_TB_203_ORDENES_STATUS (ORDSTA_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_CONCEPTO 
 FOREIGN KEY (CONCEPTO_ID) 
 REFERENCES ADM_INFI.INFI_TB_050_CONCEPTOS (CODIGO_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_ACTIVIDAD 
 FOREIGN KEY (CODIGO_ID) 
 REFERENCES ADM_INFI.INFI_TB_049_ACTIVIDAD (CODIGO_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_SECTOR 
 FOREIGN KEY (SECTOR_ID) 
 REFERENCES ADM_INFI.INFI_TB_048_SECTOR_PRODUCTIVO (SECTOR_ID));

ALTER TABLE ADM_INFI.INFI_TB_204_ORDENES ADD (
  CONSTRAINT FK_204_201 
 FOREIGN KEY (CLIENT_ID) 
 REFERENCES ADM_INFI.INFI_TB_201_CTES (CLIENT_ID));


