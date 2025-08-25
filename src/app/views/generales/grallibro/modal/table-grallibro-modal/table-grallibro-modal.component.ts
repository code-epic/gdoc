import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplatePrintService } from './service/template-print.service';
import { element } from 'protractor';
import { UtilService } from '../../../../../services/util/util.service';
import { InactiveUserTimesTypeEnum } from '../../../../../core/type/inactive-user-times-type.enum';

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
        if (this.lstGenerales.length < 8) {

            this.lstGenerales.forEach((element, index) => {
                items.push({ ...element, index: (index + 1) });

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
            this.firstElements.push({ column1: first, column2: second });
            this.secondElements = [];
            //console.log("firstElements", this.firstElements);
        } else {


            // tslint:disable-next-line:no-shadowed-variable
            this.lstGenerales.forEach((element, index) => {
                items.push({ ...element, index: (index + 1) });

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
            this.firstElements.push({ column1: first, column2: second });

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
        // 1. Validar entrada
        if (!e || typeof e !== 'object') {
            console.warn('Objeto de entrada inválido:', e);
            return 'SIN NOMBRAMIENTO';
        }

        // 2. Obtener cargo con manejo seguro
        const otro_cargo = e.cargo || '';

        // 3. Validar y parsear resoluciones
        let resoluciones = [];
        try {
            if (e.resoluciones && typeof e.resoluciones === 'string') {
                const parsed = JSON.parse(e.resoluciones);
                resoluciones = Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('Error al parsear resoluciones:', error);
            return 'SIN NOMBRAMIENTO';
        }

        // 4. Filtrar y ordenar con validaciones
        const nmb = (Array.isArray(resoluciones) ? resoluciones : [])
            .filter(res => res && typeof res === 'object' && 'tipo' in res && res.tipo !== 13)
            .sort((a, b) => {
                if (!a || !b) return 0;
                const fechaA = a.fecha || '';
                const fechaB = b.fecha || '';
                if (fechaA > fechaB) return -1;
                if (fechaA < fechaB) return 1;
                return 0;
            });

        // 5. Retornar resultado formateado
        if (nmb.length === 0 || !nmb[0]) {
            return 'SIN NOMBRAMIENTO';
        }

        // 6. Validar campos requeridos
        const primerNmb = nmb[0];
        const asunto = primerNmb.asunto || '';
        const numero = primerNmb.numero || '';
        const fecha = primerNmb.fecha || '';

        return asunto === '' 
            ? '' 
            : `${asunto}<br>RESOL. ${numero}<br>${fecha}<br>${otro_cargo}`;
    }

    filtrarAscenso(e) {
        // 1. Validar entrada
        if (!e || typeof e !== 'object') {
            console.warn('Objeto de entrada inválido:', e);
            return 'SIN RESUELTO';
        }

        // 2. Obtener área de mérito con manejo seguro
        const area = this.getMerito(e.merito || '');

        // 3. Validar y parsear resoluciones
        let resoluciones = [];
        try {
            if (e.resoluciones && typeof e.resoluciones === 'string') {
                const parsed = JSON.parse(e.resoluciones);
                resoluciones = Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('Error al parsear resoluciones:', error);
            return 'SIN RESUELTO';
        }

        // 4. Filtrar y ordenar con validaciones
        const asc = (Array.isArray(resoluciones) ? resoluciones : [])
            .filter(res => res && typeof res === 'object' && 'tipo' in res && res.tipo === 13)
            .sort((a, b) => {
                if (!a || !b) return 0;
                const fechaA = a.fecha || '';
                const fechaB = b.fecha || '';
                if (fechaA > fechaB) return -1;
                if (fechaA < fechaB) return 1;
                return 0;
            });

        // 5. Retornar resultado formateado
        return asc.length > 0 && asc[0]?.numero && asc[0]?.fecha
            ? `RESOL. ${asc[0].numero} <br> ${asc[0].fecha}<br><br> ${area}`
            : 'SIN RESUELTO';
    }

    setDefaultPic(event: any) {
        event.target.src = this.utils.imgNoDisponible;
    }

    getEscudo(comp): string {
        return comp == '%' ? 'mppd.png' : comp + '.jpeg'
    }

    getMerito(merito): string {
        return merito == '' || merito == undefined ? '': merito.replace('/', ' DE ') 
    }

}
