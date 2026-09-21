import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { PageEvent } from "@angular/material/paginator";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { ExcelService } from "src/app/services/util/excel.service";
import { UtilService } from "src/app/services/util/util.service";
import { environment } from "src/environments/environment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-rsreportes",
  templateUrl: "./rsreportes.component.html",
  styleUrls: ["./rsreportes.component.scss"],
})
export class RsreportesComponent implements OnInit, OnDestroy {
  titulo: string = "Reportes";
  bmenu = true;
  tipoReporte: number = 0; // 1: Administración, 2: Cumpleaños, 3: Resoluciones Firmadas
  lst: any[] = [];
  xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  // Variables para Cumpleañeros
  public fotosCumpleanios: { [cedula: string]: SafeUrl | string } = {};
  public loadingFotos: { [cedula: string]: boolean } = {};
  private rawUrlsMap: { [cedula: string]: string } = {};
  public isBirthdayReport: boolean = false;

  // Variables para Resoluciones Firmadas
  public lstFirmadas: any[] = [];
  public lstFirmadasOriginal: any[] = [];
  public tiposResolucion: string[] = [];

  // Filtros de fecha (por defecto año en curso)
  public fechaDesde: string = "";
  public fechaHasta: string = "";

  // Filtros de texto
  public filtroAsunto: string = "";
  public filtroNumero: string = "";
  public filtroTipo: string = "";

  // Ordenamiento de columnas en Resoluciones Firmadas
  public ordenColumna: string = "fecha"; // 'asunto' | 'numero' | 'fecha' | 'tipo'
  public ordenDireccion: "asc" | "desc" = "desc";

  // Paginación para Resoluciones Firmadas
  public pageSize: number = 25;
  public pageIndex: number = 0;
  public pageSizeOptions: number[] = [10, 25, 50, 100];

  // Control de streaming
  public isStreaming: boolean = false;
  public streamAbortController: AbortController | null = null;

  constructor(
    private excelService: ExcelService,
    private ngxService: NgxUiLoaderService,
    private utilService: UtilService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    this.fechaDesde = `${anioActual}-01-01`;
    this.fechaHasta = `${anioActual}-12-31`;

    this.utilService.onChange$.subscribe((e) => {
      this.bmenu = e;
    });
  }

  historyBack() {
    window.history.back();
  }

  /**
   * Cambiar entre los tipos de reportes
   * 1: Administración Pública
   * 2: Cumpleaños
   * 3: Resoluciones Firmadas
   */
  cambiarFormulario(n: number) {
    this.bmenu = false;
    this.tipoReporte = n;
    this.lst = [];
    this.lstFirmadas = [];
    this.lstFirmadasOriginal = [];

    switch (n) {
      case 1:
        this.isBirthdayReport = false;
        this.titulo = "Administración Pública";
        this.consultarAdministracion();
        break;
      case 2:
        this.isBirthdayReport = true;
        this.titulo = "Cumpleañeros";
        this.consultarCumpleanios();
        break;
      case 3:
        this.isBirthdayReport = false;
        this.titulo = "Resoluciones Firmadas";
        this.pageIndex = 0;
        this.consultarResolucionesFirmadas();
        break;
    }
  }

  volver() {
    this.bmenu = true;
    this.tipoReporte = 0;
    this.titulo = "Reportes";
  }

  // ==========================================
  // REPORTE 1: ADMINISTRACIÓN PÚBLICA
  // ==========================================
  consultarAdministracion() {
    this.ngxService.startLoader("lbuscar");
    this.xAPI.funcion =
      environment.funcion?.CONSULTAR_ADMINISTRACION ||
      "MPPD_CNominaAdministrativa";
    this.xAPI.parametros = "";
    this.xAPI.valores = "";

    console.log("Invocando API Administración:", this.xAPI);

    this.apiService.Ejecutar(this.xAPI).subscribe({
      next: (data) => {
        console.log("Respuesta Administración:", data);
        this.lst = data?.Cuerpo || [];
        this.ngxService.stopLoader("lbuscar");
      },
      error: (error) => {
        console.error("Error al consultar Administración:", error);
        this.ngxService.stopLoader("lbuscar");
      },
    });
  }

