import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TemplatePrintService} from './service/template-print.service';
import {element} from 'protractor';
import {UtilService} from '../../../../../services/util/util.service';

@Component({
    selector: 'app-table-grallibro-modal',
    templateUrl: './table-grallibro-modal.component.html',
    styleUrls: ['./table-grallibro-modal.component.scss']
})
export class TableGrallibroModalComponent implements OnInit {
    e;

    componente = '0';
    componente_id = '';
    Componentes = [];
    lstGenerales = [];
    lstQa: any[] = [];


    nameLabelDoc = 'RELACION DE OFICIALES GENERALES';


    firstElements: any[] = [];
    secondElements: any[] = [];
    lstResoluciones = [];

    constructor(
        private service: TemplatePrintService,
        public utils: UtilService,
        public dialogRef: MatDialogRef<TableGrallibroModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.componente = this.data.componente;
        this.lstGenerales = this.data.lstGenerales;
        this.componente_id = this.data.componente_id;
        this.lstQa = this.data.lstQa;

        // console.log(this.lstGenerales)
        this.convertObject();
    }

    changeLabelNameHearder() {

    }

    convertObject() {
        const listFourGenerales: any[] = [];
        const listSixGenerales: any[] = [];

        const items = [];
        this.firstElements = [];
        this.secondElements = [];
        // tslint:disable-next-line:no-shadowed-variable
        this.lstGenerales.forEach((element, index) => {
            items.push({...element, index: (index + 1)});

            if (items.length === 8) {
                listFourGenerales.push(...items);
                items.length = 0;
            } else if (listFourGenerales.length > 1) {
                if (items.length === 6) {
                    listSixGenerales.push(...items);
                    items.length = 0;
                } else if ((this.lstGenerales.length - 1) === index) {
                    listSixGenerales.push(...items);
                    items.length = 0;
                }
            }
        });
        const first = listFourGenerales.slice(0, 4);
        const second = listFourGenerales.slice(4, listFourGenerales.length);

        this.firstElements = [];
        this.firstElements.push({column1: first, column2: second});

        const element = [];
        for (let i = 0; i < listSixGenerales.length; i += 6) {

            const iterator = listSixGenerales.slice(i, i + 6);
            element.push([...iterator]);
            if (element.length === 2) {
                this.secondElements.push({
                    column1: element[0], column2: element[1]
                });
                element.length = 0;
            } else if (iterator.length < 6) {
                this.secondElements.push({
                    column1: element[0]
                });
            }
        }
    }

    printPage() {
        const printContents = document.getElementById('print')?.innerHTML;
        if (printContents) {
            this.service.createHtmlSectionForPrint(printContents);
        }
    }

    filtrarNombramiento(e): string {
        let nmb = JSON.parse(e).filter(e => {
            return e.tipo != 13;
        }).sort( (a, b) => {
            if (a.fecha > b.fecha) {
                return -1;
            } else if (a.fecha < b.fecha) {
                return 1;
            } else {
                return 0;
            }
        });

        let texto = '';
        if (nmb.length !== 0) {
            if (nmb[0].asunto === undefined ) {
                texto = '';
            } else {
                texto = nmb[0].asunto + `<br> RESOL. <br> ${nmb[0].numero} <br> ${nmb[0].fecha}<br>`
            }
        } else {
            // estos console.log deben borrarse es solo para la explicacion tecnica
            console.log('e =>', e); //dato que viene del metodo
            console.log('nmb', nmb); //dato que retorno el filter
            console.log('nmb[0]', nmb[0]); // se esta buscando un elemento en especifico, pero como no hay nada, esto es undefine
            texto = '';
        }
        return texto;
    }

    filtrarAscenso(e) {
        let asc = JSON.parse(e).filter(e => {
            return e.tipo == 13;
        }).sort((a, b) => {
            if (a.fecha > b.fecha) {
                return -1;
            } else if (a.fecha < b.fecha) {
                return 1;
            } else {
                return 0;
            }
        });
        //console.log(asc)
        // console.log('ordenando... ', asc)
        //asc[0].asunto.substring(0,100)
        let pos = asc[0].orden == 0 ? '1 DE 1' : asc[0].orden + ' DE ' + asc[0].cantidad
        return `RESOL. <br> ${asc[0].numero} <br> ${asc[0].fecha}<br><br> ${pos}`
    }

    setDefaultPic(event: any) {
        event.target.src = this.utils.imgNoDisponible;
    }
}
