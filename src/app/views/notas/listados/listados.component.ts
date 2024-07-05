import { Component, OnInit, ViewChild} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, DocumentoAdjunto, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listados',
  templateUrl: './listados.component.html',
  styleUrls: ['./listados.component.scss']
})
export class ListadosComponent implements OnInit {

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
  public reportEntrega = []

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
          this.ngxService.stopLoader("loader-aceptar")
        }
      )
    } catch (error) {
      console.error(error)
      this.ngxService.stopLoader("loader-aceptar")
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



  protected aceptar(msj: string) {

    Swal.fire({
      title: 'Impirmir nota de entrega # ' + msj,
      text: "¿Desde el PDF o Base de Datos?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'PDF',
      cancelButtonText: 'Base de datos',
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {

      } else {
        this.imprimir()
      }



    })
  }

  notaEntrega(llave: string) {

    this.xAPI.funcion = 'WKF_CNotaEntregaDetalles'
    this.xAPI.parametros = llave

    this.ngxService.startLoader("loader-aceptar")

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.reportEntrega = data.Cuerpo
        this.aceptar(llave)

        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
      }
    )
  }

  imprimir() {
    var ventana = window.open("", "_blank");
    var localtime = new Date().toLocaleString();
    var contenido = document.getElementById('prtNota').innerHTML
    ventana.document.write(contenido)

    ventana.document.head.innerHTML = ` <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Gestion de Documentos</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <style type="text/css">
        @media print {
            body {
                  margin: 0px;
                  font-family: Calibri;
              }
              .encabezado{
                text-align:center;
              }
              .footer, .push {
                  height: 5em;
                  font-size: 12px;
              }
              h3 {
                text-align:center;
              }
              .footer, .push {
                  height: 5em;
                  font-size: 12px;
              }
              .tabla-contenido {
                border-collapse: collapse;
                font-family: Arial, Calibre;
                font-size: 12px;
            }
            .wrapper {
                min-height: 100%;
                height: auto !important;
                height: 100%;
                margin: 0 auto -5em;
            }
        }
    </style>
     `;
    ventana.print()
    ventana.close()
  }






}