  // ==========================================
  // REPORTE 2: CUMPLEAÑOS
  // ==========================================
  consultarCumpleanios() {
    this.ngxService.startLoader("lbuscar");
    this.xAPI.funcion =
      environment.funcion?.CONSULTAR_CUMPLEANIOS || "MPPD_CCumpleanios";
    this.xAPI.parametros = "";
    this.xAPI.valores = "";

    console.log("Invocando API Cumpleaños:", this.xAPI);

    this.apiService.Ejecutar(this.xAPI).subscribe({
      next: (data) => {
        console.log("Respuesta Cumpleaños:", data);
        this.lst = data?.Cuerpo || [];
        this.ngxService.stopLoader("lbuscar");
        this.loadPhotosForBirthdays();
      },
      error: (error) => {
        console.error("Error al consultar Cumpleaños:", error);
        this.ngxService.stopLoader("lbuscar");
      },
    });
  }

  loadPhotosForBirthdays() {
    this.lst.forEach((militar) => {
      const cedula = militar.cedula;
      if (cedula && !this.fotosCumpleanios[cedula]) {
        this.getPhotoId(cedula);
      }
    });
  }

  getPhotoId(cedula: string) {
    if (cedula && cedula.toString().trim() !== "") {
      this.loadingFotos[cedula] = true;
      const payload = {
        ruta: "img/temp/" + cedula + "/",
        archivo: "foto.jpg",
      };
      this.apiService.postBlob("federate/sssifanb/dwscdn", payload).subscribe({
        next: (data: Blob) => {
          this.loadingFotos[cedula] = false;
          if (data && data.size > 0) {
            if (this.rawUrlsMap[cedula]) {
              URL.revokeObjectURL(this.rawUrlsMap[cedula]);
            }
            const objectUrl = URL.createObjectURL(data);
            this.rawUrlsMap[cedula] = objectUrl;
            this.fotosCumpleanios[cedula] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          } else {
            this.fotosCumpleanios[cedula] = "";
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loadingFotos[cedula] = false;
          console.error("Error al cargar la foto para " + cedula + ":", error);
          this.fotosCumpleanios[cedula] = "";
          this.cdr.detectChanges();
        },
      });
    }
  }

  obtenerFoto(cedula: string): SafeUrl | string {
    if (this.fotosCumpleanios[cedula]) {
      return this.fotosCumpleanios[cedula];
    }
    return "https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/" + cedula + "/foto.jpg";
  }

  // ==========================================
  // REPORTE 3: RESOLUCIONES FIRMADAS
  // ==========================================
  async consultarResolucionesFirmadas() {
    this.isStreaming = true;
    this.ngxService.startLoader("lbuscar");
    const funcionNombre =
      environment.funcion?.CONSULTAR_RESOLUCIONES_FIRMADAS ||
      "MPPD_CEFirmadosDetalles";

    let param = "";
    if (this.fechaDesde && this.fechaHasta) {
      param = `${this.fechaDesde} 00:00:00,${this.fechaHasta} 23:59:59`;
    }

    this.xAPI.funcion = funcionNombre;
    this.xAPI.parametros = param;
    this.xAPI.valores = "";

    console.log("Invocando API Resoluciones Firmadas (Stream):", this.xAPI);

    this.lstFirmadasOriginal = [];
    this.lstFirmadas = [];
    const setTipos = new Set<string>();
    let initialLoaderStopped = false;

    const signal = this.streamAbortController
      ? this.streamAbortController.signal
      : undefined;

    try {
      await this.apiService.postStream(
        "crudstream",
        this.xAPI,
        (item: any) => {
          const mappedItem = {
            ...item,
            numero_resuelto: item.numero_resuelto || item.total_resueltos || "",
            tipo: item.tipo || item.des_resol || "RESOLUCIÓN",
            descripcion: item.descripcion || item.numero || "",
            contenido: item.contenido || item.asunto || "",
            ultimo_firmado: item.ultimo_firmado || "",
          };
          this.lstFirmadasOriginal.push(mappedItem);

          if (mappedItem.tipo && mappedItem.tipo.trim() !== "") {
            setTipos.add(mappedItem.tipo.trim().toUpperCase());
          }

          // Evaluación rápida de filtros para renderizado progresivo
          const asuntoFilter = (this.filtroAsunto || "").trim().toLowerCase();
          const numeroFilter = (this.filtroNumero || "").trim().toLowerCase();
          const tipoFilter = (this.filtroTipo || "").trim().toLowerCase();

          let match = true;
          if (asuntoFilter) {
            const cont = mappedItem.contenido ? mappedItem.contenido.toLowerCase() : "";
            const asun = mappedItem.asunto ? mappedItem.asunto.toLowerCase() : "";
            if (!cont.includes(asuntoFilter) && !asun.includes(asuntoFilter)) match = false;
          }
          if (match && numeroFilter) {
            const numR = mappedItem.numero_resuelto ? mappedItem.numero_resuelto.toLowerCase() : "";
            const desc = mappedItem.descripcion ? mappedItem.descripcion.toLowerCase() : "";
            if (!numR.includes(numeroFilter) && !desc.includes(numeroFilter)) match = false;
          }
          if (match && tipoFilter) {
            const tipo = mappedItem.tipo ? mappedItem.tipo.toLowerCase() : "";
            if (!tipo.includes(tipoFilter)) match = false;
          }

          if (match) {
            this.lstFirmadas.push(mappedItem);
          }

          // Liberar el loader bloqueante en cuanto haya registros listos
          if (!initialLoaderStopped && this.lstFirmadas.length > 0) {
            initialLoaderStopped = true;
            this.ngxService.stopLoader("lbuscar");
          }
        },
        signal
      );

      this.tiposResolucion = Array.from(setTipos).sort();
      // Al finalizar, reaplicamos filtros para asegurar el ordenamiento final
      this.aplicarFiltrosFirmadas();
    } catch (error: any) {
      if (error?.name !== "AbortError" && !signal?.aborted) {
        console.error("Error en consultarResolucionesFirmadas:", error);
      }
    } finally {
      this.isStreaming = false;
      this.ngxService.stopLoader("lbuscar");
    }
  }

  aplicarFiltrosFirmadas() {
    const asuntoFilter = (this.filtroAsunto || "").trim().toLowerCase();
    const numeroFilter = (this.filtroNumero || "").trim().toLowerCase();
    const tipoFilter = (this.filtroTipo || "").trim().toLowerCase();

    this.lstFirmadas = this.lstFirmadasOriginal.filter((item) => {
      const matchAsunto =
        !asuntoFilter ||
        (item.contenido && item.contenido.toLowerCase().includes(asuntoFilter)) ||
        (item.asunto && item.asunto.toLowerCase().includes(asuntoFilter));

      const matchNumero =
        !numeroFilter ||
        (item.numero_resuelto && item.numero_resuelto.toLowerCase().includes(numeroFilter)) ||
        (item.total_resueltos && item.total_resueltos.toString().toLowerCase().includes(numeroFilter)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(numeroFilter)) ||
        (item.numero && item.numero.toString().toLowerCase().includes(numeroFilter));

      const matchTipo =
        !tipoFilter ||
        (item.tipo && item.tipo.toLowerCase().includes(tipoFilter)) ||
        (item.des_resol && item.des_resol.toLowerCase().includes(tipoFilter));

      return matchAsunto && matchNumero && matchTipo;
    });

    this.ejecutarOrdenamiento();
    this.pageIndex = 0;
  }

  ordenarPor(columna: string) {
    if (this.ordenColumna === columna) {
      this.ordenDireccion = this.ordenDireccion === "asc" ? "desc" : "asc";
    } else {
      this.ordenColumna = columna;
      this.ordenDireccion = columna === "fecha" ? "desc" : "asc";
    }
    this.ejecutarOrdenamiento();
  }

  ejecutarOrdenamiento() {
    const dir = this.ordenDireccion === "asc" ? 1 : -1;
    this.lstFirmadas.sort((a, b) => {
      let valA = "";
      let valB = "";

      switch (this.ordenColumna) {
        case "asunto":
          valA = (a.contenido || a.asunto || "").toLowerCase();
          valB = (b.contenido || b.asunto || "").toLowerCase();
          break;
        case "numero":
          valA = (a.numero_resuelto || a.descripcion || "").toLowerCase();
          valB = (b.numero_resuelto || b.descripcion || "").toLowerCase();
          break;
        case "tipo":
          valA = (a.tipo || "").toLowerCase();
          valB = (b.tipo || "").toLowerCase();
          break;
        case "fecha":
        default:
          valA = (a.ultimo_firmado || "").toLowerCase();
          valB = (b.ultimo_firmado || "").toLowerCase();
          break;
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  /**
   * Descarga y abre el archivo PDF del resuelto desde DWSCDN
   * Siguiendo el esquema de getResueltoId de resueltos_ok
   */
  getResueltoId(numero: string, doc?: any) {
    if (numero && numero.toString().trim() !== "") {
      const cleanName = numero.trim().replace(/\.pdf$/i, "");

      const payload = {
        ruta: "resueltos/",
        archivo: `${cleanName}.pdf`,
      };

      Swal.fire({
        title: "Cargando PDF...",
        text: "Por favor espere mientras se descarga el documento desde el servidor.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.apiService.postBlob("dwscdn", payload).subscribe({
        next: (data: Blob) => {
          Swal.close();
          const fileURL = URL.createObjectURL(data);
          window.open(fileURL, "_blank");
        },
        error: (error) => {
          Swal.close();
          console.error("Error al descargar el PDF:", error);
          this.toastrService.error(
            "No se pudo obtener el archivo PDF desde el servidor de almacenamiento."
          );
        },
      });
    }
  }

  limpiarFiltrosFirmadas() {
    this.filtroAsunto = "";
    this.filtroNumero = "";
    this.filtroTipo = "";
    this.aplicarFiltrosFirmadas();
  }

  get lstFirmadasPaginadas(): any[] {
    const start = this.pageIndex * this.pageSize;
    return this.lstFirmadas.slice(start, start + this.pageSize);
  }

  pageChangeEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  // ==========================================
  // EXPORTACIONES: EXCEL, CSV, PDF
  // ==========================================
  exportExcel(): void {
    if (this.tipoReporte === 1) {
      const xlsx: any[] = [];
      this.lst.forEach((e, i) => {
        xlsx.push({
          "#": i + 1,
          Grado: e.ngrado || "",
          Componente: e.ncomponente || "",
          Nombre: e.nombres_apellidos || "",
          Categoria: e.n_categoria || "",
          Especialidad: e.especialidad || "",
          Cedula: e.cedula || "",
          Promocion: e.fecha_promocion || "",
          "Admin. Dias": e.dias || "",
          "Admin. Años": e.total || "",
          Ente: e.des_reserva || "",
          Retorno: e.fecha_fin_periodo || "",
        });
      });
      this.excelService.exportToExcel(xlsx, "administracion_publica");
    } else if (this.tipoReporte === 2) {
      const xlsx: any[] = [];
      this.lst.forEach((e, i) => {
        xlsx.push({
          "#": i + 1,
          Nombre: e.nombres_apellidos || "",
          Cedula: e.cedula || "",
          Grado: e.ngrado || e.grado || "",
          Promocion: e.fecha_promocion || "",
          Especialidad: e.especialidad || "",
          "Fecha Nacimiento": e.fecha_nacimiento || "",
          Cargo: e.carg || e.cargo || "",
        });
      });
      this.excelService.exportToExcel(xlsx, "cumpleanieros");
    } else if (this.tipoReporte === 3) {
      const xlsx: any[] = [];
      this.lstFirmadas.forEach((e, i) => {
        xlsx.push({
          "#": i + 1,
          "N° Resuelto": e.numero_resuelto || "",
          Tipo: e.tipo || "",
          "Asunto / Contenido": e.contenido || e.asunto || "",
          "Último Firmado": e.ultimo_firmado || "",
        });
      });
      this.excelService.exportToExcel(xlsx, "resoluciones_firmadas");
    }
  }

  exportCsv(): void {
    if (this.tipoReporte === 1) {
      const data: any[] = [];
      this.lst.forEach((e, i) => {
        data.push({
          "#": i + 1,
          Grado: e.ngrado || "",
          Componente: e.ncomponente || "",
          Nombre: e.nombres_apellidos || "",
          Categoria: e.n_categoria || "",
          Especialidad: e.especialidad || "",
          Cedula: e.cedula || "",
          Promocion: e.fecha_promocion || "",
          "Admin. Dias": e.dias || "",
          "Admin. Años": e.total || "",
          Ente: e.des_reserva || "",
          Retorno: e.fecha_fin_periodo || "",
        });
      });
      this.excelService.exportToCsv(data, "administracion_publica");
    } else if (this.tipoReporte === 2) {
      const data: any[] = [];
      this.lst.forEach((e, i) => {
        data.push({
          "#": i + 1,
          Nombre: e.nombres_apellidos || "",
          Cedula: e.cedula || "",
          Grado: e.ngrado || e.grado || "",
          Promocion: e.fecha_promocion || "",
          Especialidad: e.especialidad || "",
          "Fecha Nacimiento": e.fecha_nacimiento || "",
          Cargo: e.carg || e.cargo || "",
        });
      });
      this.excelService.exportToCsv(data, "cumpleanieros");
    } else if (this.tipoReporte === 3) {
      const data: any[] = [];
      this.lstFirmadas.forEach((e, i) => {
        data.push({
          "#": i + 1,
          "N° Resuelto": e.numero_resuelto || "",
          Tipo: e.tipo || "",
          "Asunto / Contenido": e.contenido || e.asunto || "",
          "Ultimo Firmado": e.ultimo_firmado || "",
        });
      });
      this.excelService.exportToCsv(data, "resoluciones_firmadas");
    }
  }

  exportPdfFirmadas(): void {
    if (!this.lstFirmadas || this.lstFirmadas.length === 0) {
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Membrete institucional centrado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(23, 43, 77);
    doc.text("REPÚBLICA BOLIVARIANA DE VENEZUELA", 148.5, 14, { align: "center" });
    doc.setFontSize(10);
    doc.text("MINISTERIO DEL PODER POPULAR PARA LA DEFENSA", 148.5, 19, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("REPORTE DE RESOLUCIONES FIRMADAS", 148.5, 24, { align: "center" });

    // Información de filtros y fecha de emisión
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const infoPeriodo = `Período: ${this.fechaDesde || "Todos"} a ${this.fechaHasta || "Todos"} | Total Registros: ${this.lstFirmadas.length}`;
    doc.text(infoPeriodo, 14, 30);
    doc.text(`Emisión: ${new Date().toLocaleDateString("es-VE")}`, 283, 30, { align: "right" });

    // Filas para la tabla
    const tableBody = this.lstFirmadas.map((e, index) => [
      index + 1,
      e.numero_resuelto || "-",
      e.tipo || "-",
      e.contenido || e.asunto || "-",
      e.ultimo_firmado
        ? e.ultimo_firmado.includes("T")
          ? e.ultimo_firmado.replace("T", " ").substring(0, 19)
          : e.ultimo_firmado
        : "-",
    ]);

    autoTable(doc, {
      startY: 33,
      head: [["#", "N° Resuelto", "Tipo", "Asunto / Contenido", "Fecha Firma"]],
      body: tableBody,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [40, 40, 40],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [94, 170, 168], // Verde mate / pastel (#5eaaa8)
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 32, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 35 },
        3: { cellWidth: "auto" },
        4: { cellWidth: 35, halign: "center" },
      },
      didDrawPage: (data: any) => {
        const pageCount = (doc.internal as any).getNumberOfPages();
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          148.5,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      },
    });

    doc.save(`Resoluciones_Firmadas_${new Date().getTime()}.pdf`);
  }

  ngOnDestroy(): void {
    for (const key in this.rawUrlsMap) {
      if (this.rawUrlsMap.hasOwnProperty(key)) {
        const url = this.rawUrlsMap[key];
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    }
  }
}
