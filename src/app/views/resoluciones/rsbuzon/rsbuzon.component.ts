import { ClassGetter, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-rsbuzon',
  templateUrl: './rsbuzon.component.html',
  styleUrls: ['./rsbuzon.component.scss']
})
export class RsbuzonComponent implements OnInit {



  public estadoActual = 3
  public estadoOrigen = 1

  public extender_plazo: any
  public clasificacion = false
  public vrecibido = true
  public vprocesados = false
  public vpendientes = false
  public cmbDestino = ''

  public paginador = 10
  public focus;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public selNav = 0
  public lengthOfi = 0;
  public pageSizeOfi = 10;
  public pageEvent: PageEvent;
  public idd : string = ''
  public cuenta : string = ''


  public pageSizeOptions: number[] = [5, 10, 25, 100]

  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'ELABORAR OFICIO DE OPINION', 'visible': '1' },
    { 'valor': '3', 'texto': 'EN MANOS DEL DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '4', 'texto': 'EN MANOS DEL SUB DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '5', 'texto': 'ARCHIVAR', 'visible': '1' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '1' },
    { 'valor': '7', 'texto': 'SALIDA', 'visible': '2' }]

  public lstAcciones = []
  public bzOriginal = []
  public bzSubDocumentos = []
  public bzRecibido = []
  public bzProcesados = []
  public bzPendientes = []
  public lst = []
  public lstEstados = [] //Listar Estados


  public estilocheck = 'none'
  public estiloclasificar = 'none'

  public allComplete: boolean = false
  public numControl = ''
  public Observacion = ''
  public AccionTexto: string = '0'

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }


  constructor(
    private apiService: ApiService,
    private ruta: Router,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private utilService: UtilService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.listarEstados()
    this.seleccionNavegacion(0)
    this.listarSubDocumentos(1)
  }

  entrada_open(id, cuenta){
   
    if (cuenta != undefined){
      const xid = btoa('4,2,' + id)
      const xcuenta = btoa(cuenta)
      this.ruta.navigate(['/rsentradas', xid, xcuenta ])
      return
    }
    const xid = btoa(id)
    this.ruta.navigate(['/rsentradas', xid ])
   
  }
  open(content, id, cuenta) {
    this.numControl = id
    this.idd = ''
    this.cuenta = ''
    if( cuenta != undefined ){
      this.idd =  id
      this.cuenta = cuenta
    }
    this.modalService.open(content)
  }


  seleccionNavegacion(e) {
    this.bzRecibido = []
    this.bzProcesados = []
    this.bzPendientes = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e

    switch (e) {
      case 0:
        this.cargarAcciones(0)
        this.clasificacion = false
        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon()
        break
      case 1:
        this.cargarAcciones(1)
        this.clasificacion = false
        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon()
        break
      case 2:
        this.cargarAcciones(2)
        this.clasificacion = false
        this.xAPI.parametros = this.estadoActual + ',' + 3
        this.listarBuzon()
        break
      default:
        break
    }

  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter((e) => { return e.esta == 1 && e.id != 3 || e.id == 1 })

      },
      (error) => { }
    )
  }

  async listarBuzon() {
   
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.bzOriginal = data.Cuerpo.map(e => {
          e.completed = false
          e.color = 'warn'
          e.cuentas = e.cuenta != ''? '': e.nori
          e.priv = e.priv == 1 ? true : false
          e.existe = e.anom == '' ? true : false
          e.xaccion = e.accion
          return e
        }) //Registros recorridos como elementos
        this.lengthOfi = data.Cuerpo.length
        if (this.selNav == 1) this.listarSubDocumentos(2)
      },
      (error) => {

      }
    )
  }

  async listarSubDocumentos(estatus : number) {

    this.xAPI.funcion = 'WKF_CSubDocumentoResoluciones'
    this.xAPI.parametros = '4,2,3,' + estatus
    this.bzSubDocumentos = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzSubDocumentos = data.Cuerpo.map(e => {
          e.completed = false
          e.color = 'warn'
          e.bOk = e.cuenta == ''? true: false
          e.cuentas = e.cuenta == ''? '': e.cuenta
          e.priv = e.priv == 1 ? true : false
          e.existe = e.anom == '' ? true : false
          e.xaccion = e.accion
          return e
        }) //Registros recorridos como elementos
        this.lengthOfi = data.Cuerpo.length
      },
      (error) => {

      }
    )
  }

  async ConsultarCtrl(id) {
    if (id == 4) {
      this.bzRecibido = this.bzSubDocumentos
    } else {
      this.bzRecibido = this.bzOriginal.filter((e) => { return e.ultimo_estado == id })
    }
  }

  ConsultarProcesados(id) {
    console.log(this.bzSubDocumentos, 'uff -> ', id)
    if (id == 4) {
      this.bzRecibido = this.bzSubDocumentos
    } else {
      console.log(this.bzOriginal, 'xfff -> ', id)
      this.bzRecibido = this.bzOriginal.filter((e) => { return e.ultimo_estado == id })
    }
  }

  ConsultarPendientes(id) {
    this.bzRecibido = this.bzOriginal.filter((e) => { return e.ultimo_estado == id })
  }


  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex + 1, this.lst)
  }


  //recorrerElementos para paginar listados
  recorrerElementos(posicion: number, lista: any) {
    if (posicion > 1) posicion = posicion * 10
    this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)

  }


  //editar
  editar(id: string) {
    const estado = this.estadoActual
    const estatus = this.selNav + 1
    const base = btoa(estado + ',' + estatus + ',' + id)
    this.ruta.navigate(['/documento', base])
  }

  insertarObservacion() {
    var usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_IDocumentoObservacion'
    this.xAPI.valores = JSON.stringify(
      {
        "documento": this.numControl,
        "estado": this.estadoActual, //Estado que ocupa
        "estatus": this.selNav + 1,
        "observacion": this.Observacion.toUpperCase(),
        "accion": this.AccionTexto,
        "usuario": usuario
      }
    )
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        switch (this.AccionTexto) {
          case "0"://Oficio por opinión
            if (this.idd != '' && this.cuenta != ''){
              this.promoverPuntoCuenta(3, 2)
            }else {
              this.promoverBuzon(0, this.utilService.FechaActual())
            }
            
            break;
          case "1"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break
          // case "5":// Enviar a Archivo
          //   this.redistribuir(11)
          //   break;

          // case "6":// Enviar a otras areas
          //   this.redistribuir(0)
          //   break;

          // case "7"://Enviar a salida con bifurcacion
          //   this.redistribuir(9)
          //   break;

          // default:

          //   this.promoverBuzon()
          //   break;
        }



      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }


  async rechazarBuzon() {
    this.xAPI.funcion = "WKF_AUbicacionRechazo"
    this.xAPI.valores = ''
    this.xAPI.parametros = '1,1,1,,' + this.loginService.Usuario.id + ',' + this.numControl
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'El documento ha sido enviado al origen',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }

    )
  }



  async promoverBuzon(activo: number, sfecha: string) {
    var fecha = ''
    if (sfecha == '') {
      if (this.extender_plazo == undefined) {
        this.toastrService.warning(
          'Debe seleccionar una fecha ',
          `GDoc Wkf.DocumentoObservacion`
        )
        return false
      } else {
        fecha = this.utilService.ConvertirFecha(this.extender_plazo)
      }
    } else {
      fecha = sfecha
    }

    sfecha == '' ? this.utilService.ConvertirFecha(this.extender_plazo) : sfecha

    var usuario = this.loginService.Usuario.id
    var i = 0
    var estatus = 1 //NOTA DE ENTREGA
    //Buscar en Wk de acuerdo al usuario y la app activa
    this.xAPI.funcion = 'WKF_APromoverEstatus'
    this.xAPI.valores = ''

    this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        await this.guardarAlerta(activo, fecha)
        this.seleccionNavegacion(this.selNav)
        this.Observacion = ''
        this.numControl = '0'
        this.toastrService.success(
          'Se ha promovido el documento',
          `GDoc Wkf.DocumentoObservacion`
        )
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
      }) //

  }

  async redistribuir(destino: number = 0) {
    var dst = destino != 0 ? destino : this.cmbDestino

    this.xAPI.funcion = "WKF_ARedistribuir"
    this.xAPI.valores = ''
    this.xAPI.parametros = dst + ',' + dst + ',1,' + this.loginService.Usuario.id + ',' + this.numControl
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.guardarAlerta(1, this.utilService.ConvertirFecha(this.extender_plazo))
        this.toastrService.success(
          'El documento ha sido redistribuido segun su selección',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }
    )
  }


  /**
   * 
   * @param destino 3 es la posicion del estado actual
   */
  async promoverPuntoCuenta(destino: number = 0, estatus : number) {
    var dst = destino != 0 ? destino : this.cmbDestino

    this.xAPI.funcion = "WKF_ASubDocumentoRedistribuir"
    this.xAPI.valores = ''
    this.xAPI.parametros = dst + ',' + estatus + ','  + this.loginService.Usuario.id + ',' + this.idd + ',' + this.cuenta
    console.log(this.xAPI);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        //this.xAPI.funcion = 'WKF_ASubDocumentoAlerta'
        //await this.guardarAlerta(1, this.utilService.ConvertirFecha(this.extender_plazo))
        this.toastrService.success(
          'El documento ha sido redistribuido segun su selección',
          `GDoc Wkf.DocumentoObservacion`
        )
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async cargarAcciones(posicion) {
    this.lstAcciones = []
    this.lstAcciones = this.cmbAcciones.filter(e => { return e.visible == posicion });
  }

  selAccion() {
    this.clasificacion = false
    switch (this.AccionTexto) {
      case '6':
        this.clasificacion = true
        break;

      default:
        break;
    }
  }


  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }




  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo
    this.WAlerta.documento = parseInt(this.numControl)
    this.WAlerta.estado = this.estadoActual
    this.WAlerta.estatus = this.selNav + 1
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = this.Observacion.toUpperCase()
    this.WAlerta.fecha = fecha

    this.xAPI.funcion = 'WKF_AAlertas'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }




  fileSelected(e) {
    //this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
          this.xAPI.parametros =  '' 
          // this.DocAdjunto.archivo = this.archivos[0].name
          // this.DocAdjunto.usuario = this.loginService.Usuario.id
          // this.DocAdjunto.documento = this.numControl
          // this.xAPI.valores = JSON.stringify(this.DocAdjunto)

          // this.apiService.Ejecutar(this.xAPI).subscribe(
          //   (xdata) => {
          //     if (xdata.tipo == 1) {
          //       this.toastrService.success(
          //         'Tu archivo ha sido cargado con exito ',
          //         `GDoc Registro`
          //       );
               
          //     } else {
          //       this.toastrService.info(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
          //     }
          //   },
          //   (error) => {
          //     this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
          //   }
          // )
        }
      )
    } catch (error) {
      console.error(error)
    }

  }



}


