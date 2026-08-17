import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { TotpVerifyComponent } from 'src/app/components/totp-verify/totp-verify.component';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-rsprocesos',
  templateUrl: './rsprocesos.component.html',
  styleUrls: ['./rsprocesos.component.scss']
})
export class RsprocesosComponent implements OnInit {

  // xobser: Editor = new Editor;
  public id: string = ''

  public lstProyectos = []
  public lstCotizaciones = []
  public bzBusqueda = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }



  public placement = 'bottom'
  public titulo = 'Procesos'

  public buscar = ''

  public favance: NgbDate | null

  public posicionPagina = 0

  public focus = true
  public dbasico = false
  public aresolucion = false
  public lotes = false
  public dpublicaciones = false
  public masivo = false
  public menu = true
  public generales = false
  public entradas = false
  public aentradas = false
  public eliminaciones = false
  public lstHistorico: any[] = []
  public blHistorico = false

  public resueltoForm = {
    numero: '',
    fecha: '',
    fechaDate: null as any,
    descripcion: '',
    autoriza: '',
    usuario: ''
  }
  private activeModalRef: any = null;

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    public loginService: LoginService) { }

  ngOnInit(): void {

    if (window.sessionStorage.getItem("historico") != undefined) {
      this.lstHistorico = JSON.parse(
        window.sessionStorage.getItem("historico"))
      this.blHistorico = true
    }

  }

  verHistorico() {

  }

  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;

  }





  open(content) {
    this.lstHistorico = sessionStorage.getItem("historico") != undefined ? JSON.parse(sessionStorage.getItem("historico")) : []
    this.modalService.open(content, { size: 'lg' });
  }

  desactivar(titulo: string) {
    this.dbasico = false
    this.aresolucion = false
    this.lotes = false
    this.menu = false
    this.generales = false
    this.dpublicaciones = false
    this.entradas = false
    this.eliminaciones = false
    this.titulo = titulo
  }


  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize
    pag = pag * pagina

    // if(this.posicionPagina == 0 ){
    //   this.bzAlertas =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }else{
    //   this.bzSeguimiento =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }


  }

  editar(ruta: string, id: string) {
    const base = btoa(id)
    this.ruta.navigate(['/' + ruta, base])
  }

  irAnterior() {
    if (this.menu) {
      history.back()
    } else {
      this.menu = true
      this.dbasico = false
      this.aresolucion = false
      this.aentradas = false
      this.masivo = false
      this.lotes = false
      this.generales = false
      this.dpublicaciones = false
      this.eliminaciones = false
      this.titulo = 'Procesos'
    }

  }

  async openOrganizarModal(content: any) {
    const userToken = this.loginService.Usuario?.token;
    if (!userToken || (typeof userToken === 'string' && userToken.trim() === '')) {
      Swal.fire({
        title: "Doble Factor Requerido",
        text: "Debe activar la verificación de dos pasos (2FA) en su perfil de usuario para poder modificar la secuencia de resueltos.",
        icon: "warning",
        confirmButtonColor: "#3a86c8",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const today = new Date();
    const todayStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };

    // Reset form
    this.resueltoForm = {
      numero: '',
      fecha: this.formatter.format(todayStruct),
      fechaDate: todayStruct,
      descripcion: 'ORGANIZACIÓN DE NÚMERO RESUELTO',
      autoriza: '',
      usuario: (this.loginService.Usuario?.nombre || '') + ' ' + (this.loginService.Usuario?.apellido || '')
    };

    // Fetch current sequence number
    const xAPI = {} as IAPICore;
    xAPI.funcion = environment.funcion.OBTENER_NUMERO_RESUELTO;
    xAPI.parametros = ``;
    try {
      const data: any = await this.apiService.Ejecutar(xAPI).toPromise();
      if (data && data.Cuerpo && data.Cuerpo.length) {
        const numeroActual = parseInt(data.Cuerpo[0].numero, 10) || 0;
        const nuevoNumero = numeroActual + 1;
        this.resueltoForm.numero = nuevoNumero.toString().padStart(6, "0");
      }
    } catch (err) {
      console.error("Error al obtener secuencia de número resuelto:", err);
    }

    this.activeModalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
  }

  async guardarOrganizarResueltos() {
    const userToken = this.loginService.Usuario?.token;
    if (!userToken || (typeof userToken === 'string' && userToken.trim() === '')) {
      Swal.fire({
        title: "Doble Factor Requerido",
        text: "Debe activar la verificación de dos pasos (2FA) en su perfil de usuario para poder modificar la secuencia de resueltos.",
        icon: "warning",
        confirmButtonColor: "#3a86c8",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (!this.resueltoForm.numero || this.resueltoForm.numero.trim() === '') {
      Swal.fire('Atención', 'El número de resuelto es requerido.', 'warning');
      return;
    }
    if (!this.resueltoForm.autoriza || this.resueltoForm.autoriza.trim() === '') {
      Swal.fire('Atención', 'Debe ingresar el nombre de la persona que autoriza la modificación.', 'warning');
      return;
    }

    // Open the 2FA TotpVerify Component modal for validation
    const totpModalRef = this.modalService.open(TotpVerifyComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    totpModalRef.componentInstance.title = 'Autorizar Cambio de Secuencia';

    totpModalRef.result.then(
      async (otpCode) => {
        if (otpCode) {
          // OTP verified successfully, execute the number modification API call
          const xAPI = {} as IAPICore;
          xAPI.funcion = environment.funcion.INSERTAR_NUMERO_RESUELTO;
          xAPI.parametros = `${this.resueltoForm.numero},RESOLUCION,NUEVO,${this.loginService.Usuario?.id || '0'}`;
          xAPI.valores = '';

          try {
            await this.apiService.Ejecutar(xAPI).toPromise();

            // Add to operation history list
            const finalFecha = this.formatter.format(this.resueltoForm.fechaDate) || new Date().toISOString().substring(0, 10);
            const newLog = {
              cedula: this.loginService.Usuario?.cedula || 'N/A',
              numero: this.resueltoForm.numero,
              registro: finalFecha,
              asunto: `MODIFICACIÓN SECUENCIA: ${this.resueltoForm.descripcion.toUpperCase()} (AUTORIZA: ${this.resueltoForm.autoriza.toUpperCase()})`
            };

            this.lstHistorico.push(newLog);
            sessionStorage.setItem("historico", JSON.stringify(this.lstHistorico));
            this.blHistorico = true;

            Swal.fire({
              title: '¡Operación Exitosa!',
              text: `La secuencia de resueltos ha sido modificada correctamente al número ${this.resueltoForm.numero}.`,
              icon: 'success',
              confirmButtonColor: '#2dce89'
            });

            if (this.activeModalRef) {
              this.activeModalRef.close();
            }
          } catch (err) {
            console.error("Error al modificar secuencia de número resuelto:", err);
            Swal.fire('Error', 'Ocurrió un error al intentar modificar la secuencia del número resuelto.', 'error');
          }
        }
      },
      (dismissReason) => {
        console.log('2FA modal dismissed:', dismissReason);
      }
    );
  }

}
