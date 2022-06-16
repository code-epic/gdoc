import { Component, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { LoginService } from 'src/app/services/seguridad/login.service'
import { IDocumento, Resolucion } from 'src/app/services/control/documentos.service';



@Component({
  selector: 'app-rsentradas',
  templateUrl: './rsentradas.component.html',
  styleUrls: ['./rsentradas.component.scss']
})

export class RsentradasComponent implements OnInit {

  public id: string = ''

  editor: Editor = new Editor;

  xeditor: Editor = new Editor;
  xobser: Editor = new Editor;


  ffecha: NgbDate | null
  fvigencia: NgbDate | null

  public fecha: any
  public vigencia: any

  placement = 'bottom';

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }


  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    tipo: '',
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    componente: '',
    categoria: '',
    clasificacion: '',
    grado: '',
    carpeta: '',
    estatus: '',
    entrada: '',
    asunto: '',
    observacion: '',
    responsable: '',
    cargo_responsable: '',
    situacion: '',
    sexo: '',
    numero: ''
  }

  public bPDF = true
  public lstHzAdjunto = []


  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router) { }

  ngOnInit(): void {
    this.editor = new Editor()

    this.xeditor = new Editor()

    this.xobser = new Editor()

    if (this.rutaActiva.snapshot.params.id != undefined) {
      this.id = this.rutaActiva.snapshot.params.id
    }
  }

  limpiarFrm() {

  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  open(content) {
    this.modalService.open(content);
  }

  guardar() {

  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: 'lg' })

  }

}
