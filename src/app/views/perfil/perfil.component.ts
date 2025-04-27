import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/seguridad/login.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public nombre: string = 'Analista'

  constructor(
    private loginService: LoginService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.nombre = this.loginService.Usuario.nombre

  }


  cerrar(){
    
    Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        '<input type="text" class="form-control" placeholder="Contraseña Actual"><br>'+
        '<input type="text" class="form-control" placeholder="Nueva Contraseña"><br>'+
        '<input type="text" class="form-control" placeholder="Repita Nueva Contraseña">',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar'
    })
  }

  open(content) {
    this.modalService.open(content, {size: 'lg'});

  }


}
