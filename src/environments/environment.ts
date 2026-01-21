// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  enableServiceWorker: true,
  ID : 'mppd.gdoc',
  Url: 'http://localhost',
  API: '/v1/api/',
  Hash: '3a39a4d2f9869b08b9c2c2d9bad7334f.sse',
  buildDateTime: 'Wed Jan 21 2026 12:11:47 GMT-0400 (Venezuela Time)',
  version: 'Broglie 1.0.1-1b419f3',
  fecha: '2025-04-12 05:08:00',
  coleciones : {
    CONTADORES: 'wkf_mppd_2026'
  },
  funcion: {
    CONSULTAR_USUARIO_PERFIL: '_SYS_CUsuarioPerfil',
    COMPONENTE_CONSULTAR: 'MPPD_CComponente',
    TIPO_RESOLUCION_CONSULTAR: 'MPPD_CTipoResolucion',
    ESTADO_RESOLUCION_CONSULTAR: 'MPPD_CEstadoResolucion',
    CONSULTAR_RANGO_CEDULAS: 'MPPD_CCedulaRango',
    CARPETAS_GROUP: 'MPPD_CCarpetasGroup',
    CARPETAS_GROUP_UPDATE: 'MPPD_UCarpetasGroup',
    LISTAR_RESPONSABLES: 'MPPD_ListarResponsables',
    GRUPO_CARPETA_ENTRADA: 'MPPD_CGrupoCarpertaEntrada',
    ENTRADAS_PROCESO: 'MPPD_CEntradasProceso',
    CONSULTAR_RESOLUCIONES: 'MPPD_CResoluciones',
    ENTRADAS_RESOLUCIONES: 'MPPD_GEntradasResoluciones',
    CONSULTAR_ENTRADAS_RESOLUCIONES: 'MPPD_CEntradasResoluciones',
    CAUSA_RESOLUCION: 'MPPD_CCausaResolucion',
    CONSULTAR_CONFIGURACION: 'MD_CConfiguracion', 
    MOTIVO_RESOLUCION: 'MPPD_CMotivoResolucion',
    GRADO_CONSULTAR: 'MPPD_CGrado',
    CATEGORIAS_CONSULTAR: 'MPPD_CCategorias',
    CLASIFICACION_CONSULTAR: 'MPPD_CClasificacion',
    ORDEN_ENTRADA_CONSULTAR: 'MPPD_COrdenEntrada',
    CARPETA_ENTRADA_CONSULTAR: 'MPPD_CCarpetaEntrada',
    GRADO_IPSFA_CONSULTAR: 'MPPD_CGradoIPSFA',
    CARPETAS_CONSULTAR: 'MPPD_CCarpetas',
    TIPO_ENTRADA_CONSULTAR: 'MPPD_CTipoEntrada',
    UNIDAD_CONSULTAR: 'MPPD_CUnidad',
    DATOS_BASICOS_CONSULTAR: 'MPPD_CDatosBasicos',
    DATOS_BASICOS_NOMBRE: 'MPPD_CDatosBasicosNombre',
    RESOLUCIONES_RANGO_TIPO: 'MPPD_CResolucionesRangoTipo',
    RESOLUCIONES_RANGO: 'MPPD_CResolucionesRango',
    CEDULA_FILE_CSV: 'MPPD_CCedulaFileCSV',
    CEDULA_FILE_CSVSaime: 'MPPD_CCedulaFileCSVSaime',
    RESUELTO_ID: 'MPPD_CResueltoID',
    ENTRADAS_ELIMINAR: 'MPPD_EEntradas',
    ESTADISTICAS_BAJAS: 'MPPD_CEstadicasBajas',
    MPPD_CAlertasResoluciones: 'MPPD_CAlertasResoluciones',
    MPPD_CAlertasReicorporacion: 'MPPD_CAlertasReicorporacion', 
    MPPD_UAlertasResoluciones: 'MPPD_UAlertasResoluciones',
    CONSULTAR_ADMINISTRACION: 'MPPD_CNominaAdministrativa',
    // WKF_
    ESTADOS: 'WKF_CEstados',
    DOCUMENTOS_RESOLUCIONES: 'WKF_CDocumentosResoluciones',
    GRUPO_CARPETAS: 'WKF_CGrupoCarpetas',
    SUBDOCUMENTO_RESOLUCIONES: 'WKF_CSubDocumentoResoluciones',
    DOCUMENTO_OBSERVACION: 'WKF_IDocumentoObservacion',
    UBICACION_RECHAZO: 'WKF_AUbicacionRechazo',
    PROMOVER_ESTATUS: 'WKF_APromoverEstatus',
    REDISTRIBUIR: 'WKF_ARedistribuir',
    SUBDOCUMENTO_REDISTRIBUIR: 'WKF_ASubDocumentoRedistribuir',
    ALERTAS: 'WKF_AAlertas',
    DOCUMENTO_ADJUNTO: 'WKF_ADocumentoAdjunto',
    UBICACION: 'WKF_AUbicacion',
    NUMERO_DE_CONTROL: 'WKF_NumeroSerie',
    CONSULTAR_NOMBRAMIENTOS: 'MPPD_CNombramientos',
    CONSULTAR_CODIGOS_ROJOS: 'MPPD_CCodigosRojos',
    ACTUALIZAR_CLAVE_USUARIO: '_SYS_UUserPanel',
    ACTUALIZAR_TOTP  : '_SYS_UUserTOTP',

  }
};

export function getFuncion(key: keyof typeof environment.funcion): string {
  return environment.funcion[key];
}


