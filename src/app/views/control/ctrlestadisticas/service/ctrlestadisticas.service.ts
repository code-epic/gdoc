import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Injectable({
    providedIn: 'root',
})
export class CtrlEstadisticasService {
    public xAPI: IAPICore = {
        funcion: '',
        parametros: '',
    };

    constructor(private apiService: ApiService) { }

    getAllAreasList() :Observable<any>{
        this.xAPI.funcion = 'WKF_CEstados';
        this.xAPI.parametros = '%';
        this.xAPI.valores = '';
        return this.apiService.Ejecutar(this.xAPI);
    }

    getStaticsPanel(parameter: any) {
        this.xAPI.funcion = 'WKF_CEstatusAlertasCantidad';
        this.xAPI.parametros = parameter;
        return this.apiService.Ejecutar(this.xAPI);
    }

    private getDataByMonthYears(monthNumber: any[]) {
        let cuerpo = [];
        monthNumber.forEach((e, i) => {
            cuerpo.push(this.getObjectWeekByMonthYears('PROCESADOS', 1, e, 'rgb(66,220,189, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PENDIENTES', 1, e, 'rgb(245,54,92, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('VENCIDOS', 1, e, 'rgb(137,101,224, 0.4)'));
        });
        return cuerpo;
    }

    //endpoint here por mes
    public getDataByMonth(monthNumber: any[]) {
        return of(
            {
                "Cabecera": [
                    {
                        "nombre": "id",
                        "tipo": "number"
                    },
                ],
                "Cuerpo": this.getDataByMonthYears(monthNumber),
                "Pie": null
            }
        );
    }

    //endpoint here por semanas
    public getDataByWeek(monthNumber: any[]) {
        return of(
            {
                "Cabecera": [
                    {
                        "nombre": "id",
                        "tipo": "number"
                    },
                ],
                "Cuerpo": this.getDataWeekByMonthYears(monthNumber),
                "Pie": null
            }
        );
    }

    private getDataWeekByMonthYears(monthNumber: any[]) {
        let cuerpo = [];
        monthNumber.forEach((e, i) => {
            cuerpo.push(this.getObjectWeekByMonthYears('PROCESADOS', 1, e, 'rgb(66,220,189, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PENDIENTES', 1, e, 'rgb(245,54,92, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('VENCIDOS', 1, e, 'rgb(137,101,224, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PROCESADOS', 2, e, 'rgb(66,220,189, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PENDIENTES', 2, e, 'rgb(245,54,92, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('VENCIDOS', 2, e, 'rgb(137,101,224, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PROCESADOS', 3, e, 'rgb(66,220,189, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PENDIENTES', 3, e, 'rgb(245,54,92, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('VENCIDOS', 3, e, 'rgb(137,101,224, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PROCESADOS', 4, e, 'rgb(66,220,189, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('PENDIENTES', 4, e, 'rgb(245,54,92, 0.4)'));
            cuerpo.push(this.getObjectWeekByMonthYears('VENCIDOS', 4, e, 'rgb(137,101,224, 0.4)'));
        });
        return cuerpo;
    }

    private getObjectWeekByMonthYears(id: string, week: number, yearsMonth: string, color:string) {
        return {
            id: id,
            week: week,
            yearsMonth: yearsMonth,
            cantidad: Math.round(Math.random() * 100),
            backgroundColor: color,
            borderColor: color
        }
    }
}