import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RsconsultaSessionService {
  constructor() {}

  public cargarDatosDesdeSession(environment: any): any {
    return {
      Componentes: this.leerSession(environment.funcion.COMPONENTE_CONSULTAR),
      Grados: this.leerSession(environment.funcion.GRADO_CONSULTAR),
      Categorias: this.leerSession(environment.funcion.CATEGORIAS_CONSULTAR),
      Clasificaciones: this.leerSession(environment.funcion.CLASIFICACION_CONSULTAR),
      TipoEntradas: this.leerSession(environment.funcion.TIPO_ENTRADA_CONSULTAR),
      TipoResoluciones: this.leerSession(environment.funcion.TIPO_RESOLUCION_CONSULTAR),
      Carpetas: this.leerSession(environment.funcion.CARPETA_ENTRADA_CONSULTAR),
      OrdenNumero: this.leerSession(environment.funcion.ORDEN_ENTRADA_CONSULTAR),
      GradoIPSFA: this.leerSession(environment.funcion.GRADO_IPSFA_CONSULTAR),
      UbicacionCarpetas: this.leerSession(environment.funcion.CARPETAS_CONSULTAR),
      UbicacionCarpetasEntrada: this.leerSession(environment.funcion.CARPETA_ENTRADA_CONSULTAR)
    };
  }

  private leerSession(key: string): any {
    const item = sessionStorage.getItem(key);
    return item !== undefined && item !== null ? JSON.parse(atob(item)) : [];
  }
}
