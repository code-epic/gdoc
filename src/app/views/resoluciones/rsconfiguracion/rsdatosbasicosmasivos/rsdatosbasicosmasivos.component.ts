import { Component, Injectable, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { IDatosBasicos } from "src/app/services/resoluciones/resolucion.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { CargaMasiva } from "../rsccargamasiva/rsccargamasiva.component";

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
  selector: "app-rsdatosbasicosmasivos",
  templateUrl: "./rsdatosbasicosmasivos.component.html",
  styleUrls: ["./rsdatosbasicosmasivos.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class RsdatosbasicosmasivosComponent implements OnInit {

  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;

  public DBasico: IDatosBasicos = {
    cedula: "",
    nombres: "",
    categoria: 0,
    grado: 0,
    componente: 0,
    clasificacion: 0,
    resolucion: 0,
    solicitud: 0,
    reserva: 0,
    fecha: "",
    promocion: "",
    sexo: "",
    profesion: "",
    profesionx: "",
    nacimiento: "",
    orden: 0,
    n_grado: 0,
    n_componente: 0,
    especialidad: "",
    area: "",
    estudios: "",
    condicion: 3,
    anio: 0,
    mes: 0,
    dia: 0,
    ultimo_ascenso: "",
    motivo: "",
    observacion: "",
    situacion: "",
    telefono: "",
    correo: "",
    ubicacion: "",
    cargo: "",
    estadomayor: ""
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

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  llave: string;
  hashcontrol: string;
  public ingreso: any = "";
  public ascenso: any = "";
  placement = "bottom";
  public archivos: any;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
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

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit(): void {
    this.llave = this.utilService.GenerarUnicId();
    this.hashcontrol = btoa("ING" + this.llave);
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
  }

  fileSelected(e) {
    this.archivos = e.target.files;
  }

  protected aceptar(msj: string) {
    Swal.fire({
      title: "El registro de nuevos ingresos ha sido realizado ",
      text: "Continuar...",
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) this.ruta.navigate(["/rsconfiguracion"]);
    });
  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: "lg" });
  }

  resetearFechas(active: boolean) {
    this.ingreso = "";
  }

  async SubirArchivo() {
    if (this.ingreso == "") {
      this._snackBar.open("Debe indicar una fecha", "OK");
      return;
    }
    this.ngxService.startLoader("loader-aceptar");
    var frm = new FormData(document.forms.namedItem("forma"));
    try {
      await this.apiService.EnviarArchivos(frm).subscribe((data) => {
        this.ValoresMasivos();
      });
    } catch (error) {
      console.error(error);
      this.ngxService.stopLoader("loader-aceptar");
    }
  }

  ValoresMasivos() {
    this.cargaMasiva = {
      llave: this.llave,
      nombre: "NUEVOS INGRESO",
      funcion: "IngresosEnLote",
      ruta: this.hashcontrol,
      pdf: "",
      csv: this.archivos[0].name,
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
        this.EjecutarIngreso();
      },
      (errot) => {
        console.log(errot);
        this.toastrService.warning(
          errot,
          `Ocurrio un error en la carga verifique la red o que se encuentre conectado al servidor`
        );
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }

  EjecutarIngreso() {
    let wingreso = {
      llave: this.llave,
      fecha_promocion: this.utilService.ConvertirFechaDia(this.ingreso),
      categoria: this.DBasico.categoria,
      grado: this.DBasico.grado,
      clasificacion: this.DBasico.clasificacion,
      componente: this.DBasico.componente,
      usuario: this.loginService.Usuario.cedula,
    };

    this.apiService.EjecutarIngreso(wingreso).subscribe(
      (data) => {
        this.ngxService.stopLoader("loader-aceptar");
        this.resetearFechas(true);
        this.llave = this.utilService.GenerarUnicId();
        this.aceptar("");
      },
      (errot) => {
        console.log(errot);
        this.toastrService.warning(
          errot,
          `Ocurrio un error en la carga verifique la red o que se encuentre conectado al servidor`
        );
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }



  Limpiar() {
    this.DBasico = {
      cedula: "",
      nombres: "",
      categoria: 0,
      grado: 0,
      componente: 0,
      clasificacion: 0,
      resolucion: 0,
      solicitud: 0,
      reserva: 0,
      fecha: "",
      promocion: "",
      sexo: "",
      profesion: "",
      profesionx: "",
      nacimiento: "",
      orden: 0,
      n_grado: 0,
      n_componente: 0,
      especialidad: "",
      area: "",
      estudios: "",
      condicion: 3,
      anio: 0,
      mes: 0,
      dia: 0,
      ultimo_ascenso: "",
      motivo: "",
      observacion: "",
      situacion: "",
      telefono: "",
      correo: "",
      ubicacion: "",
      cargo: "",
      estadomayor: ""
    };
  }
}
