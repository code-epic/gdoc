import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbModal,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";
import Swal from "sweetalert2";

import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import {
  IWKFAlerta,
  IDocumento,
  IWKFDocumento,
  IWKFCuenta,
  IWKFDependencia,
} from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";

import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-visitantedocumento",
  templateUrl: "./visitantedocumento.component.html",
  styleUrls: ["./visitantedocumento.component.scss"],
})
export class VisitantedocumentoComponent implements OnInit, OnDestroy {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    showToolbar: false,
    placeholder: "",
  };

  form: FormGroup;

  public estadoActual = 14;
  public estadoOrigen = 1;

  public ncontrolv = true; // visibilidad del input numero de control
  public ncontrolt = "Nro. Control";
  public remitentet = "Remitente";
  public origenvisible: boolean = true; // Visibilidad del Input Numero de Origen
  public fsalida = "Fecha de Creación (*)";
  public forigenv = true; // Visibilidad de Input Fecha Origen

  public bPDF = false;

  // editor: Editor = new Editor;
  // xeditor: Editor = new Editor;

  public fcreacion: any;
  public forigen: any;
  public fcuenta: any;
  public fplazo: any;

  public fcreacionDate: NgbDate | null;
  public forigenDate: NgbDate | null;
  public fcuentaDate: NgbDate | null;

  public subfechaDate: NgbDate | null;

  public editar: boolean = false;
  public puntocuenta: boolean = false;
  public salidavisible: boolean = true;
  public resolucion: boolean = false;
  public activarMensaje = false;

  public detalle: string = "";

  public cuenta: string = "";
  public resumen: string = "";
  public subfecha: string = "";
  public cedula: string = "";
  public cargo: string = "";
  public nmilitar: string = "";
  public salida: string = "Nro. de Salida";
  public booPuntoCuenta: boolean = false;

  public WkDoc: IWKFDocumento = {
    nombre: "",
    estado: 0,
    estatus: 0,
    workflow: 0,
    observacion: "",
    usuario: "",
  };

  public WkCuenta: IWKFCuenta = {
    documento: 0,
    cuenta: "",
    estado: 0,
    estatus: 0,
    detalle: "",
    resumen: "",
    cedula: "",
    cargo: "",
    nmilitar: "",
    fecha: "",
    usuario: "",
    activo: 0,
  };

  public Doc: IDocumento = {
    ncontrol: "",
    wfdocumento: 0,
    fcreacion: "",
    forigen: "",
    norigen: "",
    salida: "",
    tipo: "0",
    remitente: "0",
    unidad: "0",
    comando: "0",
    contenido: "",
    instrucciones: "",
    codigo: "0",
    nexpediente: "",
    creador: "",
    archivo: "",
    privacidad: 0,
    subdocumento: "",
    dependencias: "",
    puntodecuenta: "",
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

  public WKDependencia: IWKFDependencia = {
    documento: 0,
    nombre: "",
    observacion: "",
  };

  public DocSalida: IDocumento = {
    ncontrol: "",
    wfdocumento: 0,
    fcreacion: "",
    forigen: "",
    norigen: "",
    salida: "",
    tipo: "0",
    remitente: "0",
    unidad: "0",
    comando: "0",
    contenido: "",
    instrucciones: "",
    codigo: "0",
    nexpediente: "",
    creador: "",
    archivo: "",
    privacidad: 0,
    subdocumento: "",
    dependencias: "",
  };

  public booDependencia = false;

  public lstT = []; //Objeto Tipo documento
  public lstR = []; //Objeto Remitente
  public lstU = []; //Objeto Unidad
  public lstC = []; //Objeto Comando
  public lstCA = []; //Objeto Comando
  public lstCuenta = []; //Objeto Unidad

  public lstHzAdjunto = []; //Historico de documentos adjuntos
  public lstTraza = [];
  public lstHistorial = [];
  public lstImg = [];
  public lstDependencias = [];
  public titulo = "Documento";
  public nasociacion = "";

  public download: any;

  public bHist = false;

  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public Configuracion: any;
  public serializar: string = "";
  public Configurar: boolean = false;

  public activarTipo = false; // activar tipo de documento
  public xAPI: IAPICore = {
    funcion: "",
  };

  public xApi: IAPICore = {
    funcion: "",
    parametros: "",
  };
  routerDoc: { numc: string };

  toppings = new FormControl("");
  toppingsaux = new FormControl("");

  lstPC: string[] = []; // Auxiliar para mappear las cuentas de toppings
  lstPuntosCuentas: string[] = [];
  lstPuntosCuentasAux: [];
  public SubMenu = [];

  public isPunto: boolean = true;
  public sCedula: string = "Cédula";
  public sGrado: string = "Grado / Jerarquía";
  public sNombre: string = "Nombres y Apellidos";
  public bCamara: boolean = false;

  formulario: FormGroup;
  fotoCapturada: string | null = null;
  mostrarCamara: boolean = false; // Para controlar la visibilidad de la cámara
  vdE: HTMLVideoElement | null = null;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private ruta: Router
  ) {
    this.formulario = this.fb.group({
      cedula: ["", Validators.required],
      nombre: ["", Validators.required],
      foto: [null, Validators.required],
    });
    this.iniciarCamara();
  }

  // Método para iniciar la cámara
  iniciarCamara() {
    this.mostrarCamara = true;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.vdE = document.createElement("video");
        this.vdE.srcObject = stream;
        this.vdE.width = 200;
        this.vdE.height = 180;
        this.vdE.play();
        const videoContainer = document.getElementById("video-container");
        if (videoContainer) {
          videoContainer.appendChild(this.vdE);
        }
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error);
      });
  }

  // Método para capturar la foto
  capturarFoto() {
    if (this.vdE) {
      const canvas = document.createElement("canvas");
      canvas.width = this.vdE.videoWidth;
      canvas.height = this.vdE.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(this.vdE, 0, 0, canvas.width, canvas.height);
        this.fotoCapturada = canvas.toDataURL("image/png"); // Convertir a base64
        this.formulario.get("foto")?.setValue(this.fotoCapturada); // Asignar al formulario
        this.mostrarCamara = false; // Ocultar la cámara después de capturar la foto
        if (this.vdE.srcObject) {
          const stream = this.vdE.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop()); // Detener la cámara
        }
      }
    }
    this.bCamara = true;
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.formulario.valid) {
      const formData = this.formulario.value;
      console.log("Datos del formulario:", formData);
      // Aquí puedes enviar formData a tu API o servicio
    } else {
      console.error("Formulario inválido");
    }
  }

  async ngOnInit() {
    this.iniciarFormulario();
    // this.editor = new Editor()
    // this.xeditor = new Editor()

    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id;
    } else {
      this.limpiarDoc();
    }
    await this.loginService.Iniciar();
    this.SubMenu = await this.loginService.obtenerSubMenu("/control");
    let prv = this.loginService.obtenerPrivilegiosMenu("/control");
    // console.log(prv)
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach((e) => {
        if (e.nombre == "configurar") this.Configurar = true;
      });
    }
    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : [];
    this.Grados =
      sessionStorage.getItem("MPPD_CGrado") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado")))
        : [];
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : [];
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : [];

    this.Configuracion =
      sessionStorage.getItem("MD_CConfiguracion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion")))
        : [];
    this.listarConfiguracion();
  }

  iniciarFormulario() {
    this.form = this.fb.group({
      tipoVisitante: ["", Validators.required],
      motivoVisita: ["", Validators.required],
      cedula: ["", Validators.required],
      cargo: [{ value: "", disabled: this.isPunto }, Validators.required],
      nmilitar: [{ value: "", disabled: this.isPunto }, Validators.required],
      unidad: ["", Validators.required],
      comando: ["", Validators.required],
      forigen: ["", Validators.required],
      fplazo: ["", Validators.required],
      observacion: ["", Validators.required],
    });
  }

  guardar() {
    this.Doc.tipo = this.form.get("tipoVisitante")?.value;
    this.Doc.contenido = this.form.get("motivoVisita")?.value;
    this.Doc.remitente = this.form.get("cedula")?.value;
    this.Doc.unidad = this.form.get("unidad")?.value;
    this.Doc.comando = this.form.get("comando")?.value;
    this.Doc.forigen = this.form.get("forigen")?.value;
    this.Doc.fcreacion = this.form.get("fplazo")?.value;
    this.Doc.creador = this.loginService.Usuario.id;
    this.Doc.norigen = this.form.get("cargo")?.value;
    this.Doc.nexpediente = this.form.get("nmilitar")?.value;
    this.Doc.instrucciones = this.form.get("observacion")?.value;
    this.registrar()
  }

  setDescripcionPunto() {
    this.sCedula = "Cédula";
    this.sGrado = "Grado / Jerarquía";
    this.sNombre = "Nombres y Apellidos";
  }

  setDescripcionContratos() {
    this.sCedula = "# Contrato";
    this.sGrado = "Rif / Razón Social";
    this.sNombre = "Monto Total";
  }

 

  listarConfiguracion() {
    // console.log(this.Configuracion)
    this.Configuracion.forEach((e) => {
      switch (e.tipo) {
        case "1":
          this.lstT.push(e);
          break;
        case "2":
          this.lstR.push(e);
          break;
        case "3":
          this.lstU.push(e);
          break;
        case "4":
          this.lstC.push(e);
          break;
        case "5":
          this.lstCA.push(e);
          break;
      }
    });
  }

  limpiarDoc() {
    var dia = this.utilService.FechaActual();

    this.forigen = "";
    this.fplazo = "";
    this.Doc.ncontrol = "";
    this.Doc.norigen = "";
    this.Doc.contenido = "";
    this.Doc.instrucciones = "";
    this.Doc.nexpediente = "";
    this.Doc.codigo = "0";
    this.Doc.salida = "";
    this.Doc.tipo = "0";
    this.Doc.remitente = "0";
    this.Doc.unidad = "0";
    this.Doc.creador = "";
    this.fcreacionDate = NgbDate.from(this.formatter.parse(dia));
    this.fcreacion = dia;
    this.nasociacion = "";
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }

  open(content) {
    this.modalService.open(content);
  }

  activarHistorial() {
    this.bHist = !this.bHist;
  }

  validarCamposObligatorios(): boolean {
    if (this.titulo == "Documento") {
      return (
        this.fcreacion == "" ||
        this.forigen == "" ||
        this.Doc.contenido == "" ||
        this.fplazo == ""
      );
    } else {
      return (
        this.fcreacion == "" || this.Doc.contenido == "" || this.fplazo == ""
      );
    }
  }
  //registrar Un documento pasando por el WorkFlow

  protected aceptar(msj: string) {
    if (this.activarMensaje) return false;
    this.activarMensaje = true;
    Swal.fire({
      title: "El Visitante se ha registrado exitosamente",
      text: "¿Desea registar otro visitante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
      allowEscapeKey: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.ruta.navigate(["/visitantes"]);
      }
    });
  }

  /**
   * Consultar datos generales del militar
   */
  consultarCedula() {
    if (this.form.get("cedula")?.value == "") return false;
    this.isPunto = true;
    if (
      this.Doc.tipo.toLowerCase() == "destitucion/punto de cuenta" ||
      this.Doc.tipo.toLowerCase() == "contratos/punto de cuenta"
    ) {
      this.isPunto = false;
    } else {
      this.ngxService.startLoader("loader-aceptar");
      this.xAPI.funcion = "MPPD_CDatosBasicos";
      this.xAPI.parametros = this.form.get("cedula")?.value;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data);
          this.ngxService.stopLoader("loader-aceptar");
        },
        (error) => {
          this.ngxService.stopLoader("loader-aceptar");
          console.error("Error de conexion a los datos ", error);
        }
      );
    }
  }

  cancelar() {
    this.bCamara = false;
    this.iniciarCamara();
  }

  ngOnDestroy(): void {
    // this.editor.destroy()
    // this.xeditor.destroy()
  }

  //obtenerWorkFlow Permite generar los primeros valores de la red del documento
  obtenerWorkFlow() {
    this.WkDoc = {
      nombre: "Visitantes",
      workflow: 2,
      estado: this.estadoActual,
      estatus: this.estadoOrigen,
      observacion: "Control de visitas ",
      usuario: this.loginService.Usuario.id,
    };
    this.xAPI.funcion = "WKF_IDocumento";
    this.xAPI.valores = JSON.stringify(this.WkDoc);
  }

  registrar() {
    this.ngxService.startLoader("loader-aceptar");
    this.obtenerWorkFlow(); //Obtener valores de una API
    
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data);
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (xdata) => {
            if (this.fplazo.year != undefined) {
              this.obtenerAlertaWorkFlow(xdata);
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (ydata) => {
                  this.ngxService.stopLoader("loader-aceptar");
                },
                (errot) => {
                  this.toastrService.error(data.msj, `GDoc Wkf.Alerta`)
                  this.ngxService.stopLoader("loader-aceptar");
                }
              )
            }
        

            this.aceptar(this.Doc.ncontrol);
            this.limpiarDoc();
            this.ngxService.stopLoader("loader-aceptar");

            const cantdep = this.lstDependencias.length;
            const mpuntocuenta = this.toppings.value.length;

            this.aceptar(this.Doc.ncontrol);
            this.limpiarDoc();
            this.ngxService.stopLoader("loader-aceptar");
          },
          (errot) => {
            this.toastrService.error(data.msj, `GDoc Wkf.Documento.Detalle`)
            this.ngxService.stopLoader("loader-aceptar");
          }
        );
      }, //En caso de fallar Wkf
      (errot) => {
        var mensaje = errot + " - " + this.xAPI.funcion;
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`)
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }

  //Obtener los dados de Documento
  obtenerDatos(data: any) {
    if (data.tipo == 0) {
      var mensaje = data.msj + " - " + this.xAPI.funcion;
      this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
      return false;
    }
    this.xAPI.funcion = "WKF_IDocumentoDetalle";

    this.Doc.ncontrol = this.utilService.Semillero(data.msj).toUpperCase();

    this.Doc.wfdocumento = parseInt(data.msj);
    this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion);
    this.Doc.forigen =
      this.forigen != undefined
        ? this.utilService.ConvertirFecha(this.forigen)
        : this.utilService.ConvertirFecha(this.fcreacion);

    this.Doc.contenido = this.Doc.contenido.toUpperCase();
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase();

    this.Doc.creador = this.loginService.Usuario.id;

    this.xAPI.valores = JSON.stringify(this.Doc);
  }

  //Obtener alerta del Documento
  obtenerAlertaWorkFlow(data: any) {
    if (data.tipo == 0) {
      this.toastrService.error(data.msj, `GDoc Wkf.Alerta`);
      return false;
    }
    this.WAlerta.activo = 1;
    this.WAlerta.documento = this.Doc.wfdocumento;
    this.WAlerta.estado = this.WkDoc.estado;
    this.WAlerta.estatus = this.WkDoc.estatus;
    this.WAlerta.usuario = this.WkDoc.usuario;
    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo);
    this.xAPI.funcion = "WKF_IAlerta";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
  }
}
