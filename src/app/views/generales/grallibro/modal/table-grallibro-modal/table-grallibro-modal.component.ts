import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TemplatePrintService} from './service/template-print.service';
import {element} from 'protractor';

@Component({
    selector: 'app-table-grallibro-modal',
    templateUrl: './table-grallibro-modal.component.html',
    styleUrls: ['./table-grallibro-modal.component.scss']
})
export class TableGrallibroModalComponent implements OnInit {
    e;

    componente = '0';
    Componentes = [];
    lstGenerales = [];
    lstQa: any[] = [];

    nameLabelDoc = 'RELACION DE OFICIALES GENERALES';


    firstElements: any[] = [];
    secondElements: any[] = [];

    constructor(
        private service: TemplatePrintService,
        public dialogRef: MatDialogRef<TableGrallibroModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.componente = this.data.componente;
        this.lstGenerales = this.data.lstGenerales;
        this.lstQa = this.data.lstQa;

        this.convertObject();
    }

    changeLabelNameHearder() {

    }

    convertObject() {
        const listFourGenerales: any[] = [];
        const listSixGenerales: any[] = [];
        const items = [];
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


}
