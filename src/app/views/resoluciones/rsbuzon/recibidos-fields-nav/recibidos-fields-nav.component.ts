import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-recibidos-fields-nav',
  templateUrl: './recibidos-fields-nav.component.html',
  styleUrls: ['./recibidos-fields-nav.component.scss']
})
export class RecibidosFieldsNavComponent implements OnInit {

  @Input()
  formSidenav: FormGroup;

  @Input()
  title: any = 'N/A';

  @Output()
  closeEvent:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.reactiveForm();
  }

  close() {
    this.closeEvent.emit(false);
  }

  reactiveForm(){
    //SI QUIERES INHABILITAR TODO EL FORMULARIO:
    /*
    this.formSidenav.disable();
    */

    //SI QUIERES INHABILITAR SOLO UN INPUT O SELECT
    /*
    this.formSidenav.get('formControlNameAQUI').disable();
    */

    //QUIERES AGREGAR ALGUNA VALIDACION A SOLO UN CAMPO LUEGO DE SLECCIONAR OTRO CAMPO
    /*
    his.formSidenav.get('formControlNameAQUI').setValidators([AQUI VA LA VALIDACION, ANGULAR TE TRAE UNAS CUANTAS POR DEFECTO Validators.required, Validators.regex('a-z')]);
     */

    // QUIERES SABER CUANDO UN USER ESCRIBA EN UN CAMPO ESPECIFICO:
    /*
    this.formSidenav.get('formControlNameAQUI').valueChanges.subscribe((value) => {
      console.log("VALUE", value);
    });
    */
  }
}
