import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-rseliminaciones",
  templateUrl: "./rseliminaciones.component.html",
  styleUrls: ["./rseliminaciones.component.scss"],
})
export class RseliminacionesComponent implements OnInit {
  public numero: string = "";
  public cedula: string = "";
  public resolucion: string = "";
  public total: number = 0;

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };
  public lstResoluciones: any;
  public detalle: boolean = false;

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  consultarResolucion(event) {
    this.detalle = false;
    if (event == undefined || event.charCode == 13) {
      if (this.numero == "") return false;
      this.ngxService.startLoader("loader-eliminar");
      this.xAPI.funcion = "MPPD_CResolucionesGrupo";
      this.xAPI.parametros = this.numero;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data);
          this.resolucion = this.numero;
          this.numero = "";
          this.detalle = true;

          this.lstResoluciones = data.Cuerpo;
          this.total = this.lstResoluciones.length;
          if (this.total == 0) {
            this.detalle = false;
          }
          this.ngxService.stopLoader("loader-eliminar");
        },
        (error) => {
          console.error("Error de conexion a los datos ", error);
          this.ngxService.stopLoader("loader-eliminar");
        }
      );
    }
  }

  eliminar(fecha : string) {
    this.ngxService.startLoader("loader-eliminar");
    this.xAPI.funcion = "MPPD_EResoluciones";
    this.xAPI.parametros = this.resolucion + ',' + fecha;
    console.log(this.xAPI.parametros)
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.detalle = false;
        this.lstResoluciones = []

        this.toastrService.error(
          "La resolucion ha sido eliminada con exito",
          `GDoc Resoluciones`
        );
        this.ngxService.stopLoader("loader-eliminar");
      },
      (error) => {
        console.error("Error de conexion a los datos ", error);
        this.ngxService.stopLoader("loader-eliminar");
      }
    );
  }
}
