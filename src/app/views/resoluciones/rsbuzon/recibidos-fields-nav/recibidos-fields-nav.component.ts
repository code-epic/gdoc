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
    this.formSidenav.disable();
  }

  close() {
    this.closeEvent.emit(false);
  }

}
