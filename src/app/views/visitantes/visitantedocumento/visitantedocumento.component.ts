import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { IWKFAlerta, IDocumento, IWKFDocumento } from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-visitantedocumento",
  templateUrl: "./visitantedocumento.component.html",
  styleUrls: ["./visitantedocumento.component.scss"],
})
export class VisitantedocumentoComponent implements OnInit {
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

  public fcreacion: any;
  public forigen: any;
  public fcuenta: any;
  public fplazo: any;
  
  public fcreacionDate: NgbDate | null;
  
  public activarMensaje = false;
  
  public cargo: string = "";
  public nmilitar: string = "";
  public salida: string = "Nro. de Salida";
  public booPuntoCuenta: boolean = false;
  
  public fechaActual: string = "";
  public horaActual: string = ""

  public WkDoc: IWKFDocumento = {
    nombre: "",
    estado: 0,
    estatus: 0,
    workflow: 0,
    observacion: "",
    usuario: "",
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
    comando: "100",
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

  public lstU = []; //Objeto Unidad
  public lstC = []; //Objeto Comando

  public Configuracion: any;
  public Configurar: boolean = false;

  public xAPI: IAPICore = {
    funcion: "",
  };

  public xApi: IAPICore = {
    funcion: "",
    parametros: "",
  };

  public SubMenu = [];

  public isPunto: boolean = true;
  public sCedula: string = "Cédula";
  public sGrado: string = "Cargo";
  public sNombre: string = "Nombres y Apellidos";
  public bCamara: boolean = false;

  fotoCapturada: string | null = null;
  mostrarCamara: boolean = false; // Para controlar la visibilidad de la cámara
  vdE: HTMLVideoElement | null = null;

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private ruta: Router
  ) {}

