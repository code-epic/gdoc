import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UtilService } from 'src/app/services/util/util.service';

import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { ApiService, IAPICore } from '../apicore/api.service';
import { Md5 } from 'md5-typescript';

export interface IUsuario {
  nombre: string;
  cedula: string;
  tipo: string;
  componente: string;
  clave: string;
  correo: string;
}

export interface IToken {
  token: string;
}

export interface UClave {
  login: string;
  clave: string;
  nueva: string;
  repetir: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})



export class LoginService {

  public URL: string =  environment.API;

  public Id = '';

  public SToken: any;

  public Token: any;

  public Usuario: any;

  public Aplicacion: any;

  public urlGet = '';


  public xAPI: IAPICore = {
    funcion: '',
    parametros: ''
  }

  constructor(
    private utils: UtilService,
    private apiService: ApiService,
    private router: Router, 
    private http: HttpClient) {

    this.Id = environment.ID;
    if (sessionStorage.getItem('token') != undefined ) { 
      this.SToken = sessionStorage.getItem('token')
      this.getUserDecrypt(this.SToken)
    }
  }

  async IniciarSesion(itk: string) {
    this.Token = await this.getUserDecrypt(itk)
    sessionStorage.setItem("token", itk);
    this.obenterAplicacion(itk)
  }

  async Iniciar(token: string = '') {
    token = token == '' ? sessionStorage.getItem('token'): token

    await this.getUserDecrypt(token);
    this.obenterAplicacion(token);
    
  }
  getLogin(user: string, clave: string): Observable<IToken> {
    let usuario = {
      'nombre' : user,
      'clave' : clave,
    };
    let url = this.URL + 'wusuario/loginV2';
    return this.http.post<IToken>(url, usuario );
  }

  makeUser(user: IUsuario): Observable<any> {
    let url = this.URL + 'identicacion';
    return this.http.post<any>( url, user );
  }

  // logout() {
  //   this.router.navigate(['login']);
  //   sessionStorage.removeItem('token');
  //   sessionStorage.removeItem('id');
  // }

  public getUserDecrypt(token : string ): any {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.Token = decodedToken;
    this.Usuario = this.Token.Usuario;

    return this.Token;
  }


  obtenerMenu(): any {
    return JSON.parse(sessionStorage.getItem('menu'))
  }

  obtenerPrivilegiosMenu(idUrl: string): any {
    let Menu: any;
    this.obtenerMenu().forEach(e => {if (e.url == idUrl) { Menu = e; }});
    return Menu;

  }

  obtenerSubMenu(idUrl: string): any {
    let SubMenu = [];
    this.obtenerMenu().forEach(e => {if (e.url == idUrl) { SubMenu = e.SubMenu; }});
   
    return SubMenu;
  }

  isLogged() {
    return sessionStorage.getItem('token') ? true : false;
  }


   logout() {
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      text: "Gracias por su tiempo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5eaaa8',
      cancelButtonColor: '#ef9a9a',
      confirmButtonText: 'Si, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/logout']);
      }
    })
  }



  /**
   * Orquesta el proceso de cierre de sesión completo, notificando el progreso.
   * @param progressCallback Una función para reportar el progreso a la UI.
   */
  public async performLogoutProcess(progressCallback: (message: string) => void) {
    try {
      progressCallback('Finalizando sesión en el servidor...');
      await this.utils.sleep(800); // Pequeña pausa para UX
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        }),
      };
      const url = this.URL + 'wusuario/logout:' + localStorage.getItem("userId");
      await this.http.post(url, {}, httpOptions).toPromise();
    } catch (error) {
      console.error("Error al contactar el servidor para logout (se procederá con la limpieza local):", error);
      progressCallback('No se pudo contactar al servidor, limpiando localmente...');
      await this.utils.sleep(1500);
    } finally {
      progressCallback('Limpiando datos de la sesión...');
      await this.utils.sleep(800); // Pequeña pausa para UX
      await this.clearSession();

      progressCallback('¡Hasta pronto!');
      await this.utils.sleep(1200); // Pequeña pausa para que el usuario lea el mensaje final.
      this.router.navigate(['/login']);
    }
  }

  /**
   * Guarda las tareas pendientes y limpia el almacenamiento local y de sesión.
   * Es async para asegurar que los pasos se completen antes de continuar.
   */
  async clearSession(): Promise<void> {
   
      // Esto SIEMPRE debe ejecutarse para garantizar el cierre de sesión en el cliente.
      sessionStorage.clear();
      localStorage.clear();

  }


  //ObenterAplicacion 
  protected obenterAplicacion(itk: string) {


    let cadena = this.Token.Usuario.cedula + ',' + this.Token.Usuario.sistema + ',' + this.Token.Usuario.correo
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = environment.funcion.CONSULTAR_USUARIO_PERFIL
    this.xAPI.parametros = cadena
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        try {
          // Verificamos que la data y las propiedades anidadas existan antes de usarlas
          if (!data || data.length === 0 || !data[0].Aplicacion || data[0].Aplicacion.length === 0 || !data[0].Aplicacion[0].Rol) {
            throw new Error("La respuesta del perfil de usuario no es válida o está vacía.");
          }

          console.log('Imprimiendo')
          sessionStorage.setItem("menu", JSON.stringify(data[0].Aplicacion[0].Rol.Menu));
          let texto = Md5.init(JSON.stringify(data[0].Aplicacion[0].Rol.Menu));

          this.utils.uuidv4();

          sessionStorage.setItem("crypt", texto);
          this.router.navigate(["/dashboard"]).then(() => {
            window.location.reload();
          });
        } catch (e) {

          console.error('Error al procesar el perfil del usuario:', e);
          Swal.fire({
            title: 'Error de Perfil',
            text: 'No se pudo cargar la configuración de su perfil. Por favor, contacte al administrador.',
            icon: 'error'
          });
          sessionStorage.clear();
          localStorage.clear();

        }

      },
      (error) => {
        sessionStorage.clear();
        localStorage.clear();
        // this.router.navigate(["/login"]).then(() => {
        //   window.location.reload();
        // });
        console.error('Fallo conectando al perfil del usuario: ', error)
      }
    )




  }


}
