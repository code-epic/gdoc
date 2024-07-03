import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";

import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import Swal from "sweetalert2";
import { Resolucion } from "src/app/services/control/documentos.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { AngularEditorConfig } from "@kolkov/angular-editor";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  IDatosBasicos,
  IResoluciones,
} from "src/app/services/resoluciones/resolucion.service";
import { ToastrService } from "ngx-toastr";

import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";

export interface ITipoResolucion {
  codigo: string;
  nombre: string;
}

export interface IConfiguracion {
  id: string;
  nomb: string;
}

interface UResoluciones {
  numero: string;
  fecha_resolucion: string;
  asunto: string;
  archivo: string;
  modificado: string;
  instrucciones: string;
  observacion: string;
  distribucion: string;
  identificador: number;
  reserva: number;
  solicitud: number;
  falta: string;
}

export interface CargaMasiva {
  llave: string;
  nombre: string;
  funcion: string;
  ruta: string; //cencrypt
  pdf: string; //cencrypt
  csv: string; //cencrypt
  log: string;
  estatus: number;
  usuario: string;
}

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "/";

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : "";
  }
}

@Component({
  selector: "app-rsccargamasiva",
  templateUrl: "./rsccargamasiva.component.html",
  styleUrls: ["./rsccargamasiva.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class RsccargamasivaComponent implements OnInit {
 

  public id: string = "";

  @Input() resolucion: any;

  public estadoActual = 1;
  public estadoOrigen = 1;

  public fecha: any;
  public vigencia: any;

  placement = "bottom";

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public lstEstructura = [];

  public searchView = "none";
  public contentView = "";
  public focus = false;

  public IResolucion: IResoluciones = {
    grado: 0,
    anio: 0,
    asunto: "",
    cedula: "",
    pais: 0,
    reserva: 0,
    solicitud: 0,
    tipo: 0,
    unidad: 0,
    comando: "",
    comision_fin: "",
    comision_inicio: "",
    creador: "",
    destino: "",
    dia: 0,
    distribucion: "0",
    estatus: 0,
    modificado: "",
    fecha_termino: "",
    falta: "",
    registro: "",
    fecha_resolucion: "",
    formato: "",
    ultimo_ascenso: "",
    instrucciones: "",
    mes: 0,
    autor_modificar: "",
    motivo: "",
    numero: "",
    observacion: "",
    orden_merito: 0,
    otro_resuelto: "",
    autor_registro: "",
    termino: 0,
    unidad_texto: "",
    documento: 0,
    causa: 0,
    archivo: "",
  };

  public UResolucion: UResoluciones = {
    numero: "",
    fecha_resolucion: "",
    asunto: "",
    modificado: "",
    archivo: "",
    instrucciones: "",
    observacion: "",
    distribucion: "0",
    identificador: 0,
    reserva: 0,
    solicitud: 0,
    falta: "",
  };

  public Resolucion: Resolucion = {
    id: "",
    cuenta: "",
    unidad: "",
    fecha_doc: "",
    tipo: {},
    cedula: "",
    nombres: "",
    fecha_nacimiento: "",
    componente: "",
    categoria: "",
    clasificacion: "",
    grado: "",
    carpeta: "",
    estatus: "",
    entrada: "",
    asunto: "",
    observacion: "",
    responsable: "",
    cargo_responsable: "",
    situacion: "",
    sexo: "",
    numero: "",
    gran_comando: "",
    unidad_comando: "",
    instrucciones: "",
    n_componente: 0,
    n_grado: 0,
  };

  public cargaMasiva: CargaMasiva = {
    llave: "",
    nombre: "",
    funcion: "",
    ruta: "",
    pdf: "",
    csv: "",
    log: "",
    estatus: 0,
    usuario: "",
  };


  public IDatosBasicos: IDatosBasicos = {
    area: "",
    cedula: "",
    categoria: 0,
    clasificacion: 0,
    componente: 0,
    grado: 0,
    profesion: "",
    profesionx: "",
    reserva: 0,
    solicitud: 0,
    condicion: 0,
    especialidad: "",
    estudios: "",
    nacimiento: "",
    promocion: "",
    fecha: "",
    n_componente: 0,
    n_grado: 0,
    nombres: "",
    sexo: "",
    resolucion: 0,
    orden: 0,
    anio: 0,
    mes: 0,
    dia: 0,
    ultimo_ascenso: "",
    motivo: "",
    observacion: "",
    situacion: "",
  };

  //Lista de sobrecargas
  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public TipoEntradas: any;
  public Estados: any;
  public Carpetas: any;
  public OrdenNumero: any;

  public distribucion: string = "";

  public fecha_resolucion: any;
  public ultimo_ascenso: any;
  public comision_inicio: any;
  public comision_fin: any;

  public cuenta: string = "";
  public identificador: string = "";

  public lstResoluciones: any;
  public lstEntradas: any;
  public lstT = []; //Objeto Tipo documento
  public lstR = []; //Objeto Remitente
  public lstCuenta = []; //Objeto Unidad

  public lstHzAdjunto = []; //Historico de documentos adjuntos
  public lstTraza = [];
  public lstHistorial = [];
  public lstImg = [];
  public titulo = "Documento";

  public bHistorial = false;
  public bPDF = false;
  public editar_datos = false;

  public nControl = "";

  public value = "";

  public download: any;

  public bHist = false;
  public unidad: string = "";
  public asunto: string = "";
  public nombramiento: string = "";
  public xasunto: string = "";
  public cresolucion = "";
  public fresolucion = "";
  public aresolucion = "";
  public autor_creador = "";
  public autor_modificador = "";
  public fecha_edicion = "";
  public fecha_registro = "";
  public destino = "";

  public blNombramiento: boolean = false;
  public blCorregir: boolean = false;
  public blReserva: boolean = false;
  public blReservaAux: boolean = false;
  public blComision: boolean = false;
  public blComisionAux: boolean = false;
  public blExtender: boolean = false;
  public blAscenso: boolean = false;
  public blReconocer: boolean = false;
  public blCategoria: boolean = false;
  public blComponente: boolean = false;
  public blAceptar: boolean = false;
  public blAlert: boolean = false;
  public blCalendar: boolean = false;

  public foto_cedula: string = "";

  

  filteredOptions: Observable<ITipoResolucion[]>;
  myControl = new FormControl();
  public TipoResoluciones: any;

  public lstCausa: any; //Objeto Comando
  public lstMotivo: any; //Objeto Comando
  public lstDetalle: any; //Objeto Comando
  public lstPais: any; //Objeto Comando
  public GradoIPSFA: any; //Objeto Comando
  public lstIPSFA: any; //Objeto Comando
  public lstC: any; //Objeto Comando
  public archivos: any;

  public hashcontrol = "";
  public CuentaGenera: any;
  public tipo: any;
  public ctipo: any;
  public cod_resol_tipo: any;
  public nombres: string = "";

  public buscar: any;
  public estructura_detalle = "";

  public Configuracion: any;
  filteredUnidad: Observable<ITipoResolucion[]>;
  myUnidad = new FormControl();
  public Unidad: any;
  public maxCol = "12";
  public maxColComision = "6";
  public color = "#e3e6e6";
  public files = {
    pdf: "",
    csv: "",
    hash: "",
  };
  model1: string
  model2: string
  llave: string
  archivo_otro: string
  otra_llave: string 
  public lstHistorico = []

  public btncargando : boolean = true

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private _snackBar: MatSnackBar,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private ruta: Router
  ) {}

  ngOnInit(): void {


    this.lstHistorico = sessionStorage.getItem("historico") != undefined ? JSON.parse(sessionStorage.getItem("historico")) : []


    this.llave = this.utilService.GenerarUnicId();
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
    this.TipoEntradas =
      sessionStorage.getItem("MPPD_CTipoEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada")))
        : [];
    this.TipoResoluciones =
      sessionStorage.getItem("MPPD_CTipoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion")))
        : [];
    this.Estados =
      sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion")))
        : [];
    this.Carpetas =
      sessionStorage.getItem("MPPD_CCarpetaEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetaEntrada")))
        : [];
    this.OrdenNumero =
      sessionStorage.getItem("MPPD_COrdenEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_COrdenEntrada")))
        : [];
    this.GradoIPSFA =
      sessionStorage.getItem("MPPD_CGradoIPSFA") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGradoIPSFA")))
        : [];

    // console.log(this.Categorias)

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) => (name ? this._filter(name) : this.TipoResoluciones.slice()))
    );

    this.filteredUnidad = this.myUnidad.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) =>
        name ? this._filterConfiguracion(name) : this.lstC.slice()
      )
    );
    // this.resolucion = this.resolucion

    //console.log(this.resolucion.rs);
    //console.log(this.loginService.Usuario.cedula);
    // this.IResolucion.numero = this.resolucion.rs
    this.getResueltoID('13',7);
  }

  SelTipo(e) {
    if ( e.value == 3) {
      this.getResueltoID('35',3);
    }else {
      this.getResueltoID('13',7);
    }
    console.log(e.value, " SELECCIONAR TIPO")
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  activarCalendar() {
    this.blCalendar = true;
  }

  atras() {
    this.searchView = "none";
    this.contentView = "";
  }

  asignar(e) {
    this.IResolucion.unidad = e.oid;
    this.IResolucion.unidad_texto = this.validarNivel(e);
    this.searchView = "none";
    this.contentView = "";
    this.lstEstructura = [];
  }

  validarNivel(obj: any): string {
    let detalle = "";
    let tab = "   ";
    let contenido = "";
    let el = Object.entries(obj);
    let i = 0;

    for (let [key, value] of el) {
      if (key.substring(0, 5) == "nivel" && value != "") {
        if (i == 0) this.IResolucion.comando = value + "\n";
        contenido = value + "";
        detalle += tab + "> " + value + "\n";
        tab += "   ";
        i++;
      }
    }
    this.estructura_detalle = detalle;
    return contenido;
  }

  Consultar(e) {
    if (e.keyCode == 13) {
      this.xAPI.funcion = "MPPD_CUnidad";
      this.xAPI.parametros = this.buscar;
      this.xAPI.valores = "";

      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstEstructura = data.Cuerpo;
          this.buscar = "";
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  viewUnidad() {
    this.searchView = "";
    this.contentView = "none";
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }
  /**
   * Consultar datos generales del militar
   */
  getResueltoID(tipo_resolucion: string, tipo_reserva: number) {
    //console.log(this.resolucion.rs.id);

    //this.tipo = tipo_resolucion=="13"?"ASCENSO":"CORRERGIR - ASCENSO";
    this.IResolucion.tipo = tipo_resolucion=="13"?13:35;
    this.ctipo = tipo_resolucion;
    this.cod_resol_tipo = tipo_reserva; //VER CLASIFICACION DEL TIPO DE RESOLUCION

    this.distribucion = "0";
    //this.IResolucion.documento = 0;

    // rs.distribucion
    // this.IResolucion.distribucion = "4";
    this.seleccionTipo();
  }

  filtrarNombramiento() {
    const nombramiento = this.lstResoluciones[0];
    this.nombramiento =
      nombramiento.titulo + " - " + nombramiento.tipo_descripcion;
    this.xasunto = nombramiento.asunto.substring(0, 100);
  }

  verHistorialMilitar() {}

  async cargarGradosIPSFA(componente: number) {
    this.lstIPSFA = this.GradoIPSFA.filter((e) => {
      return parseInt(e.componente_id) == componente;
    });
  }

  async seleccionarGradosIPSFA(grado: number) {
    let i = 0;
    let pos = 0;
    this.lstIPSFA.forEach((e) => {
      if (parseInt(e.codigo) == grado) {
        pos = i;
        return;
      }
      i++;
    });
    this.IResolucion.grado = this.lstIPSFA[pos - 1].codigo;
  }

  displayFn(tr: ITipoResolucion): string {
    return tr && tr.nombre ? tr.nombre : "";
  }

  private _filter(name: string): ITipoResolucion[] {
    const filterValue = name.toLowerCase();

    return this.TipoResoluciones.filter((option) =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayFnConfiguracion(tr: IConfiguracion): string {
    return tr && tr.nomb ? tr.nomb : "";
  }

  private _filterConfiguracion(name: string): IConfiguracion[] {
    const filterValue = name.toLowerCase();

    return this.Unidad.filter((option) =>
      option.nomb.toLowerCase().includes(filterValue)
    );
  }

  seleccionTipo() {
    this.desactivarVista();

    let tp = this.cod_resol_tipo;
    console.log(  tp )
    let valor = true;
    this.resetearFechas(false);
    this.blAscenso = true;

    switch (parseInt(tp)) {
      case 3:
        this.maxCol = "6";
        this.blCorregir = true;
        break;
      case 7:
        this.maxCol = "4";
        
        break;
    }

    this.blAceptar = valor;
  }

  desactivarVista() {
    this.blCorregir = false;
    this.blNombramiento = false;
    this.blReserva = false;
    this.blReservaAux = false;
    this.blComision = false;
    this.blComisionAux = false;
    this.blExtender = false;
    this.blAscenso = false;
    this.blReconocer = false;
    this.blCategoria = false;
    this.blComponente = false;
  }

  limpiarFrm() {
    this.IResolucion = {
      grado: 0,
      anio: 0,
      asunto: "",
      cedula: "",
      pais: 0,
      reserva: 0,
      solicitud: 0,
      tipo: 0,
      unidad: 0,
      comando: "",
      comision_fin: "",
      comision_inicio: "",
      creador: "",
      destino: "",
      dia: 0,
      distribucion: "0",
      estatus: 0,
      modificado: "",
      fecha_termino: "",
      falta: "",
      registro: "",
      fecha_resolucion: "",
      formato: "",
      ultimo_ascenso: "",
      instrucciones: "",
      mes: 0,
      autor_modificar: "",
      motivo: "",
      numero: "",
      observacion: "",
      orden_merito: 0,
      otro_resuelto: "",
      autor_registro: "",
      termino: 0,
      unidad_texto: "",
      documento: 0,
      causa: 0,
      archivo: "",
    };
    this.Resolucion = {
      id: "",
      cuenta: "",
      unidad: "",
      fecha_doc: "",
      tipo: {},
      cedula: "",
      nombres: "",
      fecha_nacimiento: "",
      componente: "",
      categoria: "",
      clasificacion: "",
      grado: "",
      carpeta: "",
      estatus: "",
      entrada: "",
      asunto: "",
      observacion: "",
      responsable: "",
      cargo_responsable: "",
      situacion: "",
      sexo: "",
      numero: "",
      gran_comando: "",
      unidad_comando: "",
      instrucciones: "",
      n_componente: 0,
      n_grado: 0,
    };
  }

  vincular() {
   
    if (this.IResolucion.otro_resuelto != "") {
      this.ngxService.startLoader("loader-aceptar");
      this.xAPI.funcion = "MPPD_CResueltoFecha";

      let fre = this.utilService.ConvertirFechaDia(this.fresolucion );
      this.xAPI.parametros = this.IResolucion.otro_resuelto + "," + fre;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          if (data.Cuerpo != undefined) {
            let otro = data.Cuerpo[0];
            this.aresolucion = otro.asunto;
            this.archivo_otro = otro.archivo
            this.otra_llave = otro.llave
          }
        },
        (error) => {
          console.error("Error de conexion a los datos ", error);
          this.ngxService.stopLoader("loader-aceptar");
        }
      );
    }
  }

  open(content) {
    this.modalService.open(content);
  }

  resetearFechas(active: boolean) {
    this.fecha_resolucion = active ? "" : this.fecha_resolucion;
    this.ultimo_ascenso = "";
    this.comision_inicio = "";
    this.comision_fin = "";
  }

  fileSelected(e) {
    this.archivos = e.target.files;

    this.seleccionarFormato();
  }

  seleccionarFormato() {
    let csv,
      pdf = false;
    let i = 0;
    this.hashcontrol = btoa(
      "ASC" + this.IResolucion.numero + this.llave
    );
    for (let index = 0; index < this.archivos.length; index++) {
      const e = this.archivos[index];
      console.log(e.name);
      if (e.name.endsWith(".pdf")) {
        this.files.pdf = e.name;
        pdf = true;
      }

      if (e.name.endsWith("csv")) {
        this.files.csv = e.name;
        csv = true;
      }
    }

    if (csv != pdf) {
      this.toastrService.error(
        "Debe seleccionar almenos dos archivos uno formato .pdf y otro .csv",
        `GDoc MPPD resuelto`
      );
      this.archivos = [];
      document.forms.namedItem("forma").reset();
    }
  }

  evaluarDatos() {
    // this.ngxService.startLoader("loader-aceptar");
    this.IResolucion.fecha_resolucion = this.utilService.ConvertirFechaDia(
      this.fecha_resolucion
    );
    this.IResolucion.ultimo_ascenso = this.utilService.ConvertirFechaDia(
      this.ultimo_ascenso
    );
    this.IResolucion.comision_inicio = this.utilService.ConvertirFechaDia(
      this.comision_inicio
    );
    this.IResolucion.comision_fin = this.utilService.ConvertirFechaDia(
      this.comision_fin
    );
    this.IResolucion.modificado = this.utilService.ConvertirFechaHora();

    this.IResolucion.registro = this.utilService.ConvertirFechaHora();

    this.IResolucion.fecha_termino = this.utilService.ConvertirFechaDia(
      this.comision_fin
    );

    this.IResolucion.asunto = this.IResolucion.asunto.toUpperCase();
    this.IResolucion.instrucciones =
      this.IResolucion.instrucciones.toUpperCase();
    this.IResolucion.observacion = this.IResolucion.observacion.toUpperCase();
    this.IResolucion.autor_modificar = this.loginService.Usuario.cedula;
  }

  async SubirArchivo() {
    
    if (this.IResolucion.numero == "") {
      this._snackBar.open("Debe indicar un numero de resuelto y fecha", "OK");
      return;
    }

    this.btncargando = false

    this.ngxService.startLoader("loader-aceptar");
    this.evaluarDatos();
    this.files.hash = this.hashcontrol;
    
    var frm = new FormData(document.forms.namedItem("forma"));
    try {
      await this.apiService.EnviarArchivos(frm).subscribe((data) => {
        this.ValoresMasivos();
      });
    } catch (error) {
      console.error(error);
      this.ngxService.stopLoader("loader-aceptar")
    }
  }

  ValoresMasivos() {
    
    this.IResolucion.formato = this.llave;

    this.cargaMasiva = {
      llave: this.llave,
      nombre: "RESOLUCION DE ASCENSO",
      funcion: "AscensoEnLote",
      ruta: this.hashcontrol,
      pdf: this.files.pdf,
      csv: this.files.csv,
      log: "INICIANDO PROCOSO",
      estatus: 0,
      usuario: this.loginService.Usuario.cedula,
    };
    this.xAPI.funcion = "MPPD_IResolucionesMasivas";
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.cargaMasiva);

    document.forms.namedItem("forma").reset();

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.EjecutarAscensos();
      },
      (errot) => {
        this.toastrService.warning(
          errot,
          `Ocurrio un error en la carga verifique la red o que se encuentre conectado al servidor`
        );
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }

  EjecutarAscensos() {
    let ascender = {
      llave: this.llave,
      numero : this.IResolucion.numero, 
      tipo : this.IResolucion.tipo.toString(), 
      otro_resuelto: this.IResolucion.otro_resuelto,
      fecha_resuelto: this.utilService.ConvertirFechaDia(this.fresolucion ),
      archivo_resuelto: this.archivo_otro + '|' + this.otra_llave,
      cantidad : this.IDatosBasicos.orden.toString(), 
      categoria: this.IDatosBasicos.categoria,
      componente: this.IDatosBasicos.componente,
      fecha: this.IResolucion.fecha_resolucion,
      ascenso: this.IResolucion.ultimo_ascenso,
      asunto: this.IResolucion.asunto,
      observacion: this.IResolucion.observacion,
      instruccion: this.IResolucion.instrucciones,
      distribucion: this.IResolucion.distribucion,
      grado: this.IResolucion.grado,
      usuario: this.loginService.Usuario.cedula,
    };
    this.apiService.EjecutarProceso(ascender).subscribe(
      (data) => {

        this.lstHistorico.push(this.IResolucion)

        sessionStorage.setItem('historico', JSON.stringify(this.lstHistorico))
        this.ngxService.stopLoader("loader-aceptar");
        
        this.resetearFechas(true);
        this.btncargando = true
        this.limpiarFrm()
        this.aceptar("");
        
      },
      (errot) => {
        this.toastrService.warning(
          errot,
          `Ocurrio un error en la carga verifique la red o que se encuentre conectado al servidor`
        );
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }

  protected aceptar(msj: string) {
    Swal.fire({
      title: "La resolucion ha sido  actualizada con exito ",
      text: "Continuar...",
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) this.ruta.navigate(["/rsprocesos"]);
    });
  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: "lg" });
  }

  protected alerta(msj: string) {
    Swal.fire({
      title: "La resolucion ha sido descargada previamente tantas veces.",
      text: "Ver detalles de la descarga",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ver mas",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      //if (!result.isConfirmed)
      //this.limpiarFrm();
    });
  }
}
