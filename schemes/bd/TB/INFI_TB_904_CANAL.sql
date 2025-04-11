--
-- INFI_TB_904_CANAL  (Table) 
--
CREATE TABLE ADM_INFI.INFI_TB_904_CANAL
(
  CODIGO_CANAL  VARCHAR2(4 BYTE)                NOT NULL,
  NOMBRE_CANAL  VARCHAR2(25 BYTE)               NOT NULL,
  ACTIVO        NUMBER(1)                       NOT NULL,
  CANAL_ID      NUMBER(8)                       NOT NULL
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

COMMENT ON COLUMN ADM_INFI.INFI_TB_904_CANAL.CODIGO_CANAL IS 'Código del canal';

COMMENT ON COLUMN ADM_INFI.INFI_TB_904_CANAL.NOMBRE_CANAL IS 'Nombre del canal';

COMMENT ON COLUMN ADM_INFI.INFI_TB_904_CANAL.ACTIVO IS '0=inactivo, 1=activo';

--
-- PK_904_2  (Index) 
--
CREATE UNIQUE INDEX ADM_INFI.PK_904_2 ON ADM_INFI.INFI_TB_904_CANAL
(CANAL_ID)
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
-- INFI_AGREGAR_MENSAJES_CANAL  (Trigger) 
--
CREATE OR REPLACE TRIGGER ADM_INFI."INFI_AGREGAR_MENSAJES_CANAL" 
-- Generated 16/05/2011
-- Creado por : Nelson Visbal
--Agrega los mensajes por defecto que deben estar presente en todos los canales para la toma de Orden---
AFTER INSERT ON ADM_INFI.INFI_TB_904_CANAL 
FOR EACH ROW
BEGIN 
INSERT INTO INFI_TB_009_MENSAJE_CANAL
(CODIGO_CANAL,CODIGO_MENSAJE,MENSAJE,DESCRIPCION_MENSAJE) 
 VALUES (:NEW.CODIGO_CANAL,'MC001','Condiciones de la anulación: La Orden de Compra no podrá ser enmendada o retirada a solicitud del inversionista, por lo que el cliente deberá verificar las condiciones antes de aceptar la orden.','Condiciones de la anulación (Antes del check de aceptación de la orden de compra)');
 
INSERT INTO INFI_TB_009_MENSAJE_CANAL
(CODIGO_CANAL,CODIGO_MENSAJE,MENSAJE,DESCRIPCION_MENSAJE) 
 VALUES (:NEW.CODIGO_CANAL,'MC002','Condiciones de la anulación: La Orden de Compra no podrá ser enmendada o retirada a solicitud del inversionista, por lo que el cliente deberá verificar las condiciones antes de aceptar la orden.  Si por alguna causa excepcional desea anular la Orden de Compra, por favor comuníquese de inmediato con el Centro de Contacto de Cl@venet Personal al (0212) 409.32.88 Recuerde que su solicitud sólo procederá, en caso que el Banco de Venezuela no haya logrado cruzar su Orden de Compra, aún en el sistema SITME de BCV.','Condiciones de la anulación (Pantalla de resultado)');  
END;
/
SHOW ERRORS;

ALTER TRIGGER ADM_INFI.INFI_AGREGAR_MENSAJES_CANAL DISABLE;


--
-- INFI_TB_904_CANAL  (Synonym) 
--
CREATE PUBLIC SYNONYM INFI_TB_904_CANAL FOR ADM_INFI.INFI_TB_904_CANAL;

GRANT DELETE ON  ADM_INFI.INFI_TB_904_CANAL TO USU_INFI;

GRANT INSERT ON  ADM_INFI.INFI_TB_904_CANAL TO USU_INFI;

GRANT SELECT ON  ADM_INFI.INFI_TB_904_CANAL TO USU_INFI;

GRANT UPDATE ON  ADM_INFI.INFI_TB_904_CANAL TO USU_INFI;

-- 
-- Non Foreign Key Constraints for Table INFI_TB_904_CANAL 
-- 
ALTER TABLE ADM_INFI.INFI_TB_904_CANAL ADD (
  CONSTRAINT PK_904_2
 PRIMARY KEY
 (CANAL_ID)
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


