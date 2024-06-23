import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PendientesService {

  private Componentes: any;
  private Grados: any;
  private Categorias: any;
  private Clasificaciones: any;
  private Configuracion: any;

  private lstAction: any[] = [
    { valor: "0", texto: "EN PROCESO", visible: "1" },
    { valor: "1", texto: "ANALISTA", visible: "1" },
    { valor: "2", texto: "JEFE DE AREA", visible: "1" },
    { valor: "3", texto: "BANDEJA DE ESPERA", visible: "1" },
    { valor: "4", texto: "PRESIDENCIAL", visible: "1" },
    { valor: "5", texto: "ESPERA DE OPINION", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "6", texto: "CONSULTORIA JURIDICA", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "7", texto: "AREA DE RESOLUCIONES", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "8", texto: "SUB-DIRECCION", visible: "1" },
    { valor: "9", texto: "DIRECCION GENERAL", visible: "1" },
    { valor: "10", texto: "DESPACHO DEL MPPD", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "11", texto: "ARCHIVO", visible: "1" }
  ];

  private TYPE_DOCUMENT_PLACEHOLDERS = {
    "1": "NRO. CEDULA",
    "2": "NRO. CONTROL",
    "3": "NRO. ORIGEN",
    "4": "NRO. SALIDA",
    "5": "NOMBRES APELLIDOS",
  };
  

  constructor() { }

  getAction(): any[] {
    return this.lstAction;
  }

  getComponent(): any {
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined
                       ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : [];
    return this.Componentes;
  }

  getDegrees(): any {
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined
                  ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : [];
    return this.Grados;
  }

  getCategories(): any {
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined
                      ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : [];
    return this.Categorias;
  }
  
  getClassifications(): any {
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined
                           ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : [];
    return this.Clasificaciones;
  } 
   
  getSetting(): any {
    this.Configuracion = sessionStorage.getItem("MD_CConfiguracion") != undefined
                         ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion"))) : [];
    return this.Configuracion;
  }

  getPlaceholderByTipoDocumento(tipoDocumento: string): string {
      return this.TYPE_DOCUMENT_PLACEHOLDERS[tipoDocumento] || "NÚMERO";
    }
}
