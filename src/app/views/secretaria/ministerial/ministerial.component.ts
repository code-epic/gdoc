import {
  Component,
  OnInit,
  Inject,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDateParserFormatter,
  NgbModal,
  NgbDate,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  ApiService,
  DocumentoAdjunto,
  IAPICore,
} from "src/app/services/apicore/api.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import {
  IDocumento,
  IWKFAlerta,
} from "src/app/services/control/documentos.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { Md5 } from "md5-typescript";
import Swal from "sweetalert2";
import { DOCUMENT } from "@angular/common";
import { AngularEditorConfig } from "@kolkov/angular-editor";

export interface SubDocumento {
  subdocumento: number;
  cuenta: string;
  estatus: string;
  decision: string;
  accion: string;
  comentario: string;
  historico: string;
  archivo: string;
  nombre_archivo: string;
  fecha: string;
  usuario: string;
}

@Component({
  selector: "app-ministerial",
  templateUrl: "./ministerial.component.html",
  styleUrls: ["./ministerial.component.scss"],
})
export class MinisterialComponent implements OnInit {
  public lstEstados = [];
  public lstHzAdjuntoSub = [];
  public estadoActual = 4;
  public estadoOrigen = 2;
  public original = "";
  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public codigohash = "";
  public llave = "";

  public lstAcciones = [
    { valor: "1", texto: "ANALISTA", visible: "1" },
    { valor: "2", texto: "JEFE DE AREA", visible: "1" },
    { valor: "14", texto: "JEFE DE AREA / PARA LA FIRMA", visible: "1" }, //PARA FIRMAR PUNTOS DE CUENTAS
    { valor: "3", texto: "BANDEJA DE ESPERA", visible: "1" },
    { valor: "4", texto: "PRESIDENCIAL", visible: "1" },
    { valor: "15", texto: "VICEPRESIDENCIAL", visible: "1" },
    { valor: "5", texto: "ESPERA DE OPINION", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "6", texto: "CONSULTORIA JURIDICA", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "7", texto: "DIV. RESOLUCIONES", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "12", texto: "DIV. RESOLUCIONES / URGENTE", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    {
      valor: "13",
      texto: "DIV. RESOLUCIONES / JEFE DEL AR EA SECRETARIA",
      visible: "1",
    }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "14", texto: "DEVUELTO SIN DECISION", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "8", texto: "SUB-DIRECCION", visible: "1" },
    { valor: "9", texto: "DIRECCION GENERAL", visible: "1" },
    { valor: "10", texto: "DESPACHO DEL MPPD", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "11", texto: "ARCHIVO", visible: "1" },
    { valor: "16", texto: "DEVUELTO PARA REVISION", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
  ];

  public extender_plazo: any;

  public posicionPagina = 0;
  public placement = "bottom";
  public cmbDestino = "S";
  public asunto = "";
  public fecha = "";
  public cuenta = "";
  public unidad = "";
  public comando = "";
  public cedula = "";
  public nombre = "";
  public grado = "";
  public titulo = "";
  public archivos: any[] = [];
  public lstMinisterial: any[] = [];
  public lstCuenta: any[] = [];

  public download: any;
  public fcreacion: any;
  public creador: any;

  public lstRedistribucion = [
    { valor: "1", texto: "REDISTRIBUCION", visible: "1" },
  ];

  public ministerial: any;

  public blUpdate = false;
  public bHist = false;

  public numControl = "";

  public Observacion = "";

  public AccionTexto: string = "0";

  public lstHzAdjunto: any[] = [];

  public SubDocumento: SubDocumento = {
    subdocumento: 0,
    cuenta: "",
    estatus: "",
    decision: "",
    accion: "",
    comentario: "",
    historico: "",
    archivo: "",
    nombre_archivo: "",
    fecha: "",
    usuario: "",
  };

  public Documento: IDocumento = {};

  public DocAdjunto: DocumentoAdjunto = {
    documento: "",
    archivo: "",
    usuario: "",
  };

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: "",
    usuario: "",
    observacion: "",
  };

