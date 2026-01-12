import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/seguridad/login.service';
import { MensajeService } from 'src/app/services/util/mensaje.service';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { Sha256Service } from 'src/app/services/util/sha256';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { WsSandraService } from 'src/app/services/seguridad/ws-sandra.service';



interface Change {
  usuario: string;
  clave: string;
  nueva: string;
  repite: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  @Output() onChange = new EventEmitter<any>();
  public nombre: string = 'Analista'
  public alerta: boolean = false
  public usuario: string = ''
  public cedula: string = '';
  public correo: string = '';
  public fecha: Date = new Date();





  public showClave = false;
  public showNueva = false;
  public showRepite = false;


  public Change: Change = {
    usuario: "",
    clave: "",
    nueva: "",
    repite: "",
  }


  // Password Strength properties
  public passwordStrength: number = 0;
  public passwordStrengthLabel: string = 'Sin seguridad';
  public passwordStrengthColor: string = '';
  public passwordStrengthWidth: number = 0;


  // Agrega estas propiedades a tu clase NavbarComponent
  public showTotpSection: boolean = false;
  public totpQrCodeUrl: string = '';
  public totpSecret: string = '';
  public isTotpSecretCopied: boolean = false;
  public isTotpActive: boolean = false;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: ''
  };



  constructor(location: Location,
    private msj: MensajeService,
    private loginService: LoginService,
    private apiService: ApiService,
    private utilservice: UtilService,
    private modalService: NgbModal,
    private sha256: Sha256Service,
    private ws: WsSandraService,
    private router: Router) {
    this.location = location;
  }

  ngOnInit() {


    this.listTitles = ROUTES.filter(listTitle => listTitle);

    this.nombre = this.loginService.Usuario.nombre
    this.cedula = this.loginService.Usuario.cedula
    this.correo = this.loginService.Usuario.correo

    setInterval(() => {
      this.fecha = new Date();
    }, 1000);

    this.verificarDepartamentoResoluciones();

    this.msj.contenido$.subscribe(e => {
      // console.log(e)
      this.alerta = e.valor

      // Guardar el estado en sessionStorage para persistencia
      if (this.estaEnResoluciones()) {
        this.alerta = e.valor;
        sessionStorage.setItem('alertaEstado', JSON.stringify(e.valor));
      }
    });

    // Recuperar el estado guardado si existe
    if (this.estaEnResoluciones()) {
      const estadoGuardado = sessionStorage.getItem('alertaEstado');
      if (estadoGuardado) {
        this.alerta = JSON.parse(estadoGuardado);
      }
    } else {
      // Si no estamos en resoluciones, forzar a false
      this.alerta = false;
      sessionStorage.removeItem('alertaEstado');
    }
  }


  // Método para verificar si estamos en el departamento de resoluciones
  private verificarDepartamentoResoluciones(): void {


    if (!this.estaEnResoluciones()) {
      this.alerta = false;
      sessionStorage.removeItem('alertaEstado');
    }
  }

  // Método para verificar si estamos en el departamento de resoluciones
  private estaEnResoluciones(): boolean {
    const currentPath = this.location.path();
    // Ajusta estas rutas según tus necesidades exactas
    return currentPath.includes('/resoluciones') ||
      currentPath.includes('/rsalertas') ||
      currentPath.includes('/rsconsulta');
  }

  open(content) {
    this.modalService.open(content);
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Principal';
  }

  booleanIsSidenav = false;
  onChangeSidenav() {
    this.booleanIsSidenav = !this.booleanIsSidenav;
    this.onChange.emit(true);
  }

  cerrar() {
    this.loginService.logout();
  }






  ModalChangePassword(modal) {
    this.Change.usuario = this.usuario;
    this.modalService.open(modal, {
      centered: true,
      size: "md",
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal'
    });
  }

  async ChangesPassword() {
    if (!this.Change.usuario) {
      this.utilservice.AlertMini("top-end", "error", "No existe un usuario", 3000);
      return;
    }

    if (this.Change.nueva !== this.Change.repite) {
      this.utilservice.AlertMini(
        "top-end",
        "error",
        "La nueva contraseña y su repetición no coinciden.",
        3000
      );
      return;
    }

    const password = this.Change.nueva;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!passwordRegex.test(password)) {
      this.utilservice.AlertMini(
        "top-end",
        "error",
        "La clave no cumple con los requisitos de complejidad.",
        5000
      );
      this.utilservice.AlertMini(
        "top-end",
        "info",
        "Debe tener entre 8 y 16 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&).",
        8000
      );
      return;
    }


    await this.sha256.hash(this.Change.clave).then(hash => {
      this.Change.clave = hash
    })

    await this.sha256.hash(this.Change.nueva).then(hash => {
      this.Change.nueva = hash
    })


    let xApi = {
      funcion: environment.funcion.ACTUALIZAR_CLAVE_USUARIO,
      parametros: `${this.Change.usuario},${this.Change.clave},${this.Change.nueva}`,
    }

    this.apiService.Ejecutar(xApi).subscribe(
      (data) => {
        // console.log(data.ModifiedCount)
        if (data.ModifiedCount > 0) {
          this.utilservice.AlertMini("top-end", "success", "Contraseña actualizada exitosamente", 3000);
          window.sessionStorage.clear();
          this.router.navigate(['/login']);
        }
        this.clearModal();
      },
      (error) => {
        // console.log(error)
        this.clearModal();
      }
    )


  }

  clearModal() {
    this.Change = {
      usuario: "",
      clave: "",
      nueva: "",
      repite: "",
    }
    this.modalService.dismissAll();
  }





  // ... (dentro de la clase NavbarComponent)

  /**
   * Activa o desactiva la sección de configuración de TOTP.
   * Si se activa, genera el código si no ha sido generado antes.
   * @param event El evento del interruptor.
   */
  toggleTotp(event: any) {
    const isChecked = event.target.checked;
    this.showTotpSection = isChecked;

    if (isChecked && !this.totpSecret) {
      this.generateTotp()
    } else {
      this.limpiarTotp()
      console.log('Desactivado')
    }
  }

  /**
   * Llama al backend para generar un nuevo secreto y código QR para TOTP.
   */
  async generateTotp() {
    // Muestra un spinner mientras se genera el código
    this.totpQrCodeUrl = '';
    this.totpSecret = '';

    // NOTA: La siguiente sección es un EJEMPLO. Debes reemplazarla con la llamada real a tu API.
    // Asumo que tienes una función en tu API para esto.

    this.apiService.GenerarQR_TOTP('base64').subscribe(
      (data) => {
        // Asumiendo que tu API devuelve un objeto con 'qrCode' (sdata URL) y 'secret' (la clave)
        this.totpQrCodeUrl = data.contenido;
        this.totpSecret = data.msj;
      },
      (error) => {
        console.error('Error al generar el código TOTP', error);
        this.utilservice.AlertMini('top-end', 'error', 'No se pudo generar el código.', 4000);
        this.showTotpSection = false; // Oculta la sección si hay un error
      }
    );
  }

  async limpiarTotp() {

    this.showTotpSection = false;
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = environment.funcion.ACTUALIZAR_TOTP
    this.xAPI.parametros = this.totpSecret

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.totpQrCodeUrl = ''
        this.totpSecret = ''
      },
      (error) => {
        console.log(error)
      }
    )

  }

  /**
   * Copia la clave secreta de TOTP al portapapeles del usuario.
   */
  copyTotpSecret() {
    if (!this.totpSecret) return;

    navigator.clipboard.writeText(this.totpSecret).then(() => {
      this.isTotpSecretCopied = true;
      setTimeout(() => {
        this.isTotpSecretCopied = false;
      }, 2500);
    }).catch(err => {
      console.error('Error al copiar la clave TOTP:', err);
      this.utilservice.AlertMini('top-end', 'error', 'No se pudo copiar la clave.', 3000);
    });
  }


  /**
* Check Password Strength
* @param password 
*/
  checkPasswordStrength(password: string): void {
    const checks = [
      /.{8,}/,       // Mínimo 8 caracteres
      /[A-Z]/,       // Al menos una mayúscula
      /[a-z]/,       // Al menos una minúscula
      /[0-9]/,       // Al menos un número
      /[@$!%*?&]/    // Al menos un símbolo
    ];

    const result = checks.reduce((score, regex) => {
      return score + (regex.test(password) ? 20 : 0);
    }, 0);

    this.passwordStrengthWidth = result;
    console.log(this.passwordStrengthWidth)

    if (result < 40) {
      this.passwordStrengthLabel = 'Débil';
      this.passwordStrengthColor = 'bg-danger';
    } else if (result < 80) {
      this.passwordStrengthLabel = 'Media';
      this.passwordStrengthColor = 'bg-warning';
    } else if (result < 100) {
      this.passwordStrengthLabel = 'Buena';
      this.passwordStrengthColor = 'bg-info';
    } else {
      this.passwordStrengthLabel = 'Fuerte';
      this.passwordStrengthColor = 'bg-success';
    }
  }


  activarSinEvento() {
    this.isTotpActive = true;
    this.apiService.GetImageQR(this.totpSecret).subscribe(
      (data) => {
        console.log(data)
        this.totpQrCodeUrl = data.contenido;
      },
      (error) => {
        console.error('Error al generar el código TOTP', error);
      }
    )
  }





}
