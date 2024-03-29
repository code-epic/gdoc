--
-- INFI_TB_211_ORDENES_ADJ  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_211_ORDENES_ADJ
(
  ID_UNIDAD_INVERSION      NUMBER(7),
  NOMBRE_UNIDAD_INVERSION  VARCHAR2(100 BYTE),
  ORDENE_ID                NUMBER(10)           NOT NULL,
  ESTATUS                  VARCHAR2(20 BYTE),
  BLOTER_ID                VARCHAR2(25 BYTE),
  ORDENE_VEH_TOM           VARCHAR2(25 BYTE),
  TIPO_PRODUCTO_ID         VARCHAR2(10 BYTE),
  TIPO_PERSONA             VARCHAR2(1 BYTE)     NOT NULL,
  CEDULA_RIF               NUMBER(10)           NOT NULL,
  NOMBRE_CLIENTE           VARCHAR2(100 BYTE),
  ORDENE_FE_ORDEN          DATE,
  TRNF_TIPO                VARCHAR2(3 BYTE),
  ORDENE_ID_VEH_TOM        NUMBER(10),
  ORDENE_MONTO_PEDIDO      NUMBER(15,4)         NOT NULL,
  ORDENE_MONTO_ADJUDICADO  NUMBER(15,4)         NOT NULL,
  ORDENE_PRECIO_NEGOCIADO  NUMBER(9,4),
  BROKER                   VARCHAR2(20 BYTE),
  CONSECUTIVO              NUMBER(9),
  RIF_CONTRAPARTE          VARCHAR2(20 BYTE),
  POSEE_RECOMPRA           NUMBER(1),
  ERROR_PROCESO            VARCHAR2(1000 BYTE),
  ORDENE_ID_RELACION       NUMBER(10),
  CLIENT_ID                NUMBER(8),
  ORDENE_PED_FE_VALOR      DATE,
  ORDENE_PED_PRECIO        NUMBER(15,4),
  TRANS_ID                 VARCHAR2(25 BYTE),
  ORDENE_PED_INT_CAIDOS    NUMBER(15,4)
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

COMMENT ON TABLE ADM_INFI.INFI_TB_211_ORDENES_ADJ IS 'Contiene las ordenes que deben ser adjudicadas';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ID_UNIDAD_INVERSION IS 'Id de la unidad de inversi�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.NOMBRE_UNIDAD_INVERSION IS 'Nombre de la unidad de inversi�n';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_ID IS 'N�mero de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ESTATUS IS 'Estatus de la orden asociada al proceso';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.BLOTER_ID IS 'Id del blotter de la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_VEH_TOM IS 'Orden Id del veh�culo tomador';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.TIPO_PRODUCTO_ID IS 'Tipo de producto';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.TIPO_PERSONA IS 'Tipo de persona (V,E,J)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.CEDULA_RIF IS 'C�dula o rif del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.NOMBRE_CLIENTE IS 'Nombre del cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_FE_ORDEN IS 'Fecha de la toma de orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.TRNF_TIPO IS 'Tipo de operaci�n financiera';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_ID_VEH_TOM IS 'Id de la orden del veh�culo';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_MONTO_PEDIDO IS 'Monto solicitado por el cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_MONTO_ADJUDICADO IS 'Monto adjudicado';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ORDENE_PRECIO_NEGOCIADO IS 'Precio negociado para la orden';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.BROKER IS 'Valor del broker. Solo SITME';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.CONSECUTIVO IS 'Valor del consecutivo. Solo SITME';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.RIF_CONTRAPARTE IS 'Rif de la contraparte';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.POSEE_RECOMPRA IS 'Indicas si posee recompra (1 si) (0 no)';

COMMENT ON COLUMN ADM_INFI.INFI_TB_211_ORDENES_ADJ.ERROR_PROCESO IS 'Descripci�n del error';

