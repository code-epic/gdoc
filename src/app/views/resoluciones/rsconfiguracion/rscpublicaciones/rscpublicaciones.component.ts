import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { TableRsreportesModalComponent } from '../../rsreportes/modal/table-rsreportes-modal/table-rsreportes-modal.component';

@Component({
  selector: 'app-rscpublicaciones',
  templateUrl: './rscpublicaciones.component.html',
  styleUrls: ['./rscpublicaciones.component.scss']
})
export class RscpublicacionesComponent implements OnInit {
  @Input() formularioAGenerar = 0;
  txtBoton: string = 'Reporte'


  componente = '%'
  situacion = 'ACT'
  promocion = '%'
  especialidad = '%'
  estudios = '%'
  grado = '%'
  clasificacion = '%'
  categoria = '%'

  Componentes = []
  Grados = []
  Categorias = []
  Clasificaciones = []

  lstGenerales = []
  lstPromocion = []

  codigos = '1'
  bxls = false
  dbDatosNombre = false
  bFrm = false

  lstNombres = []

  xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }

  csvHead: any
  csvHeadFile: any
  delimitador: string = ','
  bnombramiento: boolean = false
  bascenso: boolean = false
  bmotivo: boolean = false


  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private utilService: UtilService,
    private _snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {
    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : []

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


    this.txtBoton = this.relfexion()


  }

  relfexion(accion: boolean = false): string {
    let boton = ''
    this.bFrm = false
    this.bmotivo = false
    this.bnombramiento = false
    this.bascenso = false
    switch (this.formularioAGenerar) {
      case 1:
        boton = 'Codigos Rojos'
        this.bFrm = true
        this.bmotivo = true
        if (accion) this.ConsultarCodigosRojos()
        break
      case 2:
        boton = 'Bajas'

        if (accion) this.ConsultarBajas()
        break
      case 3:
        boton = 'Nombramientos'
        this.bnombramiento = true
        if (accion) this.ConsultarNombramientos()
        break
      case 4:
        this.bascenso = true
        boton = 'Ascensos'
        if (accion) this.ConsultarAscenso()
        break
      default:
        boton = 'Reporte'
    }
    return boton
  }


  openDialog() {
    const dialogRef = this.dialog.open(TableRsreportesModalComponent, {
      width: '100%',
      height: 'auto',
      data: {
        componente_id: this.componente.split('|')[0],
        componente: this.componente.split('|')[1],
        lstNombres: this.lstNombres,
        lstGenerales: this.lstGenerales,
        lstQa: this.Componentes
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }



  ConsultarCodigosRojos() {

    if (this.codigos == "0") {
      this._snackBar.open("Debe seleccionar un codigo", "OK");
      return;
    }
    let cmp = this.componente.split('|')[0]
    this.ngxService.startLoader("loader-buscar");
    this.xAPI.funcion = 'MPPD_CCodigosRojos'
    this.xAPI.parametros = `${this.codigos},${cmp},${this.grado},${this.situacion},${this.clasificacion},${this.categoria}`
    this.xAPI.valores = ''
    console.log(this.xAPI.parametros)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.csvHead = data.Cabecera
        this.ngxService.stopLoader("loader-buscar");
        this.lstNombres = data.Cuerpo
        this.dbDatosNombre = true
        this.bxls = true
      },
      error => {
        console.error(error)
        this.ngxService.stopLoader("loader-buscar");
        this.dbDatosNombre = false
        this.bxls = false
      }

    )
  }

  ConsultarBajas() {
    console.log('bajas')
  }

  ConsultarNombramientos() {
    // console.log('bajas')
    let cmp = this.componente.split('|')[0]
    let sit = this.situacion
    let esp = this.especialidad
    let est = this.estudios

    this.xAPI.funcion = 'MPPD_CNombramientos'
    this.xAPI.parametros = this.grado + ',' + cmp + ',' + sit + ',' + esp + ',' + est
    this.xAPI.valores = ''
    console.log(this.xAPI)
    this.ngxService.startLoader("loader-buscar");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        // console.log(data)
        this.csvHead = data.Cabecera
        this.ngxService.stopLoader("loader-buscar");
        this.lstNombres = data.Cuerpo
        this.dbDatosNombre = true
        this.bxls = true
      },
      error => {
        console.error(error)
        this.ngxService.stopLoader("loader-buscar");
        this.dbDatosNombre = false
        this.bxls = false
      }

    )

  }


  filtrarNombramiento(e): string {
    // console.log(e)
    let otro_cargo = e.cargo
    if (e.resoluciones == undefined || e.resoluciones == null) {
      return 'SIN NOMBRAMIENTO';
    }

    let nmb = JSON.parse(e.resoluciones).filter(e => {
      return e.tipo != 13;
    }).sort((a, b) => {
      if (a.fecha > b.fecha) {
        return -1;
      } else if (a.fecha < b.fecha) {
        return 1;
      } else {
        return 0;
      }
    });

    let texto = '';
    if (nmb.length !== 0) {
      if (nmb[0].asunto === undefined) {
        texto = '';
      } else {
        texto = nmb[0].asunto + `<br> RESOL. ${nmb[0].numero} <br> ${nmb[0].fecha}`
      }
    } else {
      texto = 'SIN NOMBRAMIENTO';
    }
    return texto;
  }



  ConsultarAscenso() {
    // console.log('bajas')
    let cmp = this.componente.split('|')[0]
    let sit = this.situacion
    let esp = this.especialidad
    let est = this.estudios

    this.xAPI.funcion = 'MPPD_CNombramientos'
    this.xAPI.parametros = this.grado + ',' + cmp + ',' + sit + ',' + esp + ',' + est
    this.xAPI.valores = ''
    // console.log(this.xAPI)
    this.ngxService.startLoader("loader-buscar");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        // console.log(data)
        this.csvHead = data.Cabecera
        this.ngxService.stopLoader("loader-buscar");
        this.lstNombres = data.Cuerpo
        this.dbDatosNombre = true
        this.bxls = true
      },
      error => {
        console.error(error)
        this.ngxService.stopLoader("loader-buscar");
        this.dbDatosNombre = false
        this.bxls = false
      }

    )

  }


  filtrarAscenso(e) {
    let area = e.area == '' ? '1 DE 1' : e.area
    if (e.resoluciones == undefined || e.resoluciones == null) {
      return 'SIN RESUELTO';
    }
    let asc = JSON.parse(e.resoluciones).filter(e => {
      return e.tipo == 13;
    }).sort((a, b) => {
      if (a.fecha > b.fecha) {
        return -1;
      } else if (a.fecha < b.fecha) {
        return 1;
      } else {
        return 0;
      }
    });
    let texto = ''
    if (asc.length !== 0) {
      let pos = asc[0].orden == 0 ? area : asc[0].orden + ' DE ' + asc[0].cantidad
      texto = `RESOL. ${asc[0].numero} <br> ${asc[0].fecha}`
      // <br> ${pos}
    } else {
      texto = 'SIN RESUELTO'
    }
    return texto
  }


  async downloadCSVEx() {
    await this.relfexion(true)
    let head = this.csvHead.map((e) => {
      console.log(e.nombre);
      return e.nombre;
    });
    this.utilService.downloadFile(
      head,
      this.lstNombres,
      "RC-" + this.utilService.GenerarUnicId(),
      this.delimitador
    );
  }
}
