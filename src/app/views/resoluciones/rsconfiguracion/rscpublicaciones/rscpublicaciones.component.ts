import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  openDialog() {
    const dialogRef = this.dialog.open(TableRsreportesModalComponent, {
      width: '100%',
      height: 'auto',
      data: {
        componente_id : this.componente.split('|')[0],
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

  @Input() formularioAGenerar = 0;
  txtBoton: string = 'Reporte'

  selected = new FormControl(0);
  componente = '0'
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
  lstEspecialidad = []
  lstEstudios = []

  codigos = '1'
  bxls = false
  dbDatosNombre = false

  lstNombres = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }

  public csvHead: any
  public csvHeadFile: any
  public delimitador: string = ','


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
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))).slice(0, 8)
        : [];
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : [];
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : [];

    await this.consultarPromociones()

    switch(this.formularioAGenerar){
      case 1: 
          this.txtBoton = 'Codigos Rojos'
          break
        case 2:
          this.txtBoton = 'Bajas'
          break
        case 3:
          this.txtBoton = 'Nombramientos'
          break
        case 4:
          this.txtBoton = 'Ascensos'
          break
        default:
          this.txtBoton = 'Reporte'
    }
    
  }


  consultarPromociones() {

    this.xAPI.funcion = 'MPPD_CPromociones'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstPromocion = data.Cuerpo
      },
      error => { }

    )
  }

  consultarEspecialidades() {
    let cmp = this.componente.split('|')[0]
    this.lstEspecialidad = []
    this.xAPI.funcion = 'MPPD_CEspecialidad'
    this.xAPI.parametros = cmp
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstEspecialidad = data.Cuerpo
      },
      error => { }

    )
  }

  consultarEstudios() {
    let cmp = this.componente.split('|')[0]
    this.lstEspecialidad = []
    this.xAPI.funcion = 'MPPD_CEstudios'
    this.xAPI.parametros = cmp
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lstEstudios = data.Cuerpo
      },
      error => { }

    )
  }



  /**
   * 
   */
  consultarListado() {
    if ( this.componente == '0'){
      this.toastrService.warning(
        'Debe seleccionar un componente',
        `GDoc Generales`
      )
      return
    } 

    if(this.codigos == "0") {
      this._snackBar.open("Debe seleccionar un codigo", "OK");
      return;
    }
    this.ngxService.startLoader("loader-buscar");
    this.xAPI.funcion = 'MPPD_CCodigosRojos'
    this.xAPI.parametros = this.codigos
    this.xAPI.valores = ''
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
        this.dbDatosNombre = false
        this.bxls = false
      }

    )
  }

  downloadCSVEx() {
    this.consultarListado()
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
