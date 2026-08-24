import { Component, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectorRef } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { ExcelService } from "src/app/services/util/excel.service";
import { UtilService } from "src/app/services/util/util.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-rsreportes",
  templateUrl: "./rsreportes.component.html",
  styleUrls: ["./rsreportes.component.scss"],
})
export class RsreportesComponent implements OnInit, OnDestroy {
  titulo: string = "Reportes";
  bmenu = true;
  lst: any[] = [];
  xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public fotosCumpleanios: { [cedula: string]: SafeUrl | string } = {};
  public loadingFotos: { [cedula: string]: boolean } = {};
  private rawUrlsMap: { [cedula: string]: string } = {};
  public isBirthdayReport: boolean = false;

  constructor(
    private excelService: ExcelService,
    private ngxService: NgxUiLoaderService,
    private utilService: UtilService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilService.onChange$.subscribe((e) => {
      console.log(e);
      this.bmenu = e;
    });
  }

  /**
   * @param n
   * 0: Ninguno
   * 1: Codigos Rojos
   * 2: Bajas
   * 3: Administracion
   * 4: Ascensos
   */
  cambiarFormulario(n: number) {
    switch (n) {
      case 1:
        this.isBirthdayReport = false;
        this.titulo = "Administración Pública";
        this.consultarAdministracion();
        break;
      case 2:
        this.isBirthdayReport = true;
        this.titulo = "Cumpleañeros";
        this.consultarCumpleanios();
        break;
    }
  }

  consultarAdministracion() {
    this.ngxService.startLoader("lbuscar");
    this.xAPI.funcion = environment.funcion.CONSULTAR_ADMINISTRACION;
    this.xAPI.parametros = "";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data);
        this.lst = data.Cuerpo;
        this.ngxService.stopLoader("lbuscar");
        this.bmenu = false;
      },
      (error) => {
        this.ngxService.stopLoader("lbuscar");
        this.bmenu = true;
      },
    );
  }

  volver() {
    this.bmenu = true;
  }

  exportExcel(): void {
    let xlsx = [];
    this.lst.forEach((e) => {
      xlsx.push({
        Grado: e.ngrado,
        Componente: e.ncomponente,
        Nombre: e.nombres_apellidos,
        Categoria: e.n_categoria,
        Especialidad: e.especialidad,
        Cedula: e.cedula,
        Promocion: e.fecha_promocion,
        "Admin. Dias": e.dias,
        "Admin. Años": e.total,
        Ente: e.des_reserva,
        Retorno: e.fecha_fin_periodo,
      });
    });
    this.excelService.exportToExcel(xlsx, "administracion_export");
  }

  consultarCumpleanios() {
    this.ngxService.startLoader("lbuscar");
    this.xAPI.funcion = environment.funcion.CONSULTAR_CUMPLEANIOS;
    this.xAPI.parametros = "";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data);
        this.lst = data.Cuerpo || [];
        this.ngxService.stopLoader("lbuscar");
        this.bmenu = false;
        this.loadPhotosForBirthdays();
      },
      (error) => {
        this.ngxService.stopLoader("lbuscar");
        this.bmenu = true;
      }
    );
  }

  loadPhotosForBirthdays() {
    this.lst.forEach((militar) => {
      const cedula = militar.cedula;
      if (cedula && !this.fotosCumpleanios[cedula]) {
        this.getPhotoId(cedula);
      }
    });
  }

  getPhotoId(cedula: string) {
    if (cedula && cedula.toString().trim() !== "") {
      this.loadingFotos[cedula] = true;
      const payload = {
        ruta: "img/temp/" + cedula + "/",
        archivo: "foto.jpg",
      };
      this.apiService.postBlob("federate/sssifanb/dwscdn", payload).subscribe({
        next: (data: Blob) => {
          this.loadingFotos[cedula] = false;
          if (data && data.size > 0) {
            if (this.rawUrlsMap[cedula]) {
              URL.revokeObjectURL(this.rawUrlsMap[cedula]);
            }
            const objectUrl = URL.createObjectURL(data);
            this.rawUrlsMap[cedula] = objectUrl;
            this.fotosCumpleanios[cedula] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          } else {
            this.fotosCumpleanios[cedula] = "";
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loadingFotos[cedula] = false;
          console.error("Error al cargar la foto para " + cedula + ":", error);
          this.fotosCumpleanios[cedula] = "";
          this.cdr.detectChanges();
        },
      });
    }
  }

  obtenerFoto(cedula: string): SafeUrl | string {
    if (this.fotosCumpleanios[cedula]) {
      return this.fotosCumpleanios[cedula];
    }
    return "https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/" + cedula + "/foto.jpg";
  }

  ngOnDestroy(): void {
    for (const key in this.rawUrlsMap) {
      if (this.rawUrlsMap.hasOwnProperty(key)) {
        const url = this.rawUrlsMap[key];
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    }
  }
}
