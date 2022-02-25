--
-- INFI_TB_701_TITULOS  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_701_TITULOS
(
  TITULO_ID                      VARCHAR2(25 BYTE) NOT NULL,
  CLIENT_ID                      NUMBER(8)      NOT NULL,
  TITCUS_CANTIDAD                NUMBER         NOT NULL,
  TITULO_FE_INGRESO_CUSTODIA     DATE           NOT NULL,
  TITULO_FE_ULT_COBRO_COMISION   DATE,
  TITULO_FE_ULT_PAGO_CUPON       DATE,
  TITULO_FE_ULT_AMORTIZACION     DATE,
  TITULO_MONTO_ULT_AMORTIZACION  NUMBER(15,5)   DEFAULT 0,
  TIPO_PRODUCTO_ID               VARCHAR2(10 BYTE) DEFAULT NULL NOT NULL
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

COMMENT ON TABLE ADM_INFI.INFI_TB_701_TITULOS IS 'Registro de todos los Titulos en Custodia dentro del Sistema.';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TITULO_ID IS 'Id del título';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.CLIENT_ID IS 'Id del cliente que posee el título';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TITCUS_CANTIDAD IS 'Cantidad que posee el cliente';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TITULO_FE_INGRESO_CUSTODIA IS 'Fecha en que el Título ingresa a Custodia. ';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TITULO_FE_ULT_COBRO_COMISION IS 'Fecha en que se efectuó la última ejecución de cobro de comision';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TITULO_FE_ULT_PAGO_CUPON IS 'Fecha fin de pago de cupón para el título en custodia. Se refiere a la fecha del campo INTENDDTE  de la tabla SECS de OPICS';

COMMENT ON COLUMN ADM_INFI.INFI_TB_701_TITULOS.TIPO_PRODUCTO_ID IS 'Tipo de producto asociado';

--
-- INX_701  (Index) 
--
CREATE INDEX ADM_INFI.INX_701 ON ADM_INFI.INFI_TB_701_TITULOS
(CLIENT_ID)
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
-- INFI_POSICION_GLOBAL_A_FECHA  (Trigger) 
--
CREATE OR REPLACE TRIGGER ADM_INFI."INFI_POSICION_GLOBAL_A_FECHA" 
AFTER INSERT OR UPDATE OF TITCUS_CANTIDAD ON ADM_INFI.INFI_TB_701_TITULOS FOR EACH ROW
DECLARE
   TASA_CAMBIO INFI_TB_702_TITULOS_CIERRE.tasa_cambio%type;
BEGIN
   select tcc_tasa_cambio_compra
   into   TASA_CAMBIO
  
   from infi_vi_tasa_cam_cierre_diario, (select titulo_moneda_den "MONEDA" from infi_tb_100_titulos where titulo_id=:NEW.TITULO_ID)
   --from copy_vi_tasa_cam_cierre_diario, (select titulo_moneda_den "MONEDA" from infi_tb_100_titulos where titulo_id=:NEW.TITULO_ID)  --SE COMENTA DEBIDO A QUE RENTABILIDAD ESTA CAIDO
   where tcc_codigo_divisa ="MONEDA";

   UPDATE INFI_TB_702_TITULOS_CIERRE tc
   SET tc.TITCUS_CANTIDAD = :NEW.TITCUS_CANTIDAD,tc.TASA_CAMBIO = TASA_CAMBIO
   WHERE tc.TITULO_ID = :NEW.TITULO_ID
   AND   tc.CLIENT_ID = :NEW.CLIENT_ID
   AND   trunc(tc.FECHA_CIERRE) = trunc(sysdate)
   AND   tc.TIPO_PRODUCTO_ID = :NEW.TIPO_PRODUCTO_ID;
   IF sql%notfound THEN
       INSERT INTO INFI_TB_702_TITULOS_CIERRE (TITULO_ID,CLIENT_ID,FECHA_CIERRE,TITCUS_CANTIDAD,TASA_CAMBIO,TIPO_PRODUCTO_ID) VALUES (:NEW.TITULO_ID,:NEW.CLIENT_ID,SYSDATE,:NEW.TITCUS_CANTIDAD,TASA_CAMBIO,:NEW.TIPO_PRODUCTO_ID);
   END IF;
END INFI_POSICION_GLOBAL_A_FECHA;
/
SHOW ERRORS;


--
-- INFI_POSICION_RECONVERTIDO  (Trigger) 
--
CREATE OR REPLACE TRIGGER ADM_INFI.INFI_POSICION_RECONVERTIDO
BEFORE UPDATE
OF TITCUS_CANTIDAD
  ,TITULO_FE_INGRESO_CUSTODIA
ON ADM_INFI.INFI_TB_701_TITULOS 
REFERENCING NEW AS NEW OLD AS OLD
FOR EACH ROW
DECLARE

cantidadCusodiaAnterior  INFI_TB_701_TITULOS.TITCUS_CANTIDAD%type := 0;
fecha_custodia           INFI_TB_701_TITULOS.TITULO_FE_INGRESO_CUSTODIA%type;
/******************************************************************************
   NAME:       INFI_POSICION_RECONVERTIDO
   PURPOSE:    
                                                                  -
   REVISIONS:
   Ver        Date        Author           Description
   ---------  ----------  ---------------  ------------------------------------
   1.0        21/01/2019             1. Created this trigger.

   NOTES:

   Automatically available Auto Replace Keywords:
      Object Name:     INFI_POSICION_RECONVERTIDO
      Sysdate:         21/01/2019
      Date and Time:   21/01/2019, 04:47:08 p.m., and 21/01/2019 04:47:08 p.m.
      Username:         NM11383
      Table Name:      INFI_TB_701_TITULOS 
      Trigger Options:  Manejo de los valores de Posición reconvertidos 
******************************************************************************/
BEGIN
--- Se busca la fecha del ultimo movimiento en custoidia
--- que tenga posición para el cliente ,título y tipo

    if fechaPosicionCutodia(:NEW.CLIENT_ID,:NEW.TITULO_ID,:NEW.TIPO_PRODUCTO_ID) <  TO_DATE(ADM_INFI.FVJ8ODIV0 ('BFE_FECHA_VIGENCIA'),'YYYYMMDD') then
    --- Se debe reconvertir en valor anterior ya que se esta
    --- agregando una nueva posiciójn posterior a la fecha 
    --- de Reconversión de 20082018     
        cantidadCusodiaAnterior := (:OLD.TITCUS_CANTIDAD/10000);
        :NEW.TITCUS_CANTIDAD := (:NEW.TITCUS_CANTIDAD - :OLD.TITCUS_CANTIDAD) + cantidadCusodiaAnterior;
    end if;       
   EXCEPTION
     WHEN OTHERS THEN
       -- Consider logging the error and then re-raise
       RAISE_APPLICATION_ERROR(-20001,'Cantidad Convertida='||cantidadCusodiaAnterior||'   Cantidad NEW='||:NEW.TITCUS_CANTIDAD||'   Cantidad old='||:OLD.TITCUS_CANTIDAD||'    The Trigger INFI_POSICION_RECONVERTIDO de la Tabla INFI_TB_701_TITULOS FAILED'||' OTHERS ERROR '||SQLERRM);
END INFI_POSICION_RECONVERTIDO;
/
SHOW ERRORS;


--
-- INFI_TB_701_TITULOS  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_701_TITULOS FOR ADM_INFI.INFI_TB_701_TITULOS;

GRANT DELETE ON  ADM_INFI.INFI_TB_701_TITULOS TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_701_TITULOS TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_701_TITULOS TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_701_TITULOS TO USU_INFI;

