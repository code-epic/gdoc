import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf',
  },
};
@Component({
  selector: 'app-rsgenerales',
  templateUrl: './rsgenerales.component.html',
  styleUrls: ['./rsgenerales.component.scss']
})
export class RsgeneralesComponent implements OnInit {

  

  selected = new FormControl(0);
  componente = '0'
  Componentes = [] 
  lstGenerales = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.Componentes =
    sessionStorage.getItem("MPPD_CComponente") != undefined
      ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
      : [];
  }

  ConsultarListado(){
    this.xAPI.funcion = 'MPPD_CLibroGenerales'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.ngxService.startLoader("loader-gennerales");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       
        console.log(data)
        
        this.lstGenerales = data.Cuerpo.length > 0? data.Cuerpo: []
        this.ngxService.stopLoader("loader-gennerales");

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )
  }

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  

  // generatePDF() {
  //   console.log(this.lstGenerales.length, "Cantidad")
  //   const docDefinition = {
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Nº', 'GDO', 'NOMBRE Y APELLIDOS', 'ASCENSO', 'CARGO'],
  //             ...this.lstGenerales.map((e) => [
  //                e.cedula,
  //               // e.foto, // Asegúrate de obtener la URL correcta de la foto
  //               { image: "https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/{{ e.cedula }}/foto.jpg", width: 75, height: 75 },
  //               e.nombre,
  //               e.nombres,
  //               e.promocion,
  //               e.situacion,
  //             ]),
  //           ],
  //         },
  //       },
  //     ],
  //   };

  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }


  // async generatePDF() {
  //   const imagePromises = this.lstGenerales.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(
  //       `assets/img/foto.jpeg`
  //     );
  //     return imageBase64;
  //   });
  
  //   const images = await Promise.all(imagePromises);
  
  //   const tableBody = this.lstGenerales.map((e, index) => [
  //     e.cedula,
  //     { image: images[index], width: 75, height: 75 }, // Utiliza el contenido base64 de la imagen
  //     e.nombre,
  //     e.nombres,
  //     e.promocion,
  //     e.situacion,
  //   ]);
  
  //   const docDefinition = {
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Nº', 'FOTO', 'GDO', 'NOMBRE Y APELLIDOS', 'ASCENSO', 'CARGO'],
  //             ...tableBody,
  //           ],
  //         },
  //       },
  //     ],
  //   };
  
  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }
  
  // async getImageBase64(url: string): Promise<string> {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       resolve(reader.result as string);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // }

  async generatePDF() {
    // Divide la lista de registros en dos mitades
    const halfLength = Math.ceil(this.lstGenerales.length / 2);
    const lstIzquierda = this.lstGenerales.slice(0, halfLength);
    const lstDerecha = this.lstGenerales.slice(halfLength);
  console.log(lstIzquierda,"llego la picada")
    // Obtén las imágenes en formato base64
    const imagePromises = lstIzquierda.map(async (e) => {
      const imageBase64 = await this.getImageBase64(
        `assets/img/foto.jpeg`
      );
      return imageBase64;
    });
  
    const images = await Promise.all(imagePromises);
  
    // Organiza los registros en columnas
    const tableBody = [];
    for (let i = 0; i < halfLength; i++) {
      const leftCedula = lstIzquierda[i]?.cedula || 'N/A'; // Usa 'N/A' si no hay cédula
      const rightCedula = lstDerecha[i]?.cedula || 'N/A';
      tableBody.push([
        leftCedula,
        { image: images[i], width: 75, height: 75 },
        lstIzquierda[i]?.nombre || 'hola',
        lstIzquierda[i]?.nombres || 'hola',
        lstIzquierda[i]?.promocion || 'hola',
        lstIzquierda[i]?.situacion || 'hola',
        rightCedula,
        { image: images[i + halfLength], width: 75, height: 75 },
        lstDerecha[i]?.nombre || 'hola',
        lstDerecha[i]?.nombres || 'hola',
        lstDerecha[i]?.promocion || 'hola',
        lstDerecha[i]?.situacion || 'hola',
      ]);
    }
  console.log("llego despues del push")
    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['NRO', 'FOTO', 'GDO', 'NOMBRE Y APELLIDOS', 'ASCENSO', 'CARGO'],
              ...tableBody,
            ],
          },
        },
      ],
    };
    console.log("llego despues del definicion")
    pdfMake.createPdf(docDefinition).download('registro.pdf');
  }
  
  async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
  
  

  
}


