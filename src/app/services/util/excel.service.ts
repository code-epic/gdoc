
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})


export class ExcelService {
    constructor() {
        console.log('ExcelService constructor');
    }
    exportToExcel(data: any[], fileName: string): void {
        // Crear hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Crear libro de trabajo
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        // Generar archivo Excel
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Guardar archivo
        this.saveAsExcelFile(excelBuffer, fileName);
    }

    exportToCsv(data: any[], fileName: string): void {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const csvOutput: string = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob(["\ufeff" + csvOutput], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, fileName + "_export_" + new Date().getTime() + ".csv");
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }
}