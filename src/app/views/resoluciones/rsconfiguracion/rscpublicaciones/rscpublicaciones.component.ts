import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ValidatorFn, AbstractControl, ValidationErrors, } from '@angular/forms';


export interface Resoluciones {
  numero: string;
  fecha: string;
  asunto: string;
  ruta: string;
  login: string;
}

export interface Usuarios {
  nombre: string;
  login: string;
  correo: string;
  sucursal: string;
}

export function listaNoVaciaValidator(rsl: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (rsl.length === 0) {
      return { 'Sin Resoluciones': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-rscpublicaciones',
  templateUrl: './rscpublicaciones.component.html',
  styleUrls: ['./rscpublicaciones.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})

export class RscpublicacionesComponent implements OnInit {
  public numero: string = "";
  public cedula: string = "";
  public resolucion: string = "";
  public total: number = 0;
  firstFormGroup: FormGroup;


  secondFormGroup =
    this._formBuilder.group({});


  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };
  public lstResoluciones: any
  public blistar: boolean = false
  public benviar: boolean = false
  public lstRs = []
  public lstUsr = []
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  resoluciones: Resoluciones[] = [];
  usuarios: Usuarios[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private utilService: UtilService,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({ validators: listaNoVaciaValidator(this.resoluciones) });
    this.cargarUsuarios()
  }




  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // // Add our fruit
    // if (value) {
    //   this.resoluciones.push({nombre: value});
    // }

    // // Clear the input value
    // event.chipInput!.clear();
  }

  remove(rsl: Resoluciones): void {
    const index = this.resoluciones.indexOf(rsl);

    if (index >= 0) {
      this.resoluciones.splice(index, 1);
    }
  }

  agregar(num: string, fecha: string, pos: number) {
    let lst : Resoluciones = {
      'numero': num,
      'fecha': fecha,
      'asunto': '',
      'ruta': '',
      'login': ''
    }
    this.resoluciones.push(lst)

    // this.blistar = false;
    this.lstResoluciones.splice(pos, 1);


    // this.benviar = true
  }

  agregarUsuario(nombre: string, correo: string, login: string, sucursal: string, pos: number) {
    let lst = {
      'nombre': nombre,
      'correo': correo,
      'login': login,
      'sucursal': sucursal
    }
    this.usuarios.push(lst)

    // this.blistar = false;
    this.lstUsr.splice(pos, 1);


    this.benviar = true
  }

  cargarUsuarios() {

    this.ngxService.startLoader("loader-x");
    this.xAPI.funcion = "_SYS_LUsuario";
    this.xAPI.parametros = 'gdoc.mppd';
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstUsr = data
        this.ngxService.stopLoader("loader-x");

      },
      (error) => {
        console.error("Error de conexion a los datos ", error);
        this.ngxService.stopLoader("loader-x");
      }
    );
  }

  consultarResolucion(event) {
    this.blistar = false;

    if (event == undefined || event.charCode == 13) {
      if (this.numero == "") {

        this._snackBar.open("Debe seleccionar un número para continuar", "OK")
        return
      }
      this.ngxService.startLoader("loader-x");
      this.xAPI.funcion = "MPPD_CResolucionesGrupo";
      this.xAPI.parametros = this.numero;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data);
          this.resolucion = this.numero;
          this.numero = "";
          this.blistar = true;

          this.lstResoluciones = data.Cuerpo;
          this.total = this.lstResoluciones.length;
          if (this.total == 0) {
            this.blistar = false;
          }
          this.ngxService.stopLoader("loader-x");
        },
        (error) => {
          console.error("Error de conexion a los datos ", error);
          this.ngxService.stopLoader("loader-x");
        }
      );
    }

  }


  validarUsuarios(){
    console.log(this.usuarios.length, this.usuarios)
    if(this.usuarios.length == 0 || this.usuarios[0].correo == undefined) {
      this._snackBar.open("Debe seleccionar minimo un usuario para continuar", "OK")
      return false
    }
    this.insertarUsuario()
  }

  insertarUsuario(){
   
    let usuario = {
      'correo': this.usuarios[0].correo,
      'login':this.usuarios[0].login,
      'sucursal': this.usuarios[0].sucursal,
    }
    this.usuarios.splice(0, 1);
    this.xAPI.funcion = 'MPPD_IBuzon_Usuario'
    this.xAPI.valores = JSON.stringify(usuario)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data.msj)
        this.insertarUsuario()
      },
      err => {

      }
    )
    
    
  }


  validarResueltos(){
    if(this.resoluciones.length == 0 ) {
      
      return false
    }
    
  }

  insertarResueltos(){
    let rsl = {
      'numero': this.usuarios[0].correo,
      'fecha': this.usuarios[0].login,
      'asunto': this.usuarios[0].sucursal,
    }
    this.usuarios.splice(0, 1);
    this.xAPI.funcion = 'MPPD_IBuzon_Resoluciones'
    this.xAPI.valores = JSON.stringify(rsl)

  }



}
