import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { map, startWith } from 'rxjs/operators';

export interface ITipoResolucion {
  cod_tipo_resol: string
  des_resol: string

}



@Component({
  selector: 'app-rsccargamasiva',
  templateUrl: './rsccargamasiva.component.html',
  styleUrls: ['./rsccargamasiva.component.scss']
})
export class RsccargamasivaComponent implements OnInit {

  filteredOptions: Observable<ITipoResolucion[]>;

  placement = 'bottom'
  archivos = []
  numControl : string = ''
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }


  // xeditor: Editor = new Editor
  // xobser: Editor = new Editor

  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    unidad: '',
    fecha_doc: '',
    tipo: '0',
    cedula: '',
    nombres: '',
    fecha_nacimiento: '',
    componente: '0',
    categoria: '0',
    clasificacion: '0',
    grado: '0',
    carpeta: '0',
    estatus: '0',
    entrada: '0',
    asunto: '',
    observacion: '',
    responsable: '',
    cargo_responsable: '',
    situacion: '',
    sexo: '',
    numero: '0',
    gran_comando: '',
    unidad_comando: '',
    instrucciones: '',
    n_componente: 0,
    n_grado: 0
  }

  myControl = new FormControl();
  
  public TipoResoluciones: any
  public Estados: any

  constructor(private apiService : ApiService) { }

  ngOnInit(): void {

    // this.xeditor = new Editor()
    // this.xobser = new Editor()

    this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []
    this.Estados = sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion"))) : []


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filter(name) : this.TipoResoluciones.slice())),
    );
  }

  displayFn(tr: ITipoResolucion): string {
    return tr && tr.des_resol ? tr.des_resol : '';
  }

  private _filter(name: string): ITipoResolucion[] {
    const filterValue = name.toLowerCase();

    return this.TipoResoluciones.filter(option => option.des_resol.toLowerCase().includes(filterValue));
  }


  guardar() {

  }



  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
          this.xAPI.parametros =  '' 
          
        }
      )
    } catch (error) {
      console.error(error)
    }

  }



}
