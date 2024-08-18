import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TemplatePrintService} from './service/template-print.service';
import {element} from 'protractor';
import {UtilService} from '../../../../../services/util/util.service';
import {InactiveUserTimesTypeEnum} from '../../../../../core/type/inactive-user-times-type.enum';

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

    //ESTE METODO ES PARA MOSTRAR 4 X 6
    convertObject() {
        const listFourGenerales: any[] = [];
        const listSixGenerales: any[] = [];

        const items = [];
        this.firstElements = [];
        this.secondElements = [];
        if(this.lstGenerales.length < 8) {

            this.lstGenerales.forEach((element, index) => {
                items.push({...element, index: (index + 1)});
    
                if (items.length === this.lstGenerales.length) {
                    listFourGenerales.push(...items);
                    items.length = 0;
                }
            });

            const first = listFourGenerales.slice(0, 4);
            const second = listFourGenerales.slice(4, listFourGenerales.length);
            // console.log("second", second);
            // console.log("first", first);
            
            this.firstElements = [];
            this.firstElements.push({column1: first, column2: second});
            this.secondElements = [];
            //console.log("firstElements", this.firstElements);
        }else {

       
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
    }

    printPage() {
        const printContents = document.getElementById('print')?.innerHTML;
        if (printContents) {
            this.service.createHtmlSectionForPrint(printContents);
        }
    }

    filtrarNombramiento(e): string {
        console.log(e)
        let otro_cargo = e.cargo

        let nmb = JSON.parse(e.resoluciones).filter(e => {
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
                texto = nmb[0].asunto + `<br> RESOL. ${nmb[0].numero} <br> ${nmb[0].fecha}<br> ${otro_cargo}` 
            }
        } else {
            texto = 'SIN NOMBRAMIENTO';
        }
        return texto;
    }

    filtrarAscenso(e) {
        let area = e.area == ''?'1 DE 1': e.area
        let asc = JSON.parse(e.resoluciones).filter(e => {
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
        let texto = ''
        if (asc.length !== 0) {
            let pos = asc[0].orden == 0 ? area : asc[0].orden + ' DE ' + asc[0].cantidad
            texto =  `RESOL. ${asc[0].numero} <br> ${asc[0].fecha}<br><br> ${pos}`
        } else {
            texto = 'SIN RESUELTO'
        }
        return texto
    }

    setDefaultPic(event: any) {
        event.target.src = this.utils.imgNoDisponible;
    }

    getEscudo(comp) : string {
        return comp=='%'?'mppd.png': comp +'.jpeg'
    }
}
