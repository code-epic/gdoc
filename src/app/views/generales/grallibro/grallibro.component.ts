import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import {TableGrallibroModalComponent} from './modal/table-grallibro-modal/table-grallibro-modal.component';
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
  selector: 'app-grallibro',
  templateUrl: './grallibro.component.html',
  styleUrls: ['./grallibro.component.scss'],
})
export class GrallibroComponent implements OnInit {
  selected = new FormControl(0);
  componente = '0';
  Componentes = [];
  lstGenerales = [];

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  };


  public segmentoA = [{ text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro
  { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
  { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' }, // GDO
  { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
  { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' }, // Ascenso
  { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' }, // Cargo
  ];

  public segmentoB = [{ text: 'Nº', fillColor: '#941b0b', color: '#ffffff' }, // Número de registro
    { text: 'FOTO', fillColor: '#941b0b', color: '#ffffff' }, // Imagen
    { text: 'GDO', fillColor: '#941b0b', color: '#ffffff' }, // GDO
    { text: 'NOMBRE Y APELLIDOS', fillColor: '#941b0b', color: '#ffffff' }, // Nombre y apellidos
    { text: 'ASCENSO', fillColor: '#941b0b', color: '#ffffff' }, // Ascenso
    { text: 'CARGO', fillColor: '#941b0b', color: '#ffffff' }, // Cargo
    ];

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {

    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : [];

    const ss = sessionStorage.getItem('MPPD_CLibroGenerales');

    this.lstGenerales = ss != undefined ? JSON.parse(ss) : [];
  }

  ConsultarListado() {
    this.xAPI.funcion = 'MPPD_CLibroGenerales';
    this.xAPI.parametros = '';
    this.xAPI.valores = '';

    if (this.lstGenerales.length > 0) {
      this.ngxService.stopLoader('loader-gennerales');
      this.openDialog();
      return;
    }
    this.ngxService.startLoader('loader-gennerales');
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        sessionStorage.setItem('MPPD_CLibroGenerales', JSON.stringify(data.Cuerpo));
        this.lstGenerales = await data.Cuerpo.length > 0 ? data.Cuerpo : [];
        this.ngxService.stopLoader('loader-gennerales');
        this.openDialog();

      },
      (error) => {
        console.error('Error de conexion a los datos ', error);
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(TableGrallibroModalComponent, {
      width: '100%',
      height: 'auto',
      data: {
        componente: this.componente,
        lstGenerales: this.lstGenerales,
        lstQa: this.Componentes
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  async generatePDF() {
   
    // const encabezadoPersonalizado = [
    //   { text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA', alignment: 'left', fontSize: 17 , style: 'header'},
    //   { text: 'MINISTERIO DEL PODER POPULAR PARA LA DEFENSA', alignment: 'left', fontSize: 17 , style: 'subheader'}, 
    //   { text: 'EJERCITO BOLIVARIANO', alignment: 'left', fontSize: 20 , style: 'subheader'}, 
    //   { text: 'RELACION DE OFICIALES GENERALES', alignment: 'center', fontSize: 17 , style: 'subheader', color : 'red'}, 
    //     ];

    // var pruebaimagen = { image: await this.getBase64ImageFromURL( 'assets/img/brand/android-icon-192x192.png'),  width: 150, margin: [30, 5, 0, 10],}
      
        const encabezadoPersonalizado = {
          columns : [ 
            { image: await this.getBase64ImageFromURL( 'assets/img/brand/android-icon-192x192.png'),  width: 60, height : 60},
            {
              stack : [
                {
                  columns :[
                  { text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA', alignment: 'left', fontSize: 17 , style: 'header', height: 25 }, // Aumentar la altura
                    ]
              },
              {
              columns :[
                { text: 'MINISTERIO DEL PODER POPULAR PARA LA DEFENSA', alignment: 'left', fontSize: 17 , style: 'subheader', height: 25 }, // Aumentar la altura
              ]
              },
              {
              columns :[
                { text: 'EJERCITO BOLIVARIANO', alignment: 'left', fontSize: 20 , style: 'subheader', height: 25 }, // Aumentar la altura
              ]
              },
              {
              columns :[
                { text: 'RELACION DE OFICIALES GENERALES', alignment: 'center', fontSize: 17 , style: 'subheader', color : 'red', height: 25 }
              ]
              },
              ],
              
            }
          ],
        }
        

    const tableBodyA = []; // Array to store the table rows
    const tableBodyB = []; // Array to store the table rows
    let i = 1;
    let pos = 1;
    // 3. Organización de registros en páginas y filas
    await this.lstGenerales.map(e => {

      // console.log(e.cedula)
      // console.log(images[i-1])
      let img = ''; // images[i]==undefined? this.utilService.imgNoDisponible:
      img = this.utilService.imgNoDisponible;
      // if (images[i]!=undefined ) {
      //   console.log("texto encontrado")
      //   img = images[i]
      // }
      if ( i < 5 ) {
        const valor = [
          `${pos}`,
         { image : img, width: 82},
          this.getSafeNombre(e.nombre),
          this.getSafeNombre(e.nombres) + '\n V-' + e.cedula,
          'B',
          'A',
        ];
        tableBodyA.push(valor);
      } else if ( i < 11 ) {

        const valor = [
          `${pos}`,
          { image : img, width: 82},
          this.getSafeNombre(e.nombre),
          this.getSafeNombre(e.nombres) + '\n V-' + e.cedula,
          'B',
          'A',
        ];
        tableBodyB.push(valor);
      }
      i++;
      if (i == 10 ) { i = 1; }
      pos++;

    });


    // 4. Definición del PDF
    const docDefinition = {
      pageMargins: [1, 40, 1, 1],
      pageOrientation: 'landscape', // Orientación del PDF (horizontal)
      //  header: encabezadoPersonalizado,
      styles: {
        // header: {
        //   fontSize: 15,
        //   bold: false
        // },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      },
      content: [
           encabezadoPersonalizado,
        {
          columns: [
            {
              width: '50%',
              height: 'auto',
              stack: [
                {
                  //  encabezadoPersonalizado,
                  table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                      this.segmentoA,
                      ...tableBodyA
                    ]
                  }
                }
              ]
            },
            {
              width: '50%',
              height: 'auto',
              stack: [
                {
                  // encabezadoPersonalizado,
                  table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                      this.segmentoB,
                      ...tableBodyB
                   ]
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    this.ngxService.stopLoader('loader-gennerales');

    // 5. Generación y descarga del PDF
    pdfMake.createPdf(docDefinition).download('registro.pdf');
    // var blob = new Blob([document.getElementById('pdfTable').innerHTML])


  }

//   async generatePDF() {
//     const docDefinition = {
//         content: [
//             // Contenido del documento
//             'Aquí va el contenido del PDF...',
//         ],
//         header: function(currentPage, pageCount, pageSize) {
//   return {
//     table: {
//       widths: ['*'],
//       body: [
//         ['Imagen de la empresa'], // Primera línea
//         ['Nombre de la empresa'], // Segunda línea
//         ['Contacto de la empresa'], // Tercera línea
//         ['Correo electrónico de la empresa'] // Cuarta línea
//       ]
//     },
//     layout: 'noBorders'
//   };
// },

//     };

//     // Genera el PDF
//     const pdfDoc = pdfMake.createPdf(docDefinition);
//     pdfDoc.download('mi_reporte.pdf');
// }



  async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(this.utilService.imgNoDisponible);
      };
      reader.readAsDataURL(blob);
    });
  }
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });

   
  }


  getSafeNombre(persona: string) {

    return persona == undefined ? '' : persona;

  }



}
