import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-table-grallibro-modal',
    templateUrl: './table-grallibro-modal.component.html',
    styleUrls: ['./table-grallibro-modal.component.scss']
})
export class TableGrallibroModalComponent implements OnInit {

    componente = '0';
    Componentes = [];
    lstGenerales = [];
    lstQa: any[] = [];

    nameLabelDoc = 'RELACION DE OFICIALES GENERALES';


    firstElements: any[] = [];
    secondElements: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<TableGrallibroModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.componente = this.data.componente;
        this.lstGenerales = this.data.lstGenerales;
        this.lstQa = this.data.lstQa;
        // console.log('this.componente', this.componente);
        // console.log('this.lstGenerales', this.lstGenerales);
        // console.log('this.lstQa', this.componente);

        this.convertObject();
    }

    changeLabelNameHearder() {

    }

    convertObject() {
        const listFourGenerales: any[] = [];
        const listSixGenerales: any[] = [];
        const items = [];
        this.lstGenerales.forEach((element, index) => {
            items.push(element);

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
        const second = listFourGenerales.slice(4, listFourGenerales.length);;
        this.firstElements = [];
        this.firstElements.push({column1: first, column2: second});
        console.log('firstElements', this.firstElements);

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

        console.log('this.secondElements',  this.secondElements);


    }

    printPage() {
        var printContents = document.getElementById('print').innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        // window.close();
    }
}
