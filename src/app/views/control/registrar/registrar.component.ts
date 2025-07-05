import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, DocumentoAdjunto, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  @ViewChild('fileInput') fileInput!: ElementRef
  @ViewChild(MatAccordion) accordion: MatAccordion;

  public estadoActual = 1
  public estatusAcutal = 1

  public paginador = 10
  fecha_desde = '-09-01'
  fecha_hasta = '-09-30'
  xyear = '2024'

  public focus;
  public hashcontrol = ''
  progreso = []
  posicionProgreso: number = 0

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  };

  selNav = 0
  oficinas = []
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  btnEnviar : boolean = false

  // MatPaginator Output
  pageEvent: PageEvent;
  // editor: Editor = new Editor;

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
  public lstMeses = []
  public lstYear = []
  public xmeses = ''
  public buscar = ''
  public extender_plazo = ''
  public detalles = ''
  public placement = 'bottom'
  public longitud = 0;
  public pageSize = 10;
  public posicionPagina = 0
  public EstadoDescripcion = ''

  public DocAdjunto: DocumentoAdjunto = {
    documento: '',
    archivo: '',
    usuario: ''
  }
  lblFile: any;


  constructor(private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal) {

    config.backdrop = 'static';
    config.keyboard = false;
    this.strRuta = environment.Url + environment.API
    this.lstMeses = this.apiService.Xmeses
    this.lstYear = this.apiService.Xyear

  }


  ngOnInit(): void {
    this.xmeses = new Date().getMonth().toString()
    this.xyear = new Date().getFullYear().toString()
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


  open(content, id, posicion) {

    if (this.fileInput) this.fileInput.nativeElement.value = ''
    this.archivos = []
    this.lblFile = ''
    this.numControl = id
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos
    this.posicionProgreso = posicion
    this.modalService.open(content);

  }


  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '%'
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
            e.statusprogreso = false
            e.progreso = 0
            e.color = 'green'
            switch (e.tdoc.toLowerCase()) {
              case 'punto de cuenta':
                e.simbolo = "-P"
                e.color = 'green'
                break;
              case 'tramitacion por organo regular':
                e.simbolo = "-T"
                e.color = 'brown'
                break;
              case 'resolucion':
                e.simbolo = "-R"
                e.color = 'orange'
                break;
              default:
                e.simbolo = ''
                break;
            }

            e.completed = false;

            return e;
          });
          this.longitud = this.buzon.length;
          if (this.longitud > 0) {
            this.estilocheck = '';
            this.bzOriginal = this.buzon;
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




  seleccionNavegacion(e) {
    this.selNav = e
    this.xAPI.funcion = 'WKF_CDocumentosGestion'
    this.xAPI.valores = ''
    this.buzon = []
    this.bzOriginal = []
    this.fecha_desde = this.xyear + '-' + this.lstMeses[this.xmeses].desde
    this.fecha_hasta = this.xyear + '-' + this.lstMeses[this.xmeses].hasta
    this.pageSize = 10;

    switch (e) {
      case 0:
        this.xAPI.parametros = `1,1,${this.fecha_desde},${this.fecha_hasta}`

        this.listarBuzon()
        break;
      case 1:
        this.xAPI.parametros = `1,2,${this.fecha_desde},${this.fecha_hasta}`
        this.listarBuzon()
        break;
      case 2:
        this.xAPI.parametros = `1,1,${this.fecha_desde},${this.fecha_hasta}`
        this.ConsultarAlertas()
        break;
      default:
        break;
    }
  }

   async ConsultarAlertas() {
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'WKF_CAlertas'
    
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzAlertas = data.Cuerpo.map((e) => {
          const { color, texto } = this.formatearContador(e.contador)
          e.color = color
          e.texto = texto
          e.busqueda = this.utilService.ConvertirCadena(
              e.ncontrol + e.remitente + e.plazo + e.texto
          )
          return e;

        })
        this.longitud = this.bzAlertas.length;
        this.bzOriginal = this.bzAlertas;
        this.pageSize = 10;
        this.ngxService.stopLoader("loader-aceptar")
        this.recorrerElementos(0);
      },
      (error) => {
      }
    )
  }

  formatearContador(contador: number): { color: string, texto: string } {
    let color: string;
    let texto: string;

    if (contador === 0) {
        color = 'text-yellow'; // Podría ser rojo o amarillo según tu lógica de "vence hoy"
        texto = 'Se vence hoy';
    } else if (contador > 0) {
        color = 'text-red';
        const dias = contador === 1 ? 'Día' : 'Días';
        texto = `Tiene ${contador} ${dias} vencido`;
    } else { // contador < 0
        color = 'text-yellow';
        const dias = contador * -1 === 1 ? 'Día' : 'Días';
        texto = `Faltan ${contador * -1} ${dias} para vencer`;
    }
    return { color, texto };
  }

  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
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
      title: '¿Estás seguro que deseas enviar a la papelera el documento?',
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
        this.xAPI.funcion = 'WKF_ARedistribuir' //'WKF_AUbicacion'
        this.xAPI.valores = ''
        this.xAPI.parametros = `10,10,1,${usuario},${id}`
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

    this.btnNota = false
    this.consultarEstados(id)
    this.UbicacionSeleccionLista = id
    this.xAPI.funcion = 'WKF_CClasificados'
    this.xAPI.valores = ''
    this.xAPI.parametros = id
    this.lstNotaEntrega = []
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
    this.lblFile = e.target.files[0].name
    this.archivos.push(e.target.files[0])
    this.btnEnviar = true
  }

  async SubirArchivo(e, posicion) {
    
    var frm = new FormData(document.forms.namedItem("forma"))
    this.buzon[posicion].statusprogreso = true
    this.btnEnviar = false
    try {
      await this.apiService.EnviarArchivosProgress(frm).subscribe({
        next: (event) => {
          this.buzon[posicion].progreso = event.progress
          if (event.state === 'DONE') {
            this.buzon[posicion].anom = 'X'
            this.cargarSubDetalle()
          }
        },
        error: (err) => {
          this.toastrService.error(err, `GDoc Adjunto`)
          console.error('Error al subir el archivo:', err)
        },
        complete: () => {
          this.buzon[posicion].statusprogreso = false
          this.buzon[posicion].progreso = 0
        }
      });

    } catch (error) {
      console.error(error)
    }

  }

  cargarSubDetalle() {
    this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
    this.xAPI.parametros = ''
    this.DocAdjunto.archivo = this.archivos[0].name
    this.DocAdjunto.usuario = this.loginService.Usuario.id
    this.DocAdjunto.documento = this.numControl
    this.xAPI.valores = JSON.stringify(this.DocAdjunto)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (xdata) => {
        if (xdata.tipo == 1) {
          if (this.fileInput) this.fileInput.nativeElement.value = ''
          this.lblFile = ''
          this.archivos = []
          this.toastrService.success(
            'Tu archivo ha sido cargado con exito ',
            `GDoc Registro`
          );

        } else {
          this.toastrService.info(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
        }
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
        this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
        this.ngxService.stopLoader("loader-aceptar")
      }
    )
  }


  async notaEntrega(id: string) {
    this.btnNota = false
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

  consultarEstados(id) {
    this.lstEstados.map(e => {
      if (e.id == id) this.EstadoDescripcion = e.nomb
    })

  }
}
