import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import {MatDialog} from '@angular/material/dialog';
import {TableGrallibroModalComponent} from './modal/table-grallibro-modal/table-grallibro-modal.component';


@Component({
  selector: 'app-grallibro',
  templateUrl: './grallibro.component.html',
  styleUrls: ['./grallibro.component.scss'],
})
export class GrallibroComponent implements OnInit {
  selected = new FormControl(0);
  componente = '0'
  situacion = 'ACT'
  promocion = '%'
  especialidad = '%'
  estudios = '%'

  Componentes = []
  lstGenerales = []
  lstPromocion = []
  lstEspecialidad = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }



  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
  ) {

    
   }

  async ngOnInit() {
    
    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : []

    await this.consultarPromociones()
  }
  
  consultarPromociones(){
    this.xAPI.funcion = 'MPPD_CPromociones'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstPromocion = data.Cuerpo
      },
      error => {}

    )
  }

  consultarEspecialidades(){
    let cmp = this.componente.split('|')[0]
    this.lstEspecialidad = []
    this.xAPI.funcion = 'MPPD_CEspecialidad'
    this.xAPI.parametros = cmp
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstEspecialidad = data.Cuerpo
      },
      error => {}

    )
  }
  


  /**
   * 
   */
  consultarListado() {
    let cmp = this.componente.split('|')[0]
    let sit = this.situacion
    let pro = this.promocion
    let esp = this.especialidad
    let est = this.estudios

    this.xAPI.funcion = 'MPPD_CLibroGenerales'
    this.xAPI.parametros = cmp + ',' + sit + ',' + pro + ',' + esp + ',' + est
    this.xAPI.valores = ''

    this.lstGenerales = []
    this.ngxService.startLoader('loader-gennerales')

    console.log(this.xAPI)
    this.apiService.Ejecutar(this.xAPI).subscribe(
       data => {
        console.log(data)
        this.lstGenerales = data.Cuerpo.length > 0 ? data.Cuerpo : []
        this.ngxService.stopLoader('loader-gennerales')
        this.openDialog()

      },
      (error) => {
        console.error('Error de conexion a los datos ', error)
      }
    )
  }

  openDialog() {

    const dialogRef = this.dialog.open(TableGrallibroModalComponent, {
      width: '100%',
      height: 'auto',
      data: {
        componente_id : this.componente.split('|')[0],
        componente: this.componente.split('|')[1],
        lstGenerales: this.lstGenerales,
        lstQa: this.Componentes
        }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }





}
