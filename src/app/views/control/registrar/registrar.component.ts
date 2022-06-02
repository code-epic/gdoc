import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader'

import Swal from 'sweetalert2'
import { Md5 } from "md5-typescript";
import { UtilService } from 'src/app/services/util/util.service';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  @ViewChild('fileUpload1')

  private fileUpload1: AngularFileUploaderComponent;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public estadoActual = 1
  public estatusAcutal = 1

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia: false,
    protocolo: '',
    ruta: '',
    version: '',
    retorna: false,
    migrar: false,
    http: 0,
    https: 0,
    consumidores: '',
    puertohttp: 0,
    puertohttps: 0,
    driver: '',
    query: '',
    metodo: '',
    tipo: '',
    prioridad: '',
    entorno: '',
    logs: false,
    cache: 0,
    estatus: false
  };

  selNav = 0
  oficinas = []
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  editor: Editor = new Editor;

  public estilocheck = 'none'

  public estiloclasificar = 'none'

  public cmbDestino = 0

  public htmlContenido = ''

  public bzRegistrados = []

  public bzNotaEntregas = []

  public archivos = []

  public lstNotaEntrega = []

  public numControl: string = ''

  public allComplete: boolean = false

  public btnNota: boolean = false

  public llave: string = ''

  public Observacion: string = ''

  public UbicacionSeleccionLista: string = '0'

  afuConfig = {

  };
  public strRuta: string = ''

  public bzOriginal = [] //Listado Original
  public buzon = []


  public bzBusqueda = []
  public bzAlertasO = []
  public bzAlertas = []
  public buscar = ''
  public extender_plazo = ''
  public detalles = ''
  public placement = 'bottom'
  public longitud = 0;
  public pageSize = 10;
  public posicionPagina = 0

  constructor(private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal) {

    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.strRuta = environment.Url + environment.API
  }


  ngOnInit(): void {
    this.editor = new Editor();
    this.listarEstados()
    this.seleccionNavegacion(0)

  }


  seleccionLista(event) {
    if (event.charCode == 13) {
      this.longitud = 0;
      this.pageSize = 10;
      const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
      this.longitud = this.bzBusqueda.length
      if (this.posicionPagina == 3) {
        this.bzBusqueda = this.bzAlertasO.filter((e) => { return patron.test(e.busqueda) })
        this.bzAlertas = this.bzBusqueda.slice(0, this.pageSize)
      }
      this.buscar = ''
    }
  }


  async ConsultarAlertas(): Promise<void> {
    this.ngxService.startLoader("loader-alertas")
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '1,1'
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {   
        this.bzAlertas = data.Cuerpo.map((e) => {
          e.color = e.contador >= 0 ? 'text-red' : 'text-yellow';
          e.texto = e.contador >= 0 ? `Tiene ${e.contador} Dias vencido` : `Faltan ${e.contador * -1} Dia para vencer`;
          e.texto = e.contador == 0 ? 'Se vence hoy' : e.texto;
          e.busqueda = this.utilService.ConvertirCadena(
            e.ncontrol + e.remitente + e.plazo + e.texto
          );
          
          return e;
          
        }
        );
        this.longitud = this.bzAlertas.length;
        this.bzOriginal = this.bzAlertas;
        this.pageSize = 10;
        this.recorrerElementos(0);
        this.ngxService.stopLoader("loader-alertas")
      },
      (error) => {
      }
    )
  }

  updateAllComplete() {
    this.allComplete = this.buzon != null && this.buzon.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.buzon == null) {
      return false;
    }

    return this.buzon.filter(t => t.completed).length > 0 && !this.allComplete;

  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.buzon == null) {
      return;
    }

    this.buzon.forEach(t => (t.completed = completed));
    if (completed == false) {
      this.estiloclasificar = 'none'
    } else {
      this.estiloclasificar = ''
    }
  }


  open(content, id) {
    this.numControl = id
    this.modalService.open(content);

  }


  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter(e => { return e.esta == 1 });
      },
      (error) => {

      }
    )
  }

  async listarBuzon(): Promise<void> {
 
    this.ngxService.startLoader("loader-aceptar")
try {
    this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      this.buzon = data.Cuerpo.map((e) => {
        e.existe = e.anom == '' ? true : false;
        e.privado = e.priv == 1 ? true : false;
        e.simbolo = e.tdoc == 'PUNTO DE CUENTA' ? '( + )' : '  ';
        e.completed = false;
        
        return e;
      }); 
      this.longitud = this.buzon.length;
      if (this.longitud > 0) {
        this.estilocheck = '';
        this.bzOriginal = this.buzon;
        this.pageSize = 10;
        this.recorrerElementos(0);
        this.ngxService.stopLoader("loader-aceptar")
      }
    },
    (error) => {
    }
  )
    } catch (error) {
      console.error(error)
    }
  }


  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }


  seleccionNavegacion(e) {
    this.selNav = e
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.buzon= []
    this.bzOriginal= []
    
    switch (e) {
      case 0:
        this.xAPI.parametros = '1,1'
        this.listarBuzon()
        break;
      case 1:
        this.xAPI.parametros = '1,2'
        this.listarBuzon()      
        break;
      case 2:
        this.ConsultarAlertas()
        break;
      default:
        break;
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.buzon = this.bzOriginal.slice(pag, pag + this.pageSize)

  }

  //editar
  editar(id: string) {
    const estado = this.estadoActual
    const estatus = this.selNav + 1
    const base = btoa(estado + ',' + estatus + ',' + id)
    this.ruta.navigate(['/documento', base])
  }

  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }

  //adjuntar
  adjuntar(id: string) {

  }

  //eliminar
  eliminar(codigo: string, id: number) {


    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el documento?',
      text: '#' + codigo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        var usuario = this.loginService.Usuario.id
        var llave = ``
        this.xAPI.funcion = 'WKF_AUbicacion'
        this.xAPI.valores = ''
        this.xAPI.parametros = `10,1,${llave},${usuario},${id}`
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo == 1) {
              this.toastrService.success(
                'Tu archivo ha sido enviado a la papelera con exito ',
                `GDoc Wkf.Papelera`
              );
              this.actualizarBzRegistrados(codigo, 0)

            } else {
              this.toastrService.error(data.msj, `GDoc Wkf.Papelera`);
            }

          },
          (errot) => {
            this.toastrService.error(errot, `GDoc Wkf.Papelera`);
          }) //

      }
    })
  }


  clasificarBuzon() {
    var lstBz = this.buzon
    var usuario = this.loginService.Usuario.id
    var llave = ``
    var i = 0
    var estatus = 2 //NOTA DE ENTREGA
    //Buscar en Wk de acuerdo al usuario y la app activa
    this.xAPI.funcion = 'WKF_AUbicacion'
    this.xAPI.valores = ''
    
    if (this.cmbDestino == 0) {
      this.toastrService.error('Debe seleccionar una opción', `GDoc Wkf.Ubicacion`);
      return
    }

    lstBz.forEach(e => {
      i++
      if (e.completed == true) {
        this.xAPI.parametros = `${this.cmbDestino},${estatus},${llave},${usuario},${e.idd}`
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.actualizarBzRegistrados(e.numc, 0)
          },
          (errot) => {
            this.toastrService.error(errot, `GDoc Wkf.Estatus`);
          }) //

      }
    });
    this.seleccionNavegacion(0)
    
  }

  actualizarBzRegistrados(codigo, tipo) {
    var posicion = 0
    var i = 0
    this.buzon.forEach(e => {
      if (e.numc == codigo) {
        posicion = i
        return
      }
      i++
    })
    if (tipo == 0) {
      this.buzon.splice(posicion, 1)
    } else {
      this.buzon[posicion].existe = false
    }
  }




  ConsultarCtrl(id: string) {
    this.UbicacionSeleccionLista = id
    this.xAPI.funcion = 'WKF_CClasificados'
    this.xAPI.valores = ''
    this.xAPI.parametros = id
    this.lstNotaEntrega = []
    this.btnNota = false
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstNotaEntrega = data.Cuerpo
        if (this.lstNotaEntrega.length > 0) this.btnNota = true
        var fecha = new Date().toISOString()
        this.llave = Md5.init(id + fecha)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.Estatus`);
      }) //

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
          this.xAPI.parametros = this.archivos[0].name + ',' + this.loginService.Usuario.id + ',' + this.numControl
          this.xAPI.valores = ''
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                this.toastrService.success(
                  'Tu archivo ha sido cargado con exito ',
                  `GDoc Registro`
                );
                this.actualizarBzRegistrados(this.numControl, 1)
              } else {
                this.toastrService.error(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
              }
            },
            (error) => {
              this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
    }

  }


  async notaEntrega(id: string) {

    var cantidad = this.lstNotaEntrega.length

    if (cantidad > 0) {
      var i = 0
      this.lstNotaEntrega.forEach(e => {
        var origen = e.dest
        var estatus = 1
        var usuario = this.loginService.Usuario.id
        var id = e.idd
        this.xAPI.funcion = 'WKF_APromoverDocumento'
        this.xAPI.valores = ''
        this.xAPI.parametros = origen + ',' + estatus + ',' + this.llave + ',' + usuario + ',' + id



        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            i++
            if (cantidad == i) this.imprimir()
          },
          (errot) => {
            this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
          })

      })
    }
  }

  mensajeReversarDoc(id: string) {
    Swal.fire({
      title: 'Alerta',
      text: '¿Está seguro que desea reversar este documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, estoy seguro'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reversarDoc(id)
      }
    })
  }

  reversarDoc(id: string) {
    //WKF_AReversarDocumento
    var usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_AReversarDocumento'
    this.xAPI.valores = ''
    this.xAPI.parametros = '0,1,' + usuario + ',' + id

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstNotaEntrega = []
        this.btnNota = false
        this.ConsultarCtrl(id)
        this.toastrService.success(
          'Tu documento ha sido reversado ',
          `GDoc Wkf.ReversarDocumento`
        );
        this.bzRegistrados = []
        this.seleccionNavegacion(0)



      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.ReversarDocumento`);
      })

  }


  insertarObservacion() {
    var usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_IDocumentoObservacion'
    this.xAPI.valores = JSON.stringify({
      "documento": this.numControl,
      "estado": 1, //Estado que ocupa
      "estatus": 2,
      "observacion": this.Observacion,
      "accion": '',
      "usuario": usuario
    })
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'Se ha agregado observacion al documento',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.Observacion = ''
        this.numControl = '0'
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }


  imprimir() {

    this.btnNota = false
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
