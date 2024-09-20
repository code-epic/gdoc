import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util/util.service';
import { TemplatePrintRsreportesService } from './service/template-print-rsreportes.service';

@Component({
  selector: 'app-table-rsreportes-modal',
  templateUrl: './table-rsreportes-modal.component.html',
  styleUrls: ['./table-rsreportes-modal.component.scss']
})
export class TableRsreportesModalComponent implements OnInit {
  componente = '0';
  componente_id = '';
  Componentes = [];
  lstGenerales = [];
  lstNombres = []
  lstQa: any[] = [];

  constructor(
    public utils: UtilService,
    private _imprimirService: TemplatePrintRsreportesService,
    public dialogRef: MatDialogRef<TableRsreportesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.componente = this.data.componente;
    this.lstGenerales = this.data.lstGenerales;
    this.componente_id = this.data.componente_id;
    this.lstQa = this.data.lstQa;
    this.lstNombres = this.data.lstNombres
  }

  setDefaultPic(event: any) {
    event.target.src = this.utils.imgNoDisponible;
}

  getEscudo(comp) : string {
    return comp=='%'?'mppd.png': comp +'.jpeg'
  }

  imprimirTabla(){
    const impresion = document.getElementById('imprimir')?.innerHTML;
    if (impresion) {
      this._imprimirService.imprimirContenido(impresion);
    }
  }

}
