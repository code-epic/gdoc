import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, DocumentoAdjunto, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';


@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.scss']
})
export class GeneralesComponent implements OnInit {

  @ViewChild('fileUpload1')

  private fileUpload1: AngularFileUploaderComponent;




  public paginador = 10
  public focus;
  public hashcontrol = ''
  public numControl = ''

  public archivos = []


  public buscar: string = ''
  lst = []
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  public lstNotaEntrega = [] //Listado Original
  public buzon = []
  public placement = 'bottom'
  public longitud = 0;
  public pageSize = 10;

  public DocAdjunto: DocumentoAdjunto = {
    documento: '',
    archivo: '',
    usuario: ''
  }

  public llave: string = ''

  // MatPaginator Output
  pageEvent: PageEvent;
  public xAPI: IAPICore = {
    funcion: 'WKF_CNotaEntrega',
    parametros: '0'
  }

  constructor(private apiService: ApiService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listarBuzon()
  }


  async listarBuzon(): Promise<void> {

    this.ngxService.startLoader("loader-aceptar")
    try {
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          data.Cuerpo.map((e) => {
            this.buzon.push(e)
            return e
          });
          this.longitud = this.buzon.length;
          if (this.longitud > 0) {

            this.lstNotaEntrega = this.buzon;
            this.pageSize = 10;
            this.recorrerElementos(0);
          }
          this.ngxService.stopLoader("loader-aceptar")
        },
        (error) => {
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.buzon = this.lstNotaEntrega.slice(pag, pag + this.pageSize)

  }

  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }

  open(content, id) {
    this.numControl = id
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos
    this.modalService.open(content);

  }

  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    // try {
    //   await this.apiService.EnviarArchivos(frm).subscribe(
    //     (data) => {
    //       this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
    //       this.xAPI.parametros = ''
    //       this.DocAdjunto.archivo = this.archivos[0].name
    //       this.DocAdjunto.usuario = this.loginService.Usuario.id
    //       this.DocAdjunto.documento = this.numControl
    //       this.xAPI.valores = JSON.stringify(this.DocAdjunto)
    //       this.apiService.Ejecutar(this.xAPI).subscribe(
    //         (xdata) => {
    //           if (xdata.tipo == 1) {
    //             this.toastrService.success(
    //               'Tu archivo ha sido cargado con exito ',
    //               `GDoc Registro`
    //             );

    //           } else {
    //             this.toastrService.info(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
    //           }
    //         },
    //         (error) => {
    //           this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
    //         }
    //       )
    //     }
    //   )
    // } catch (error) {
    //   console.error(error)
    // }

  }




}