  async ngOnInit() {
    this.iniciarFormulario();

    this.actualizarFechaHoraActual();
    setInterval(() => {
      this.actualizarFechaHoraActual();
    }, 1000);

    this.iniciarCamara();

    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id;
    } else {
      this.limpiarDoc();
    }
    await this.loginService.Iniciar();
    this.SubMenu = await this.loginService.obtenerSubMenu("/control");
    let prv = this.loginService.obtenerPrivilegiosMenu("/control");
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach((e) => {
        if (e.nombre == "configurar") this.Configurar = true;
      });
    }
  }

  iniciarFormulario() {
  
    this.form = this.fb.group({
      tipoVisitante: ["", Validators.required],
      motivoVisita: [{ value: "", disabled: true }, Validators.required],
      cedula: [{ value: "", disabled: true }, Validators.required],
      cargo: [{ value: "", disabled: true }, Validators.required],
      nmilitar: [{ value: "", disabled: true }, Validators.required],
      unidad: [{ value: "", disabled: true }, Validators.required],
      comando: [{ value: "", disabled: true }, Validators.required],
      forigen: [{ value: "", disabled: true  }, Validators.required],
      fplazo: [{ value: "", disabled: true }, Validators.required],
      observacion: [{ value: "", disabled: true }, Validators.required],
      foto: [{ value: "", disabled: true }, Validators.required],
    });    
  
    this.form.get("tipoVisitante")?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get("motivoVisita")?.enable();
        this.form.get("cedula")?.enable();
        this.form.get("cargo")?.enable();
        this.form.get("nmilitar")?.enable();
        this.form.get("unidad")?.enable();
        this.form.get("comando")?.enable();
        this.form.get("forigen")?.enable();
        this.form.get("fplazo")?.enable();
        this.form.get("observacion")?.enable();
        this.form.get("foto")?.enable();
      } else {
        this.form.get("motivoVisita")?.disable();
        this.form.get("cedula")?.disable();
        this.form.get("cargo")?.disable();
        this.form.get("nmilitar")?.disable();
        this.form.get("unidad")?.disable();
        this.form.get("comando")?.disable();
        this.form.get("forigen")?.disable();
        this.form.get("fplazo")?.disable();
        this.form.get("observacion")?.disable();
        this.form.get("foto")?.disable();
      }
    });    
  }

  actualizarFechaHoraActual() {
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const ahora = new Date();
    const diaSemana = diasSemana[ahora.getDay()];
    const dia = ahora.getDate().toString().padStart(2, "0");
    const mes = (ahora.getMonth() + 1).toString().padStart(2, "0"); // Los meses comienzan desde 0
    const anio = ahora.getFullYear();
    const horas = ahora.getHours().toString().padStart(2, "0");
    const minutos = ahora.getMinutes().toString().padStart(2, "0");
    const segundos = ahora.getSeconds().toString().padStart(2, "0");
    this.fechaActual = `${diaSemana} ${dia}/${mes}/${anio}`;
    this.horaActual = `${horas}:${minutos}:${segundos}`
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
        this.vdE.height = 150;
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
        this.form.get("foto")?.setValue(this.fotoCapturada); // Asignar al formulario
        this.mostrarCamara = false; // Ocultar la cámara después de capturar la foto
        // this.Doc.archivo = this.fotoCapturada
        if (this.vdE.srcObject) {
          const stream = this.vdE.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop()); // Detener la cámara
        }
      }
    }
    this.bCamara = true;
  }

  cambioTipoVisitante(e: any) {
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1)

    if (e.value == 1) {
      this.form.get("cargo")?.disable();
      this.form.get("nmilitar")?.disable();
      this.sGrado = "Grado / Jerarquía";
    } else {
      this.form.get("cargo")?.enable();
      this.form.get("nmilitar")?.enable();
      this.sGrado = "Cargo";
    }

    this.form.get("comando")?.setValue("100");
    this.form.get("forigen")?.setValue(hoy);
    this.form.get("fplazo")?.setValue(manana);
    console.log(this.form.value);
  }

  guardar() {
    this.ngxService.startLoader("loader-aceptar");
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
    let nameID = btoa("F_" + this.Doc.remitente); //esta es la llave de la carpeta
    let nmb = this.Doc.remitente + ".png" //id de la imagen en BD
    this.Doc.archivo = nmb;
    // console.log(this.Doc);

    const base64Data = this.form.get("foto")?.value.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const formData = new FormData();
    
    formData.append("archivos", blob, nmb );
    formData.append("identificador", nameID);

    this.apiService.EnviarArchivos(formData).subscribe(
      (data) => {
        this.registrar();
        console.log("Archivo enviado correctamente:", data);
        // this.limpiarDoc
      },
      (error) => {
        console.error("Error al enviar la foto:", error);
      }
    );
  }

  limpiarDoc() {
    this.cancelar();
    this.form.reset();
  }

  //registrar Un documento pasando por el WorkFlow

  /**
   * Consultar datos generales del militar
   */
  consultarCedula() {
    this.ngxService.startLoader("loader-aceptar");
    if (this.form.get("cedula")?.value == "") return false;
    this.isPunto = true;
    if (
      this.Doc.tipo.toLowerCase() == "destitucion/punto de cuenta" ||
      this.Doc.tipo.toLowerCase() == "contratos/punto de cuenta"
    ) {
      this.isPunto = false;
    } else {
      this.xAPI.funcion = "MPPD_CDatosBasicos";
      this.xAPI.parametros = this.form.get("cedula")?.value;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data);
          if(data){
            let militar = data.Cuerpo[0];
            this.form.get("cargo")?.setValue(militar.descripcion);
            this.form.get("nmilitar")?.setValue(militar.nombres);
            this.ngxService.stopLoader("loader-aceptar");
          }else{
            this.ngxService.stopLoader("loader-aceptar");
            console.error("CEDULA INVALIDA");
          }
        },
        (error) => {
          this.ngxService.stopLoader("loader-aceptar");
          console.error("Error de conexion a los datos ", error);
        }
      );
    }
  }

  cancelar() {
    if (this.bCamara == true) {
      this.bCamara = false;
      this.form.get("foto")?.setValue("");
      this.iniciarCamara();
    }
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
    this.obtenerWorkFlow();

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data);
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (xdata) => {
            this.aceptar();
            this.ngxService.stopLoader("loader-aceptar");
          },
          (error) => {
            this.toastrService.error(data.msj, `GDoc Wkf.Documento.Detalle`);
            this.ngxService.stopLoader("loader-aceptar");
          }
        );
      },
      (error) => {
        var mensaje = error + " - " + this.xAPI.funcion;
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
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
    this.xAPI.funcion = "WKF_IDocumentoDetalleFile";

    this.Doc.ncontrol = this.utilService.Semillero(data.msj).toUpperCase();

    this.Doc.wfdocumento = parseInt(data.msj);
    this.Doc.fcreacion = this.utilService.convertirFechaVEN(this.Doc.fcreacion);
    this.Doc.forigen =
      this.forigen != undefined
        ? this.utilService.convertirFechaVEN(this.Doc.fcreacion)
        : this.utilService.convertirFechaVEN(this.Doc.forigen);

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
    this.WAlerta.fecha = this.utilService.convertirFechaVEN(this.Doc.forigen);
    this.xAPI.funcion = "WKF_IAlerta";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
  }

  aceptar() {
    if (this.activarMensaje) return false;
    this.activarMensaje = true;
    Swal.fire({
      title: "El visitante se ha registrado exitosamente",
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
      } else {
        this.limpiarDoc();
      }
    });
  }



}