  public fecha_alerta: any;
  public fplazo: any;
  public dwValidate = false;

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "8rem",
    minHeight: "5rem",
    placeholder: "Ingrese el texto aquí...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["insertImage", "insertVideo", "toggleEditorMode"]],
  };

  public puntoForm = {
    situacion: "",
    opinionConsultoriaComponente: "",
    opinionJuntaAdHoc: "",
    aplicaJuntaAdHoc: "SI APLICA",
    opinionComponente: "",
    opinionConsultoriaMPPD: "",
    otros: "",
    recomendacionDespacho: "",
  };

  public indexPuntoSeleccionado: number = -1;
  public elPuntoSeleccionado: any = null;
  public modalPuntoRef: any = null;

  public dwSub = false;
  public doc: any;
  public lstNotaEntrega: any[] = [];
  public parametros: string = "";
  public allComplete: boolean = false;

  public estiloclasificar = "none";

  public edit = 0;

  // Contenido de los labels

  public lblDecision = "Decision del Ministro";
  public lblBtn = "Aceptar";
  public lblComentario = "Comentario del MPPD";
  public lblOrigenComando = "Gran Comando";
  public fechaElaboracion = "";
  public fechaOrigen = "";
  public numc = "";
  public lblTitulo = "MINISTERIAL";
  public lblBackUrl = "/sministerial/ministeriales";

  @ViewChild("templateBottomSheet") TemplateBottomSheet: TemplateRef<any>;
  hashcontrol: string;
  lblFile: any;
  blOficio: boolean = false;

  constructor(
    private bottomSheet: MatBottomSheet,
    private apiService: ApiService,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    public formatter: NgbDateParserFormatter,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.fplazo = NgbDate.from(
      this.formatter.parse(this.utilService.FechaActual()),
    );
    this.extender_plazo = NgbDate.from(
      this.formatter.parse(this.utilService.FechaActual()),
    );
    let ruta = this.rutaActiva.snapshot.params.id;
    if (ruta == "agregar") {
      this.cambiarContenido();
    }

    if (ruta != undefined) {
      try {
        this.original = this.rutaActiva.snapshot.params.id;
        let elemento = JSON.parse(atob(this.original));
        this.doc = elemento.objeto;

        console.log(this.doc);

        this.Documento = this.doc;
        this.Documento.wfdocumento = this.doc.idd;
        this.numc = this.doc.numc;

        this.numControl = this.doc.numc;

        this.unidad = this.doc.udep;
        this.comando = this.doc.coma;
        this.dwValidate = this.doc.anom != "" ? true : false;
        this.download = this.apiService.Dws(
          btoa("D" + this.doc.numc) + "/" + this.doc.anom,
        );
        this.cmbDestino = "S";

        this.consultarSubID(this.Documento.wfdocumento.toString());

        this.listarEstados();
        this.listarDatos();

        if (elemento.tipo == "PRESIDENCIAL") {
          this.lblDecision = "Decision del Presidente";
          this.lblBackUrl = "/spresidencial";
          this.lblTitulo = "PRESIDENCIAL";
        } else if (elemento.tipo == "RECLAMOS") {
          this.lblDecision = "Decision Ministerial";
          this.lblBackUrl = "/sreclamos";
          this.lblTitulo = "RECLAMOS";
        }

        if (this.doc.remi == "VICEPRESIDENCIAL") {
          this.lblDecision = "Decision del Vicepresidente";
          this.lblBackUrl = "/spresidencial";
          this.lblTitulo = "VICEPRESIDENCIAL";
        } else if (this.doc.remi == "PRESIDENCIAL") {
          this.lblDecision = "Decision del Presidente";
          this.lblBackUrl = "/spresidencial";
          this.lblTitulo = "PRESIDENCIAL";
        }
      } catch (error) {
        //this.ruta.navigate(['/secretaria', ''])
      }
    }
  }

  /**
   * Cambia el contenido de los labels
   */
  cambiarContenido() {
    this.edit = 1;
    this.lblDecision = "Decision Presidencial";
    this.lblComentario = "Comentario Presidencial";
    this.lblBtn = "Agregar";
    this.lblOrigenComando = "Origen de la Cuenta";

    this.lstAcciones = [
      { valor: "1", texto: "PARA LA FIRMA MPPD", visible: "1" },
      { valor: "2", texto: "PARA LA FIRMA PRESIDENCIAL", visible: "1" },
      { valor: "3", texto: "DIRECTOR", visible: "1" },
      { valor: "4", texto: "SUB-DIRECTOR", visible: "1" },
      { valor: "5", texto: "JEFE DE SECRETARIA", visible: "1" },
      { valor: "6", texto: "TRANSCRIPTOR", visible: "1" },
      { valor: "7", texto: "ARCHIVO", visible: "1" },
    ];
  }

  verArchivos(content) {
    this.modalService.open(content, { size: "lg" });
  }

  listarEstados() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CEstados";
    this.xAPI.parametros = "%";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter((e) => {
          return e.esta == 1;
        });
      },
      (error) => {},
    );
  }

  consultarSubID(id: string) {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CSubDocumentoID";
    this.xAPI.parametros = "" + id;
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstCuenta = data.Cuerpo;
        // console.log(this.lstCuenta)

        this.cargarDatosBase(this.lstCuenta);

        // if (
        //   this.lstCuenta[0].cuenta != "" &&
        //   this.lstCuenta[0].cuenta != null
        // ) {
        this.cargarPuntoCuentas();
        this.blOficio = true;
        // } else {
        //   this.blOficio = false;
        // }
      },
      (error) => {},
    );
  }

  cargarDatosBase(e) {
    console.log("Validando sistema");
    console.log(e);
    this.asunto = e[0].resumen == null ? e[0].cont : e[0].resumen;
    this.cuenta = e[0].cuenta;
    if (e[0].tdoc == "TRAMITACION POR ORGANO REGULAR") {
      this.asunto = e[0].cont;
      this.cuenta = e[0].cedula;
    }

    this.fecha =
      e[0].fecha == null
        ? e[0].fech.substring(0, 10)
        : e[0].fecha.substring(0, 10);
    this.codigohash = btoa(this.doc.id + this.doc.idd + this.cuenta);
    e[0].completed = false;
    this.parametros =
      this.cuenta + "," + this.doc.udep + " " + this.doc.fori.substring(0, 10);
  }

  open(content, id) {
    this.numControl = id;
    this.hashcontrol = btoa("D" + this.numControl);
    this.modalService.open(content);
  }

  activarHistorial() {
    this.bHist = !this.bHist;
  }

  listarDatos() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CSubDocVariante";
    this.xAPI.parametros = this.doc.idd;
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data.Cuerpo, "data");

        if (data.Cuerpo != undefined && data.Cuerpo.length > 0) {
          this.SubDocumento = data.Cuerpo[0];
          this.original = btoa(JSON.stringify(data.Cuerpo[0]));

          this.blUpdate = this.SubDocumento.historico == "" ? false : true;
          this.dwSub = this.SubDocumento.nombre_archivo != "" ? true : false;
        }
      },
      (error) => {},
    );
  }

  selFecha() {
    this.fecha_alerta = this.utilService.FechaActual();
    switch (this.SubDocumento.estatus) {
      case "5":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;
      case "6":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;
      case "7":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;

      case "12":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;
      case "13":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;
      case "10":
        this.fecha_alerta = this.utilService.FechaActual(7);
        break;
    }
    this.fplazo = NgbDate.from(this.formatter.parse(this.fecha_alerta));
    this.extender_plazo = NgbDate.from(this.formatter.parse(this.fecha_alerta));
  }

  aceptar() {
    this.selFecha();
    this.xAPI = {} as IAPICore;
    this.SubDocumento.accion = this.SubDocumento.accion.toUpperCase();
    this.SubDocumento.historico = this.SubDocumento.historico.toUpperCase();
    this.SubDocumento.subdocumento = parseInt(this.doc.idd);
    this.SubDocumento.cuenta = this.cuenta;
    this.SubDocumento.fecha = this.fecha_alerta;
    this.SubDocumento.usuario = this.loginService.Usuario.id;
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.SubDocumento);

    this.ngxService.startLoader("loader-aceptar");

    if (this.blUpdate == false) {
      this.xAPI.funcion = "WKF_ISubDocVariante";
      this.registrar();
      this.blUpdate = true;
      return;
    }
    this.xAPI.funcion = "WKF_ASubDocVariante";
    this.actualizar();
  }

  registrar() {
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = "WKF_ISubDocumentoAlerta";
        await this.guardarAlerta(90, this.fecha_alerta);
        this.ngxService.stopLoader("loader-aceptar");
        this._aceptar("");
      },
      (error) => {},
    );
  }

  actualizar() {
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = "WKF_ASubDocumentoAlerta";
        await this.guardarAlerta(91, this.fecha_alerta);
        this.ngxService.stopLoader("loader-aceptar");
        this._aceptar("");
      },
      (error) => {},
    );
  }

  /**Guardar la alerte define el momento y estadus*/
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo;
    this.WAlerta.documento = parseInt(this.doc.idd);
    this.WAlerta.estado = 4;
    this.WAlerta.estatus = 3;
    this.WAlerta.usuario = this.loginService.Usuario.id;
    this.WAlerta.observacion =
      this.cuenta + "|" + this.SubDocumento.estatus.toUpperCase();
    this.WAlerta.fecha = fecha;

    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (alerData) => {
        console.log(alerData);
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      },
    ); //
  }

  protected _aceptar(msj: string) {
    Swal.fire({
      title: "El punto de cuenta ha sido actualizado con exito ",
      text: "Felicitaciones",
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continuar",
    }).then(() => {
      this.ruta.navigate(["/secretaria"]);
    });
  }

  _atras() {
    this.ruta.navigate([this.lblBackUrl || "/sministerial/ministeriales"]);
  }

  fileSelected(e) {
    this.lblFile = e.target.files[0].name;
    this.archivos.push(e.target.files[0]);
  }

  async SubirArchivo() {
    this.ngxService.startLoader("loader-aceptar");
    var frm = new FormData(document.forms.namedItem("forma"));
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.SubDocumento.nombre_archivo = this.archivos[0].name;
          this.DocAdjunto.archivo = this.SubDocumento.nombre_archivo;
          this.DocAdjunto.usuario = this.loginService.Usuario.id;
          this.DocAdjunto.documento = this.numControl;

          this.xAPI = {} as IAPICore;
          this.xAPI.funcion = "WKF_ADocumentoAdjunto";
          this.xAPI.parametros = "";
          this.xAPI.valores = JSON.stringify(this.DocAdjunto);
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                this.toastrService.success(
                  "Tu archivo ha sido cargado con exito ",
                  `GDoc Registro`,
                );
              } else {
                this.toastrService.info(
                  xdata.msj,
                  `GDoc Wkf.Documento.Adjunto`,
                );
              }
              this.ngxService.stopLoader("loader-aceptar");
            },
            (error) => {
              this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
              this.ngxService.stopLoader("loader-aceptar");
            },
          );

          this.aceptar();
          this.toastrService.success(
            "Tu archivo ha sido cargado con exito ",
            `GDoc SubDocumentos`,
          );
          //this.ngxService.stopLoader("loader-aceptar")
        },
        (error) => {
          this.ngxService.stopLoader("loader-aceptar");
          this.toastrService.error(error, `GDoc Wkf.SubDocumentos.Adjunto`);
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async redistribuir(destino: number = 0) {
    var dst = destino != 0 ? destino : this.cmbDestino;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_ASubDocumentoRedistribuir";
    this.xAPI.valores = "";
    this.xAPI.parametros =
      dst +
      ",1," +
      this.loginService.Usuario.id +
      "," +
      this.ministerial.idd +
      "," +
      this.ministerial.cuenta;
    console.log("pasatiempos");
    console.log(this.xAPI);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        this.toastrService.success(
          "El documento ha sido redistribuido segun su selección",
          `GDoc Wkf.DocumentoObservacion`,
        );
        this.ruta.navigate(["/secretaria"]);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  cargarPuntoCuentas() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CPuntoCuentaDetalle";
    this.xAPI.valores = "";
    this.xAPI.parametros = this.parametros;
    console.log(this.xAPI.parametros);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstHzAdjunto = data.Cuerpo;
      },
      (error) => {
        console.error(error);
      },
    );
    console.log(event);
  }

  openTMS() {
    this.bottomSheet.open(this.TemplateBottomSheet);
  }

  closeTMS() {
    this.bottomSheet.dismiss();
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }

  /**Consultar un enlace*/
  constancia(id: string) {
    const estado = 1;
    const estatus = 1;
    return btoa(estado + "," + estatus + "," + id);
  }

  async transfererirResoluciones() {
    this.ngxService.startLoader("loader-aceptar");
    this.lstNotaEntrega = [];
    let i = 0;
    var fecha = new Date().toISOString();
    let llave = Md5.init(this.numControl + fecha);
    await this.lstCuenta.forEach((e) => {
      const text = (<HTMLInputElement>document.getElementById(i + "-text"))
        .value;
      const nombre = (<HTMLInputElement>document.getElementById(i + "-nomb"))
        .value;
      const cedula = (<HTMLInputElement>document.getElementById(i + "-cedu"))
        .value;
      const cargo = (<HTMLInputElement>document.getElementById(i + "-carg"))
        .value;

      let observacionFinal = text;
      if (text === "PR" && e.detallefinaljson) {
        observacionFinal = e.detallefinaljson;
      }

      if (text != "PE") {
        this.lstNotaEntrega.push({
          id: e.ids,
          nombre: nombre,
          cedula: cedula,
          numc: e.numc,
          observacion: observacionFinal,
          llave: llave,
          udep: e.udep,
          cuenta: e.cuenta,
          cargo: cargo,
        });
        // console.log(this.lstNotaEntrega);
      }
      i++;
    });

    await this.notaEntrega(0);
  }

  updateAllComplete() {
    this.allComplete =
      this.lstCuenta != null && this.lstCuenta.every((t) => t.completed);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.lstCuenta == null) {
      return;
    }

    this.lstCuenta.forEach((t) => (t.completed = completed));
    if (completed == false) {
      this.estiloclasificar = "none";
    } else {
      this.estiloclasificar = "";
    }
  }

  async notaEntrega(pos) {
    // console.log('notaEntrega', this.lstNotaEntrega);
    if (this.lstNotaEntrega.length == 0) {
      this.toastrService.info(
        "No hay documentos por actualizar",
        `GDoc Secretaria`,
      );
      this.ngxService.stopLoader("loader-aceptar");
      return;
    }
    let e = this.lstNotaEntrega[pos];
    var destino = 3;
    var estatus = 1;
    var usuario = this.loginService.Usuario.cedula;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_APromoverSubDocumento";
    this.xAPI.valores = "";
    this.xAPI.parametros =
      destino +
      "," +
      estatus +
      "," +
      e.llave +
      "|" +
      e.observacion +
      "," +
      usuario +
      ",1," +
      e.id;
    console.log(this.xAPI.parametros);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (pos == this.lstNotaEntrega.length - 1) {
          this.toastrService.info(
            "Proceso finalizado con exito",
            `GDoc Secretaria`,
          );
          this.ngxService.stopLoader("loader-aceptar");
        } else {
          this.notaEntrega(pos + 1);
        }
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverSubDocumento`);
      },
    );
  }

  getDetalle(el: any): string {
    if (el && el.detallejsonfinal) {
      return "PR";
    }
    const e = el ? el.detalle : null;
    if (e == null || e == "null" || e == undefined || e === "") return "PE";
    let text = "PR";
    let cont = e.split("|");
    if (cont.length > 1) text = cont[1];
    return text;
  }

  imprimir() {
    var ventana = window.open("", "_blank");
    var localtime = new Date().toLocaleString();
    var contenido = document.getElementById("prtNota").innerHTML;
    ventana.document.write(contenido);

    ventana.document.head.innerHTML = ` <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Gestion de Documentos</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <style type="text/css">
        @media print {
            body {
                  margin: 0px;
                  font-family: Calibri;
              }
              .encabezado{
                text-align:center;
              }
              .footer, .push {
                  height: 5em;
                  font-size: 12px;
              }
              h3 {
                text-align:center;
              }
              .footer, .push {
                  height: 5em;
                  font-size: 12px;
              }
              .tabla-contenido {
                border-collapse: collapse;
                font-family: Arial, Calibre;
                font-size: 12px;
            }
            .wrapper {
                min-height: 100%;
                height: auto !important;
                height: 100%;
                margin: 0 auto -5em;
            }
        }
    </style>
     `;
    ventana.print();
    ventana.close();
  }
  cancelarEdicionPunto() {
    if (this.indexPuntoSeleccionado >= 0) {
      // Revert select back to pending or the value it had before?
      // Usually better to leave it or let user change it back manually.
      // Here we'll just close.
      const selectEl = <HTMLSelectElement>(
        document.getElementById(this.indexPuntoSeleccionado + "-text")
      );
      if (selectEl) selectEl.value = "PE"; // Revert to PE as safety if canceled
    }
    this.modalPuntoRef.close();
  }

  onSelectProcesar(event: any, el: any, index: number, modal: any) {
    const value = event.target.value;

    // Check if doc estado is 16 (or doc.idestado, doc.estadoActual)
    if (value === "PR" && this.doc.idestado == 16) {
      this.indexPuntoSeleccionado = index;
      this.elPuntoSeleccionado = el;

      this.puntoForm = {
        situacion: "",
        opinionConsultoriaComponente: "",
        opinionJuntaAdHoc: "",
        aplicaJuntaAdHoc: "SI APLICA",
        opinionComponente: "",
        opinionConsultoriaMPPD: "",
        otros: "",
        recomendacionDespacho: "",
      };

      let jsonToParse = el.detallejsonfinal;

      if (jsonToParse && jsonToParse.includes("{")) {
        try {
          // El backend puede estar limpiando los slashes (\). Limpiamos el string para que JSON.parse no falle.
          let safeJson = jsonToParse;
          if (typeof safeJson === "string") {
            safeJson = safeJson.replace(/u003c/g, "<").replace(/u003e/g, ">");
            safeJson = safeJson.replace(/="([^"]*)"/g, "='$1'"); // Cambia atributos HTML a comilla simple
          }

          let parsed =
            typeof safeJson === "string" ? JSON.parse(safeJson) : safeJson;

          if (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
          }
          let formValues = parsed.obse ? parsed.obse : parsed;
          if (typeof formValues === "string") {
            formValues = JSON.parse(formValues);
          }
          this.puntoForm = { ...this.puntoForm, ...formValues };
        } catch (e) {
          console.error("Error parsing JSON in onSelectProcesar", e);
        }
      }

      this.modalPuntoRef = this.modalService.open(modal, {
        size: "xl",
        backdrop: "static",
      });
    }
  }

  abrirModalPuntoEdicion(el: any, index: number, modal: any) {
    if (this.doc.idestado == 16) {
      this.indexPuntoSeleccionado = index;
      this.elPuntoSeleccionado = el;

      this.puntoForm = {
        situacion: "",
        opinionConsultoriaComponente: "",
        opinionJuntaAdHoc: "",
        aplicaJuntaAdHoc: "SI APLICA",
        opinionComponente: "",
        opinionConsultoriaMPPD: "",
        otros: "",
        recomendacionDespacho: "",
      };

      let jsonToParse = el.detallejsonfinal;

      if (jsonToParse && jsonToParse.includes("{")) {
        try {
          // El backend puede estar limpiando los slashes (\). Limpiamos el string para que JSON.parse no falle.
          let safeJson = jsonToParse;
          if (typeof safeJson === "string") {
            safeJson = safeJson.replace(/u003c/g, "<").replace(/u003e/g, ">");
            safeJson = safeJson.replace(/u0026/g, "&");
            safeJson = safeJson.replace(/="([^"]*)"/g, "='$1'"); // Cambia atributos HTML a comilla simple
          }

          let parsed =
            typeof safeJson === "string" ? JSON.parse(safeJson) : safeJson;

          if (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
          }
          let formValues = parsed.obse ? parsed.obse : parsed;
          if (typeof formValues === "string") {
            formValues = JSON.parse(formValues);
          }
          this.puntoForm = { ...this.puntoForm, ...formValues };
        } catch (e) {
          console.error("Error parsing JSON in abrirModalPuntoEdicion", e);
        }
      }

      this.modalPuntoRef = this.modalService.open(modal, {
        size: "xl",
        backdrop: "static",
      });
    }
  }

  guardarPuntoJson() {
    const hasContent =
      this.tieneContenido(this.puntoForm.situacion) ||
      this.tieneContenido(this.puntoForm.opinionConsultoriaComponente) ||
      this.tieneContenido(this.puntoForm.opinionJuntaAdHoc) ||
      this.tieneContenido(this.puntoForm.opinionComponente) ||
      this.tieneContenido(this.puntoForm.opinionConsultoriaMPPD) ||
      this.tieneContenido(this.puntoForm.otros) ||
      this.tieneContenido(this.puntoForm.recomendacionDespacho);

    if (!hasContent) {
      this.toastrService.warning(
        "Debe llenar al menos una sección del punto para poder guardar.",
        "Atención",
      );
      return;
    }

    if (this.indexPuntoSeleccionado >= 0 && this.elPuntoSeleccionado) {
      // Sanitizar los datos para evitar problemas de comillas en el JSON y SQL del backend
      let sanitizedForm: any = {};
      for (const key of Object.keys(this.puntoForm)) {
        let val = (this.puntoForm as any)[key];
        if (typeof val === "string") {
          // Cambiar comillas dobles por simples en el HTML (ej. face="Arial" -> face='Arial')
          // para que no rompa el JSON cuando el backend elimine los backslashes
          sanitizedForm[key] = val.replace(/"/g, "'");
        } else {
          sanitizedForm[key] = val;
        }
      }

      const fullData = {
        obse: sanitizedForm,
        idd: this.elPuntoSeleccionado.idd,
        numc: this.elPuntoSeleccionado.numc,
        esta: 1,
      };

      let jsonStr = JSON.stringify(fullData);

      // Duplicar comillas simples para escapar correctamente en la consulta SQL del backend
      // (evita el error de sintaxis en UPDATE ... SET obse='...')
      const sqlSafeJsonStr = jsonStr.replace(/'/g, "''");

      // Evaluar si ya tiene el JSON cargado para saber si es un UPDATE (U) o un INSERT (I)
      const yaExiste = this.elPuntoSeleccionado.detallejsonfinal;

      const funcionNombre = yaExiste
        ? "WKF_USecretariaReclamos"
        : "WKF_ISecretariaReclamos";

      // Actualizamos el objeto padre para que si se vuelve a abrir el modal, tenga los datos recientes
      this.elPuntoSeleccionado.detallejsonfinal = jsonStr;

      this.apiService
        .Ejecutar({
          funcion: funcionNombre,
          parametros: "",
          valores: sqlSafeJsonStr,
        })
        .subscribe(
          (data) => {
            // Confirmamos la actualización localmente tras el guardado exitoso
            this.elPuntoSeleccionado.detallejsonfinal = jsonStr;

            this.toastrService.success(
              "Datos del punto guardados correctamente.",
              "Atención",
            );
            this.modalPuntoRef.close();
          },
          (errot) => {
            this.toastrService.error(errot, `Error en ${funcionNombre}`);
          },
        );

      console.log(this.elPuntoSeleccionado.detallefinaljson);
    }
  }

  tieneContenido(html: string): boolean {
    if (!html) return false;
    // Removemos espacios y etiquetas html vacias basicas que AngularEditor suele colocar
    const limpio = html.replace(/<[^>]*>?/gm, "").trim();
    return limpio.length > 0;
  }
}
