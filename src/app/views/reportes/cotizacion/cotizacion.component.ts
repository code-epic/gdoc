import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { ApiService, IAPICore} from 'src/app/services/apicore/api.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util/util.service';
import { Cotizaciones } from 'src/app/services/ayudantia/cotizacion.service';

 


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss'],
  
})



export class CotizacionComponent implements OnInit {



  public fecha: NgbDate | null
  public vigencia: NgbDate | null
  public flapsoDate: NgbDate | null
 

  public Cotizaciones: Cotizaciones = {
    identificador : 0,
    nombre: '',
    fecha: '',
    vigencia: '',
    objeto: '',
    total: 0,
    pagado: 0,
    deuda: 0,
    garantia: '',
    moneda: '',
    lapso: '',
    modalidad: '',
    forma_pago: '',
    responsable: '',
    cargo_responsable: '',
    usuario: '',
    obseravacion: ''
  }

  public xAPI: IAPICore = {
    funcion: ''

  };


  constructor(
    private apiService: ApiService,
    private rutaActiva: ActivatedRoute,
    public utilService: UtilService,
    public formatter: NgbDateParserFormatter,) { }

  ngOnInit(): void {
    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
        this.ObtenerCotizacion(id)
      }

  }

  async ObtenerCotizacion(id: string) {
    // const base = atob(numBase64)
    this.xAPI.funcion = 'MPPD_CCotizacion'
    this.xAPI.parametros = id
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.Cotizaciones = data.Cuerpo[0]
        this.fecha = NgbDate.from(this.formatter.parse(this.Cotizaciones.fecha.substring(0, 10)))
        this.vigencia = NgbDate.from(this.formatter.parse(this.Cotizaciones.vigencia.substring(0, 10)))
      },
      (error) => {

      }
    )
  }

}
