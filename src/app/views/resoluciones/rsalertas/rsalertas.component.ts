import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { RsconsultaSessionService } from 'src/app/services/resoluciones/rsconsulta-session.service';
import { ExcelService } from 'src/app/services/util/excel.service';
import { MensajeService } from 'src/app/services/util/mensaje.service';
import { UtilService } from 'src/app/services/util/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rsalertas',
  templateUrl: './rsalertas.component.html',
  styleUrls: ['./rsalertas.component.scss']
})
export class RsalertasComponent implements OnInit {

  bxls = false
  dbDatosNombre = false
  bFrm = false

  lstAlertas = []
  lstReicorporaciones = []

  xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }

  csvHead: any
  csvHeadFile: any
  delimitador: string = ','

  Componentes = []
  Grados = []
  Categorias = []
  Clasificaciones = []

  componente = ''
  situacion = ''
  categoria = ''
  clasificacion = ''
  grado = ''

  tipo = ''
  resolucion = ''

  selected = new FormControl(0);

  posicion = 0
  txtObservacion = ''
  id : number = 0 



  constructor(
    private ngxService: NgxUiLoaderService,
    private router: Router, 
    private rsconsultaSessionService: RsconsultaSessionService,
    private msj: MensajeService, 
    private excelService: ExcelService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private apiService: ApiService,) { }

  ngOnInit(): void {

    const datos = this.rsconsultaSessionService.cargarDatosDesdeSession(environment);
    this.Componentes = datos.Componentes;
    this.Grados = datos.Grados;
    this.Categorias = datos.Categorias;
    this.Clasificaciones = datos.Clasificaciones;
  
    let alertas = {
      'tipo': 'alerta',
      'valor': true
    }
    this.msj.contenido$.emit(alertas)
    this.ConsultarAlertas()
    this.ConsultarReincorporaciones()

  }

  ConsultarAlertas() {
    this.ngxService.startLoader('loader-buscar')
    this.xAPI.funcion = environment.funcion.MPPD_CAlertasResoluciones
    this.xAPI.valores = ''
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
        this.lstAlertas = data.Cuerpo.filter((e: any) => {
          return e.numero == null && e.tipo != 98 && e.observacion == ''
        })
        // this.csvHead = data.Cabecera;
        this.ngxService.stopLoader('loader-buscar')
      },
      (error) => {
        console.log(error);
        this.ngxService.stopLoader('loader-buscar')
      }
    )
  }

  ConsultarReincorporaciones() {
    this.ngxService.startLoader('loader-buscar')
    this.xAPI.funcion = environment.funcion.MPPD_CAlertasReicorporacion
    this.xAPI.valores = ''
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
        this.lstReicorporaciones = data.Cuerpo
        this.ngxService.stopLoader('loader-buscar')
      },
      (error) => {
        console.log(error);
        this.ngxService.stopLoader('loader-buscar')
      }
    )
  }



    exportExcel(): void {
      let xlsx = []
      this.lstAlertas.forEach((e) => {
        xlsx.push({
          'Grado': e.ngrado,
          'Componente': e.ncomponente,
          'Nombre': e.nombres_apellidos,
          'Cedula': e.cedula,
          'Asunto': e.asunto,
          'Comision': e.inicio_comision,
          'Fin Comision': e.fin_comision,
          'Numero Resolucion': e.numero_resol,
          'Dias Restantes': e.dias_restantes, 
         
        })
      })
      this.excelService.exportToExcel(xlsx, 'alertas_export');
    }

    exportExcelReincorporaciones(): void {
      let xlsx = []
      this.lstReicorporaciones.forEach((e) => {
        xlsx.push({
          'Grado': e.ngrado,
          'Componente': e.ncomponente,
          'Nombre': e.nombres_apellidos,
          'Cedula': e.cedula,
          'Fecha Resolucion': e.fecha_resol,
          'Asunto': e.asunto,
          'Numero Rßesolucion': e.numero_resol,
          'Dias Restantes': e.dias_restantes, 
         
        })
      })
      this.excelService.exportToExcel(xlsx, 'alertas_export');
    }

 

    dwUrl(e){
      this.router.navigate(['/rsprocesos/rsconsulta/', e.cedula]);
    } 


    abrirModal(content: any, e: any, i: number) {
     
      this.tipo = e.des_resol
      this.resolucion = e.numero_resol
      this.posicion = i
      this.id = e.id
 
        let modalRef = this.modalService.open(content, {
            centered: true,
            windowClass: "my-custom-modal-class",
            size: "md",
            backdrop: false,
        });

        modalRef["_windowCmptRef"].location.nativeElement.style.zIndex = "900";
    }
    
    insertarObservacion() {
      if(this.txtObservacion == ''){
        this.toastrService.error(
          'Debe ingresar una observacion',
          `GDoc Alertas`
        );
        return
      } 
      this.ngxService.startLoader('loader-buscar')
      this.xAPI.funcion = environment.funcion.MPPD_UAlertasResoluciones
      this.xAPI.valores = ''
      this.xAPI.parametros = `66,${this.txtObservacion.toUpperCase()},${this.id}`
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data: any) => {
          this.lstAlertas.splice(this.posicion, 1)  
          this.ngxService.stopLoader('loader-buscar')
          this.modalService.dismissAll('Save')
        },
        (error) => {
          console.log(error);
          this.ngxService.stopLoader('loader-buscar')
          this.modalService.dismissAll('Save')
        }
      )
    }
    

}
