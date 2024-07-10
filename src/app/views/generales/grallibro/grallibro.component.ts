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


  @ViewChild("pdfTable", { static: false }) pdfTable!: ElementRef;

  constructor(
    private apiService: ApiService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : [];

    let ss = sessionStorage.getItem('MPPD_CLibroGenerales');

    this.lstGenerales = ss != undefined ? JSON.parse(ss) : []
  }

  ConsultarListado() {
    this.xAPI.funcion = "MPPD_CLibroGenerales";
    this.xAPI.parametros = "";
    this.xAPI.valores = "";
    this.ngxService.startLoader("loader-gennerales");
    if (this.lstGenerales.length > 0) {
      this.generatePDF()
      return
    }
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        sessionStorage.setItem('MPPD_CLibroGenerales', JSON.stringify(data.Cuerpo))
        this.lstGenerales = await data.Cuerpo.length > 0 ? data.Cuerpo : [];
        this.generatePDF()

      },
      (error) => {
        console.error("Error de conexion a los datos ", error);
      }
    );
  }




  async generatePDF() {

    // 1. Obtención de imágenes en formato base64
    // const imagePromises = this.lstGenerales.map(async (e) => {
    //   const imageBase64 = await this.getBase64ImageFromURL(`assets/img/${e.cedula}.jpg`);
    //   return imageBase64;
    // });

    // const images = await Promise.all(imagePromises);

    // const itemPorPagina = 8; // Tamaño de página (4 registros por lado 8)
    // const totalPages = this.lstGenerales.length / itemPorPagina // Número total de páginas

    let tableBodyA = []; // Array to store the table rows
    let tableBodyB = []; // Array to store the table rows
    let i = 1
    let pos = 1
    // 3. Organización de registros en páginas y filas
    await this.lstGenerales.map(e => {

      // console.log(e.cedula)
      // console.log(images[i-1])
      let img = "" //images[i]==undefined? this.utilService.imgNoDisponible:
      img = this.utilService.imgNoDisponible
      // if (images[i]!=undefined ) {
      //   console.log("texto encontrado")
      //   img = images[i]
      // }
      if ( i < 5 ) {
        let valor =[ 
          `${pos}`,
         { image : img, width: 82}, 
          this.getSafeNombre(e.nombre), 
          this.getSafeNombre(e.nombres) + '\n V-' + e.cedula, 
          'B', 
          'A', 
        ]
        tableBodyA.push(valor)
      }else if ( i < 11 ){
        
        let valor =[
          `${pos}`,
          { image : img, width: 82},  
          this.getSafeNombre(e.nombre), 
          this.getSafeNombre(e.nombres) + '\n V-' + e.cedula, 
          'B', 
          'A', 
        ]
        tableBodyB.push(valor)
      } 
      i++
      if (i == 10 ) i=1
      pos++

    });


    // console.log(...tableBodyA)


    // 4. Definición del PDF
    const docDefinition = {
      pageOrientation: 'landscape', // Orientación del PDF (horizontal)
      header: { text: 'RELACION DE OFICIALES GENERALES', style: 'header' },
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      },
      content: [
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  table: {
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
              stack: [
                {
                  table: {
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
    this.ngxService.stopLoader("loader-gennerales");

    // 5. Generación y descarga del PDF
    pdfMake.createPdf(docDefinition).download('registro.pdf');
    // var blob = new Blob([document.getElementById('pdfTable').innerHTML])


  }






  async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      }
      reader.onerror = () => {
        reject(this.utilService.imgNoDisponible)
      }
      reader.readAsDataURL(blob);
    });
  }

  getSafeNombre(persona: string) {

    return persona == undefined ? '' : persona;

  }



}
