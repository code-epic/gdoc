import { Component, OnInit } from '@angular/core';
import {IDatosBasicos} from '../../../services/resoluciones/resolucion.service';
import {TemplateCVService} from './service/template-cv.service';
@Component({
  selector: 'app-graledicion',
  templateUrl: './graledicion.component.html',
  styleUrls: ['./graledicion.component.scss']
})
export class GraledicionComponent implements OnInit {
  // public event:any;
  public event:any = {
    anio: 0,
    area: "rerererere",
    cargo: "fddffdfdfd",
    categoria: "0",
    cedula: "34434334",
    clasificacion: "1",
    componente: "100",
    condicion: "1",
    correo: "reerreer@yopmail.com",
    dia: 0,
    especialidad: "feeererre",
    estadomayor: "fdfdfdfdfd",
    estudios: "rerererere",
    fecha: "1900-01-01",
    grado: "1",
    mes: 0,
    motivo: "rerererererere",
    n_componente: 0,
    n_grado: 0,
    nacimiento: "2024-7-9",
    nombres: "reererer",
    observacion: "rererereererererer",
    orden: 0,
    profesion: "",
    profesionx: "",
    promocion: "2024-7-1",
    reserva: 0,
    resolucion: 0,
    sexo: "M",
    situacion: "ACT",
    solicitud: 0,
    telefono: "trtrtrtrtrtr",
    ubicacion: "dfdffdfd",
    ultimo_ascenso: "2024-7-16",

  //   campos nuevos
    inea:'79,881',
    gdo_cat: 'CC. ASIMILADA',
    anio_servicio:'17 AÑOS',
    tiempo_grado: '4 AÑOS',
    nivel_education: 'PREGRADO (ODONTÓLOGO)',
    oportunidad_ascenso:'PRIMERO',
    cod_area: '0412',
    num_tel: '4279618',
    cmdt_unidad: 'CA. JUAN LÓPEZ AGUDO',
    comandante_unidad_cod_area: '',
    comandante_unidad_num_tel: '',
    cc_orden: '1/6',
    cc_orden_anio: 'JUL20',
    tn_orden: '1/6',
    tn_orden_anio: 'JUL20',
    tf_orden: '1/6',
    tf_orden_anio: 'JUL20',
    tc_orden: '1/6',
    tc_orden_anio: 'JUL20',
    om_jr: '1/2',
    anio_promocion: '2007',
    paf: '100'

  };

  constructor(private templateCv: TemplateCVService) { }

  ngOnInit(): void {
  }

  generatePdf(event: IDatosBasicos) {
    console.log('event', event);
    console.log('event', event);
    this.templateCv.createHtmlSectionForPrint(this.event);
  }

}
