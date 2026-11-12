import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { IWKFAlerta } from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

@Component({
  selector: "app-ctrlfirmados",
  templateUrl: "./ctrlfirmados.component.html",
  styleUrls: ["./ctrlfirmados.component.scss"],
})
export class CtrlfirmadosComponent implements OnInit, OnDestroy {
  public titulo = "Documentos Firmados";

  // Estado 2 (Gestión / Control), Estatus 8 (Archivados de Actividades Varias y Comunicaciones Varias)
  public estadoActual = 2;
  public estadoOrigen = 8;

  fecha_desde = "-01-01";
  fecha_hasta = "-12-31";
  xyear = "2024";
  public lstMeses = [];
  public lstYear = [];
  public xmeses = "";

  public paginador = 10;
  public focus: any;
  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public filtro = 1;

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: "",
    usuario: "",
    observacion: "",
  };

  lst = [];
  public lstEstados = []; // Listar Estados

  longitud = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  public isStreaming: boolean = false;
  private streamAbortController: AbortController | null = null;

  public docSeleccionado: any = null;
  public constanciaDoc: any = null;
  public constanciaSubDoc: any[] = [];
  public constanciaTraza: any[] = [];
  public totpQrCodeUrl: string = "";
  public loadingConstancia: boolean = false;
  public currentFechaHoy: string = new Date().toLocaleDateString("es-ES");

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0;

  public buzon = [];
  public bzOriginal = [];

  public estilocheck = "none";
  public estiloclasificar = "none";
  public allComplete: boolean = false;

  public hashcontrol = "";
  public numControl = "";
  public Observacion = "";
  public AccionTexto: string = "0";

  public clasificacion = false;
  public vplazo = false;
  public cmbDestino = "";
  public lstAcciones = [];

  public cmbAcciones = [
    { valor: "0", texto: "ACEPTAR", visible: "1" },
    { valor: "1", texto: "OTROS DOCUMENTOS", visible: "1" },
    { valor: "2", texto: "PRESIDENCIAL", visible: "1" },
    { valor: "3", texto: "TRAMITACION POR ORDEN REGULAR", visible: "0" },
    { valor: "4", texto: "OTROS DOCUMENTOS", visible: "1" },
    { valor: "5", texto: "RECLAMOS", visible: "0" },
    { valor: "6", texto: "REDISTRIBUCION", visible: "0" },
  ];

  public bzBusqueda = [];
  public buscar = "";
  public extender_plazo: any;
  public posicionPagina = 0;
  public placement = "bottom";
  public xTipo = "";

  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private ngxService: NgxUiLoaderService,
    private loginService: LoginService,
    private rutaActiva: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.lstMeses = this.apiService.Xmeses;
    this.lstYear = this.apiService.Xyear;
  }

  ngOnInit(): void {
    this.xmeses = new Date().getMonth().toString();
    this.xyear = new Date().getFullYear().toString();

    this.listarEstados();
    this.titulo = "Documentos Firmados";

    this.seleccionNavegacion(0);
  }

  ngOnDestroy(): void {
    if (this.streamAbortController) {
      this.streamAbortController.abort();
    }
  }

  seleccionLista(event: any) {
    this.longitud = 0;
    this.pageSize = 10;
    const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar), "i");
    if (event.charCode == 13) {
      this.bzBusqueda = this.bzOriginal.filter((e: any) => {
        const str = `${e.numc || ""} ${e.nori || ""} ${e.udep || ""} ${e.asunto || ""} ${e.coma || ""}`;
        return patron.test(this.utilService.ConvertirCadena(str));
      });
      this.longitud = this.bzBusqueda.length;
      this.buzon = this.bzBusqueda.slice(0, this.pageSize);
      this.buscar = "";
    }
  }

  open(content: any, id: any) {
    this.numControl = id;
    this.hashcontrol = btoa("D" + this.numControl);
    this.modalService.open(content);
  }

  seleccionNavegacion(e: number = 0) {
    if (this.streamAbortController) {
      this.streamAbortController.abort();
    }
    this.streamAbortController = new AbortController();

    this.buzon = [];
    this.bzOriginal = [];
    this.longitud = 0;
    this.pageIndex = 0;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CDocumentosGestion";
    this.xAPI.valores = "";
    this.selNav = e;

    this.fecha_desde = this.xyear + "-" + this.lstMeses[this.xmeses].desde;
    this.fecha_hasta = this.xyear + "-" + this.lstMeses[this.xmeses].hasta;
    this.cargarAcciones(e);

    this.xTipo = "";
    this.clasificacion = false;
    this.filtro = 1;

    // Documentos con estado 2, estatus 8 (firmados y archivados en actividades varias y comunicaciones varias)
    this.xAPI.parametros = `${this.estadoActual},${this.estadoOrigen},${this.fecha_desde},${this.fecha_hasta}`;
    console.info(`[CtrlFirmados] Consultando: ${this.xAPI.funcion} (${this.xAPI.parametros})`);

    this.listarBuzon();
  }

  listarEstados() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CEstados";
    this.xAPI.parametros = "%";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = (data?.Cuerpo || []).filter((e: any) => e.esta == 1);
      },
      (error) => {
        console.error("[CtrlFirmados] Error al listar estados:", error);
      },
    );
  }

  async listarBuzon() {
    this.isStreaming = true;
    this.ngxService.startLoader("loader-aceptar");
    this.bzOriginal = [];
    this.buzon = [];
    this.longitud = 0;
    this.estilocheck = "none";
    let initialLoaderStopped = false;

    const signal = this.streamAbortController
      ? this.streamAbortController.signal
      : undefined;

    try {
      await this.apiService.postStream(
        "crudstream",
        this.xAPI,
        (e: any) => {
          e.edit = e.tdoc ? e.tdoc.toLowerCase() == "punto de cuenta" : false;
          e.existe = !!e.anom;
          e.privado = e.priv == 1;
          e.completed = false;
          e.color = "warn";

          let text = "";
          e.nombre_accion = "";
          if (e.accion != null && this.cmbAcciones[e.accion]) {
            text = this.cmbAcciones[e.accion].texto || "";
            e.nombre_accion = text;
          }

          this.bzOriginal.push(e);
          this.longitud = this.bzOriginal.length;
          this.estilocheck = "";

          const startIdx = this.pageIndex * this.pageSize;
          const endIdx = startIdx + this.pageSize;
          if (
            this.bzOriginal.length > startIdx &&
            this.bzOriginal.length <= endIdx
          ) {
            this.buzon.push(e);
          }

          if (!initialLoaderStopped && this.buzon.length > 0) {
            initialLoaderStopped = true;
            this.ngxService.stopLoader("loader-aceptar");
          }
        },
        signal,
      );

      this.recorrerElementos(this.pageIndex);
    } catch (error: any) {
      if (error?.name !== "AbortError" && !signal?.aborted) {
        console.warn("[CtrlFirmados] Falló stream, intentando ejecutar estándar:", error);
        // Fallback a ejecución tradicional
        this.apiService.Ejecutar(this.xAPI).subscribe({
          next: (res) => {
            const list = res?.Cuerpo || [];
            this.bzOriginal = list.map((e: any) => {
              e.existe = !!e.anom;
              e.privado = e.priv == 1;
              return e;
            });
            this.longitud = this.bzOriginal.length;
            this.recorrerElementos(0);
            this.ngxService.stopLoader("loader-aceptar");
          },
          error: (err) => {
            console.error("[CtrlFirmados] Error en llamada estándar:", err);
            this.ngxService.stopLoader("loader-aceptar");
          },
        });
      }
    } finally {
      this.isStreaming = false;
      this.ngxService.stopLoader("loader-aceptar");
    }
  }

  pageChangeEvent(e: any) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.recorrerElementos(e.pageIndex);
  }

  recorrerElementos(pagina: number) {
    this.pageIndex = pagina;
    const pag = this.pageSize * pagina;
    this.buzon = this.bzOriginal.slice(pag, pag + this.pageSize);
  }

  insertarObservacion() {
    const usuario = this.loginService.Usuario?.id || "1";
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumentoObservacion";
    this.xAPI.valores = JSON.stringify({
      documento: this.numControl,
      estado: this.estadoActual,
      estatus: this.selNav + 1,
      observacion: this.Observacion.toUpperCase(),
      accion: this.AccionTexto,
      usuario: usuario,
    });
    this.xAPI.parametros = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        switch (this.AccionTexto) {
          case "0":
            this.promoverBuzon(0, this.utilService.FechaActual());
            break;
          case "1":
            this.rechazarBuzon();
            break;
          case "5":
            this.redistribuir(16, 2);
            break;
          case "3":
            this.redistribuir(4, 4);
            break;
          case "6":
            this.redistribuir(0);
            break;
          default:
            this.seleccionNavegacion(this.selNav);
            break;
        }
      },
      (error) => {
        this.toastrService.error(error, `GDoc Wkf.DocumentoObservacion`);
      },
    );
  }

  async rechazarBuzon() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_AUbicacionRechazo";
    this.xAPI.valores = "";
    this.xAPI.parametros =
      "1,1,1,," + (this.loginService.Usuario?.id || "1") + "," + this.numControl;
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          "El documento ha sido enviado al origen",
          `GDoc Wkf.DocumentoObservacion`,
        );
        this.seleccionNavegacion(this.selNav);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  async promoverBuzon(activo: number, sfecha: string) {
    const fecha =
      sfecha == ""
        ? this.utilService.ConvertirFecha(this.extender_plazo)
        : sfecha;

    const usuario = this.loginService.Usuario?.id || "1";
    const estatus = 1;
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_APromoverEstatus";
    this.xAPI.valores = "";
    this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        await this.guardarAlerta(activo, fecha);
        this.seleccionNavegacion(this.selNav);
        this.Observacion = "";
        this.numControl = "0";
        this.toastrService.success(
          "Se ha promovido el documento",
          `GDoc Wkf.DocumentoObservacion`,
        );
      },
      (error) => {
        this.toastrService.error(error, `GDoc Wkf.PromoverDocumento`);
      },
    );
  }

  async redistribuir(destino: number = 0, estatus = 2) {
    const dst = destino != 0 ? destino : this.cmbDestino;
    const est = destino != 0 ? estatus : 1;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_ARedistribuir";
    this.xAPI.valores = "";
    this.xAPI.parametros =
      dst +
      "," +
      dst +
      "," +
      est +
      "," +
      (this.loginService.Usuario?.id || "1") +
      "," +
      this.numControl;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.guardarAlerta(
          1,
          this.utilService.ConvertirFecha(this.extender_plazo),
        );
        this.toastrService.success(
          "El documento ha sido redistribuido según su selección",
          `GDoc Wkf.DocumentoObservacion`,
        );
        this.seleccionNavegacion(this.selNav);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  async cargarAcciones(posicion: any) {
    this.lstAcciones = this.cmbAcciones.filter((e: any) => {
      return e.visible == posicion;
    });
  }

  selAccion() {
    this.clasificacion = false;
    this.vplazo = true;
    switch (this.AccionTexto) {
      case "0":
      case "1":
        this.vplazo = false;
        break;
      case "6":
        this.clasificacion = true;
        break;
      default:
        break;
    }
  }

  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo;
    this.WAlerta.documento = parseInt(this.numControl) || 0;
    this.WAlerta.estado = this.estadoActual;
    this.WAlerta.estatus = this.selNav + 1;
    this.WAlerta.usuario = this.loginService.Usuario?.id || "1";
    this.WAlerta.observacion = this.Observacion.toUpperCase();
    this.WAlerta.fecha = fecha;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_AAlertas";
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (alerData) => {},
      (error) => {
        this.toastrService.error(error, `GDoc Wkf.AAlertas`);
      },
    );
  }

  dwUrl(ncontrol: string, archivo: string): string {
    if (!archivo) return "#";
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }

  getDetalle(e: any): string {
    if (!e) return "";
    if (e.s_cuenta == "") {
      return e.numc;
    }
    if (e.s_cuenta == null) {
      return e.numc || "S/C";
    }
    return e.tdoc == "PUNTO DE CUENTA" ? e.s_cuenta : (e.numc || e.s_cuenta);
  }

  openDetalleModal(content: any, doc: any) {
    this.docSeleccionado = doc;
    this.constanciaDoc = null;
    this.constanciaSubDoc = [];
    this.constanciaTraza = [];
    this.totpQrCodeUrl = "";
    this.loadingConstancia = true;

    const idDoc = doc.idd || doc.id || doc.ncontrol || doc.numc;
    if (idDoc) {
      this.getQR(idDoc);
    }

    const baseParam = "1,1," + idDoc;

    const xAPI = {} as IAPICore;
    xAPI.funcion = "WKF_CDocumentoDetalle";
    xAPI.parametros = baseParam;
    xAPI.valores = "";

    this.apiService.Ejecutar(xAPI).subscribe(
      (data) => {
        this.loadingConstancia = false;
        if (data && data.Cuerpo && data.Cuerpo.length > 0) {
          const res = data.Cuerpo[0];
          this.constanciaDoc = res;
          if (res.fcreacion)
            this.constanciaDoc.fcreacion = res.fcreacion.substring(0, 10);
          if (res.forigen)
            this.constanciaDoc.forigen = res.forigen.substring(0, 10);

          if (res.ncontrol) {
            this.getQR(res.ncontrol);
          }

          if (res.subdocumento) {
            try {
              const subParsed =
                typeof res.subdocumento === "string"
                  ? JSON.parse(res.subdocumento)
                  : res.subdocumento;
              if (Array.isArray(subParsed)) {
                this.constanciaSubDoc = subParsed.map((item: any) =>
                  typeof item === "object" ? item : JSON.parse(item),
                );
              }
            } catch (e) {
              console.warn(e);
            }
          }

          if (res.traza) {
            try {
              const trazaParsed =
                typeof res.traza === "string"
                  ? JSON.parse(res.traza)
                  : res.traza;
              if (Array.isArray(trazaParsed)) {
                this.constanciaTraza = trazaParsed.map((item: any) =>
                  typeof item === "object" ? item : JSON.parse(item),
                );
                this.constanciaTraza.sort(
                  (a: any, b: any) => (b.id || 0) - (a.id || 0),
                );
              }
            } catch (e) {
              console.warn(e);
            }
          }
        } else {
          this.constanciaDoc = doc;
        }
      },
      (error) => {
        this.loadingConstancia = false;
        this.constanciaDoc = doc;
      },
    );

    const modalRef = this.modalService.open(content, {
      centered: true,
      size: "xl",
      backdrop: "static",
      keyboard: true,
      windowClass: "modal-constancia-clean",
    });

    if (modalRef && modalRef["_windowCmptRef"]) {
      modalRef["_windowCmptRef"].location.nativeElement.style.zIndex = "1060";
    }
  }

  getQR(id: string) {
    if (!id) return;
    const obj = {
      id: id,
      ruta: "string",
      tipo: "base64",
    };
    this.apiService.MakeQR(obj).subscribe(
      (data) => {
        if (data && data.contenido != "") {
          this.totpQrCodeUrl = data.contenido;
        }
      },
      (error) => {
        console.error("Error generando QR:", error);
      },
    );
  }

  public async exportarPDF() {
    const element = document.getElementById("constanciaSheet") as HTMLElement;
    if (!element) {
      this.toastrService.error(
        "No se encontró el lienzo del documento para exportar.",
      );
      return;
    }

    Swal.fire({
      title: "Generando PDF...",
      text: "Por favor espere mientras se compila el documento formal.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const numControl =
        this.constanciaDoc?.ncontrol ||
        this.docSeleccionado?.numc ||
        "documento";
      pdf.save(`Constancia_${numControl}.pdf`);
      Swal.close();
      this.toastrService.success("Documento exportado a PDF exitosamente.");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      Swal.fire(
        "Error",
        "No se pudo generar el documento PDF con jsPDF.",
        "error",
      );
    }
  }

  limpiarTexto(texto: any): string {
    if (!texto) return "";
    let str = typeof texto === "string" ? texto : String(texto);

    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      str = txt.value;
    } catch (e) {}

    str = str.replace(/<[^>]*>/g, " ");
    str = str
      .replace(/&#\d+;/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");

    return str.replace(/\s+/g, " ").trim();
  }
}

