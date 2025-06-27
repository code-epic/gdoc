import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { ApiService, IAPICore} from 'src/app/services/apicore/api.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute } from '@angular/router';
import { Proyecto } from 'src/app/services/ayudantia/proyecto.service';
import { UtilService } from 'src/app/services/util/util.service';
 


@Component({
  selector: 'app-fichaproyecto',
  templateUrl: './fichaproyecto.component.html',
  styleUrls: ['./fichaproyecto.component.scss'],
  
})



export class FichaproyectoComponent implements OnInit {



  public fdesdeDate: NgbDate | null
  public fhastaDate: NgbDate | null
  public flapsoDate: NgbDate | null
 

  public Proyecto: Proyecto = {
    identificador : 0,
    nombre: '',
    tipo: '',
    sistema_armas: '',
    estatus: '',
    jefe_proyecto: '',
    telefono_jefe: '',
    ente: '',
    empresa: '',
    pais: '',
    fuente: '',
    otros: '',
    usuario_final: '',
    sistema: '',
    fecha_desde: '',
    fecha_hasta: '',
    numero_contrato: '',
    objeto: '',
    observacion: '',
    fecha_origen: '',
    moneda: '',
    monto_total: 0,
    monto_pagado: 0,
    monto_deuda: 0,
    usuario: ''
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
        this.ObtenerProyecto(id)
      }

  }

  async ObtenerProyecto(id: string) {
    // const base = atob(numBase64)
    this.xAPI.funcion = 'MPPD_CProyecto'
    this.xAPI.parametros = id
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.Proyecto = data.Cuerpo[0]
        this.fdesdeDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_desde.substring(0, 10)))
        this.fhastaDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_hasta.substring(0, 10)))
        this.flapsoDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_origen.substring(0, 10)))
      },
      (error) => {

      }
    )
  }

}
