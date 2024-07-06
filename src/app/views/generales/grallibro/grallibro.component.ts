import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDateParserFormatter, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { UtilService } from "src/app/services/util/util.service";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Bold.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-BoldItalic.ttf",
  },
};

@Component({
  selector: "app-grallibro",
  templateUrl: "./grallibro.component.html",
  styleUrls: ["./grallibro.component.scss"],
})
export class GrallibroComponent implements OnInit {
  selected = new FormControl(0);
  componente = "0";
  Componentes = [];
  lstGenerales = [];

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : [];
        this.ConsultarListado();
  }

  ConsultarListado() {
    this.xAPI.funcion = "MPPD_CLibroGenerales";
    this.xAPI.parametros = "";
    this.xAPI.valores = "";
    this.ngxService.startLoader("loader-gennerales");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data);

        this.lstGenerales = data.Cuerpo.length > 0 ? data.Cuerpo : [];
        this.ngxService.stopLoader("loader-gennerales");
      },
      (error) => {
        console.error("Error de conexion a los datos ", error);
      }
    );
  }

  @ViewChild("pdfTable", { static: false }) pdfTable!: ElementRef;

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

  // async generatePDF() {
  //   // this.ConsultarListado();
  //   // Divide la lista de registros en dos mitades
  //   const halfLength = Math.ceil(this.lstGenerales.length / 2);
  //   const lstIzquierda = this.lstGenerales.slice(0, halfLength);
  //   const lstDerecha = this.lstGenerales.slice(halfLength);
  //   console.log(lstIzquierda, "llego la picada");
  //   // Obtén las imágenes en formato base64
  //   const imagePromises = lstIzquierda.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
  //     return imageBase64;
  //   });

  //   const images = await Promise.all(imagePromises);

  //   // Organiza los registros en columnas
  //   const tableBody = [];
  //   for (let i = 0; i < halfLength; i++) {
  //     const leftCedula = lstIzquierda[i].cedula || 'N/A'; // Usa 'N/A' si no hay cédula
  //     const rightCedula = lstDerecha[i].cedula || 'N/A';
  //     tableBody.push([
  //       leftCedula,
  //       { image: images[i], width: 75, height: 75 },
  //       lstIzquierda[i].nombre || 'N/A', // Verificar si nombre está definido
  //       lstIzquierda[i].nombres || 'hola',
  //       lstIzquierda[i].promocion || 'hola',
  //       lstIzquierda[i].situacion || 'hola',
  //       rightCedula,
  //       { image: images[i + halfLength], width: 75, height: 75 },
  //       lstDerecha[i].nombre || 'N/A', // Verificar si nombre está definido
  //       lstDerecha[i].nombres || 'hola',
  //       lstDerecha[i].promocion || 'hola',
  //       lstDerecha[i].situacion || 'hola',
  //     ]);
  //   }
  //   console.log("llego despues del push");
  //   const docDefinition = {
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
  //           body: [
  //             ["NRO", "FOTO", "GDO", "NOMBRE Y APELLIDOS", "ASCENSO", "CARGO"],
  //             ...tableBody,
  //           ],
  //         },
  //       },
  //     ],
  //   };
  //   console.log("llego despues del definicion");
  //   pdfMake.createPdf(docDefinition).download("registro.pdf");
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
/////////////////////////////////////////////////////
  // async generatePDF() {
  //   // Obtén las imágenes en formato base64
  //   const imagePromises = this.lstGenerales.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
  //     return imageBase64;
  //   });
  
  //   const images = await Promise.all(imagePromises);
  
  //   // Organiza los registros en columnas
  //   const tableBody = this.lstGenerales.map((e, index) => [
  //     index,
  //     // e.cedula,
  //     { image: images[index], width: 75, height: 75 }, // Utiliza el contenido base64 de la imagen
  //     e.nombre,
  //     e.nombres,
  //     e.promocion,
  //     e.situacion,
  //     e.cedula, // Agrega la cédula de la derecha
  //     { image: images[index], width: 75, height: 75 }, // Utiliza la misma imagen para la cédula de la derecha
  //     e.nombre, // Agrega el nombre de la derecha
  //     e.nombres,
  //     e.promocion,
  //     e.situacion,
  //   ]);
  
  //   const docDefinition = {
  //     pageOrientation: 'landscape',
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  //           body: [
  //             // Cabecera con color de fondo rojo
  //             [
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //             ],
  //             ...tableBody,
  //           ],
  //         },
  //       },
  //     ],
  //   };
  
  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }
  
  // async generatePDF() {
  //   // Obtén las imágenes en formato base64
  //   const imagePromises = this.lstGenerales.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
  //     return imageBase64;
  //   });
  
  //   const images = await Promise.all(imagePromises);
  
  //   // Divide los registros en dos mitades
  //   const halfLength = Math.ceil(this.lstGenerales.length / 2);
  //   const lstIzquierda = this.lstGenerales.slice(0, halfLength);
  //   const lstDerecha = this.lstGenerales.slice(halfLength);
  //   console.log("tamano izquierdo: ", lstIzquierda.length)
  //   console.log("tamano izquierdo: ", lstIzquierda)
  //   console.log("tamano derecho : ", lstDerecha.length)
  //   // Organiza los registros en columnas
  //   const tableBody = [];
  //   let index = 1;

  //   for (let i = 0; i < 95 ; i++) {
  //     tableBody.push([
  //       index,
  //       { image: images[i], width: 75, height: 75 },
  //       this.getSafeNombre(lstIzquierda[i].nombre),
  //       this.getSafeNombre(lstIzquierda[i].nombres),
  //       lstIzquierda[i].promocion,
  //       lstIzquierda[i].situacion,
  //       index + halfLength,
  //       { image: images[i + halfLength], width: 75, height: 75 },
  //       this.getSafeNombre(lstDerecha[i].nombre),
  //       this.getSafeNombre(lstDerecha[i].nombres),
  //       lstDerecha[i].promocion,
  //       lstDerecha[i].situacion,
  //     ]);
  //     index++;
  //   }
  
  //   const docDefinition = {
  //     pageOrientation: 'landscape',
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  //           body: [
  //             // Cabecera con color de fondo rojo
  //             [
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //             ],
  //             ...tableBody,
  //           ],
  //         },
  //       },
  //     ],
  //   };
  
  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }

  // async generatePDF() {
  //   // Obtain images in base64 format
  //   const imagePromises = this.lstGenerales.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
  //     return imageBase64;
  //   });
  
  //   const images = await Promise.all(imagePromises);
  
  //   // Divide records into two halves
  //   const halfLength = Math.ceil(this.lstGenerales.length / 2);
  //   const lstIzquierda = this.lstGenerales.slice(0, halfLength);
  //   const lstDerecha = this.lstGenerales.slice(halfLength);
  
  //   // Initialize variables for pagination
  //   let currentPage = 1;
  //   let index = 1;
  //   let tableBody = [];
  //   // Create the overall PDF document definition
  //   const docDefinition = {
  //     pageOrientation: 'landscape',
  //     content: [],
  //   };
  
  //   // Iterate through records and create pages as needed
  //   for (let i = 0; i < 95; i++) {
  //     // Check if a new page is required
  //     if (i === halfLength || i === this.lstGenerales.length) {
  //       // Create a new page definition for the next set of records
  //       const pageDefinition = {
  //         pageOrientation: 'landscape',
  //         content: [
  //           {
  //             table: {
  //               headerRows: 1,
  //               widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  //               body: [
  //                 // Header row with red background color
  //                 [
  //                   { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //                   { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //                 ],
  //                 // Add table rows based on the current page
  //                 ...tableBody,
  //               ],
  //             },
  //           },
  //         ],
  //       };
  
  //       // Add the page definition to the overall PDF document
  //       docDefinition.content.push(pageDefinition);
  
  //       // Reset table body and index for the next page
  //       tableBody = [];
  //       index = 1;
  //       currentPage++;
  //     }
  
  //     // Add the current record to the table body for the current page
  //     tableBody.push([
  //       index,
  //       { image: images[i], width: 75, height: 75 },
  //       this.getSafeNombre(lstIzquierda[i].nombre),
  //       this.getSafeNombre(lstIzquierda[i].nombres),
  //       lstIzquierda[i].promocion,
  //       lstIzquierda[i].situacion,
  //       index + halfLength,
  //       { image: images[i + halfLength], width: 75, height: 75 },
  //       this.getSafeNombre(lstDerecha[i].nombre),
  //       this.getSafeNombre(lstDerecha[i].nombres),
  //       lstDerecha[i].promocion,
  //       lstDerecha[i].situacion,
  //     ]);
  //     index++;
  //   }
  
  //   // Generate the PDF document
  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }

  // async generatePDF() {
  //   // 1. Obtención de imágenes en formato base64
  //   const imagePromises = this.lstGenerales.map(async (e) => {
  //     const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
  //     return imageBase64;
  //   });
  
  //   const images = await Promise.all(imagePromises);
  
  //   // 2. Configuración de la organización de la tabla
  //   const pageSize = 8; // Tamaño de página (8 registros en total)
  //   const totalPages = Math.ceil(this.lstGenerales.length / pageSize); // Número total de páginas
  
  //   const tableBody = []; // Array to store the table rows
  
  //   // 3. Organización de registros en páginas y filas
  //   for (let page = 0; page < totalPages; page++) {
  //     const startIndex = page * pageSize;
  //     const endIndex = Math.min(startIndex + pageSize, this.lstGenerales.length);
  
  //     for (let i = startIndex; i < endIndex; i += 2) {
  //       const leftRecord = this.lstGenerales[i];
  //       const rightRecord = (i + 1 < endIndex) ? this.lstGenerales[i + 1] : null;
  
  //       tableBody.push([
  //         i + 1, // Número de registro
  //         { image: images[i], width: 75, height: 75 }, // Imagen del registro
  //         this.getSafeNombre(leftRecord?.nombre), // Nombre del registro izquierdo (with null check)
  //         this.getSafeNombre(leftRecord?.nombres), // Nombres del registro izquierdo (with null check)
  //         leftRecord?.promocion, // Promoción del registro izquierdo
  //         leftRecord?.situacion, // Situación del registro izquierdo
  //         i + 2, // Número de registro siguiente
  //         (rightRecord) ? { image: images[i + 1], width: 75, height: 75 } : null, // Imagen del registro derecho (with null check)
  //         (rightRecord) ? this.getSafeNombre(rightRecord.nombre) : null, // Nombre del registro derecho (with null check)
  //         (rightRecord) ? this.getSafeNombre(rightRecord.nombres) : null, // Nombres del registro derecho (with null check)
  //         (rightRecord) ? rightRecord.promocion : null, // Promoción del registro derecho
  //         (rightRecord) ? rightRecord.situacion : null, // Situación del registro derecho
  //       ]);
  //     }
  //   }
  
  //   // 4. Definición del PDF
  //   const docDefinition = {
  //     pageOrientation: 'landscape', // Orientación del PDF (horizontal)
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1, // Número de filas de encabezado
  //           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'], // Ancho de las columnas
  //           body: [
  //             // Cabecera con color de fondo rojo
  //             [
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' }, // GDO
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' }, // Ascenso
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' }, // Cargo
  //               { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro siguiente
  //               { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
  //               { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' }, // GDO
  //               { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
  //               { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
  //               { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
  //             ],
  //             ...tableBody,
  //           ],
  //         },
  //       },
  //     ],
  //   };
  
  //   // 5. Generación y descarga del PDF
  //   pdfMake.createPdf(docDefinition).download('registro.pdf');
  // }
  

  async generatePDF() {
    // 1. Obtención de imágenes en formato base64
    const imagePromises = this.lstGenerales.map(async (e) => {
      const imageBase64 = await this.getImageBase64(`assets/img/foto.jpeg`);
      return imageBase64;
    });
  
    const images = await Promise.all(imagePromises);
  
    // 2. Configuración de la organización de la tabla
    const pageSize = 4; // Tamaño de página (4 registros por lado)
    const totalPages = Math.ceil(this.lstGenerales.length / pageSize); // Número total de páginas
  
    const tableBody = []; // Array to store the table rows
  
    // 3. Organización de registros en páginas y filas
    for (let page = 0; page < totalPages; page++) {
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, this.lstGenerales.length);
  
      let leftRecordIndex = startIndex;
      let rightRecordIndex = startIndex + 1;
  
      while (leftRecordIndex < endIndex && rightRecordIndex < endIndex) {
        const leftRecord = this.lstGenerales[leftRecordIndex];
        const rightRecord = (rightRecordIndex < endIndex) ? this.lstGenerales[rightRecordIndex] : null;
  
        tableBody.push([
          leftRecordIndex + 1, // Número de registro
          { image: images[leftRecordIndex], width: 75, height: 75 }, // Imagen del registro
          this.getSafeNombre(leftRecord?.nombre), // Nombre del registro izquierdo (with null check)
          this.getSafeNombre(leftRecord?.nombres), // Nombres del registro izquierdo (with null check)
          leftRecord?.promocion, // Promoción del registro izquierdo
          leftRecord?.situacion, // Situación del registro izquierdo
          rightRecordIndex + 1, // Número de registro siguiente
          (rightRecord) ? { image: images[rightRecordIndex], width: 75, height: 75 } : null, // Imagen del registro derecho (with null check)
          (rightRecord) ? this.getSafeNombre(rightRecord.nombre) : null, // Nombre del registro derecho (with null check)
          (rightRecord) ? this.getSafeNombre(rightRecord.nombres) : null, // Nombres del registro derecho (with null check)
          (rightRecord) ? rightRecord.promocion : null, // Promoción del registro derecho
          (rightRecord) ? rightRecord.situacion : null, // Situación del registro derecho
        ]);
  
        leftRecordIndex += 2;
        rightRecordIndex += 2;
      }
  
      // Si quedan registros en la página actual, pero no hay un par adecuado, agregue los registros restantes en la columna derecha.
      while (rightRecordIndex < endIndex) {
        const rightRecord = this.lstGenerales[rightRecordIndex];
  
        tableBody.push([
          null, // No hay registro anterior
          null, // No hay imagen del registro anterior
          null, // No hay nombre del registro anterior
          null, // No hay nombres del registro anterior
          null, // No hay promoción del registro anterior
          null, // No hay situación del registro anterior
          rightRecordIndex + 1, // Número de registro
          { image: images[rightRecordIndex], width: 75, height: 75 }, // Imagen del registro
          this.getSafeNombre(rightRecord.nombre), // Nombre del registro derecho (with null check)
          this.getSafeNombre(rightRecord.nombres), // Nombres del registro derecho (with null check)
          rightRecord.promocion, // Promoción del registro derecho
          rightRecord.situacion, // Situación del registro derecho
        ]);
  
        rightRecordIndex++;
      }
    }
  
    // 4. Definición del PDF
    const docDefinition = {
      pageOrientation: 'landscape', // Orientación del PDF (horizontal)
      content: [
        {
          table: {
            headerRows: 1, // Número de filas de encabezado
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'], // Ancho de las columnas
            body: [
              // Cabecera con color de fondo rojo
              [
                { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro
                { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
                { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' }, // GDO
                { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
                { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' }, // Ascenso
                { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' }, // Cargo
                { text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro siguiente
                { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
                { text: 'GDO', fillColor: '#941b0b', color: '#ffffff'}, // GDO
                { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
                { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' },
                { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' },
              ],
              ...tableBody,
            ],
          },
        },
      ],
    };
  
    // 5. Generación y descarga del PDF
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
  
  getSafeNombre(persona : string) {
    if (persona === null || persona === undefined || persona === null || persona === "null")  {
      // Handle null value here (e.g., return default text)
      return "A";
    } else {
      return persona;
    }
  }
  
}
