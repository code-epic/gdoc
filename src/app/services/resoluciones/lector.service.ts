import { Injectable } from "@angular/core";

export interface Oficial {
  nombre: string;
  cedula: string;
  cargo: string;
  ubicacion: string;
}

export interface NodoJerarquia {
  profundidad: number;
  texto: string;
}

@Injectable({
  providedIn: "root",
})
export class LectorService {
  constructor() {}

  /**
   * Entrada principal consolidada que ejecuta todos los clasificadores de resoluciones,
   * elimina duplicados por cédula y normaliza los textos de asunto y cargo.
   */
  extraerDatosMilitar(contenidoHtml: string): Oficial[] {
    // 1. Ejecutar el clasificador jerárquico tradicional
    const porJerarquia = this.parseMilitarPorJerarquia(contenidoHtml);

    // 2. Ejecutar el clasificador de cese en el empleo / reserva activa
    const porCese = this.parseCeseEmpleo(contenidoHtml);

    // Consolidar resultados eliminando duplicados por cédula (preferir el del cese si coincide)
    const mapaOficiales = new Map<string, Oficial>();

    porJerarquia.forEach((o) => {
      o.ubicacion = this.normalizarAsunto(o.ubicacion);
      o.cargo = this.normalizarAsunto(o.cargo);
      mapaOficiales.set(o.cedula, o);
    });

    porCese.forEach((o) => {
      o.ubicacion = this.normalizarAsunto(o.ubicacion);
      o.cargo = this.normalizarAsunto(o.cargo);
      mapaOficiales.set(o.cedula, o);
    });

    return Array.from(mapaOficiales.values());
  }

  /**
   * Caso 1: Clasificador Jerárquico.
   * Analiza la estructura del árbol de dependencias organizacionales basándose en la tabulación (margin-left)
   * o jerarquías de cabecera en negrita/mayúsculas.
   */
  private parseMilitarPorJerarquia(contenidoHtml: string): Oficial[] {
    const resultados: Oficial[] = [];
    const pilaJerarquia: NodoJerarquia[] = [];

    // Regex para atrapar todo el contenido dentro de las etiquetas <p>...</p>
    const regexParrafo = /<p[^>]*>(.*?)<\/p>/gis;
    let matchParrafo;

    while ((matchParrafo = regexParrafo.exec(contenidoHtml)) !== null) {
      const pTagCompleto = matchParrafo[0];
      const pContenido = matchParrafo[1];

      // Limpiar texto de etiquetas HTML
      const textoLimpio = pContenido
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!textoLimpio || textoLimpio === "-") continue;

      // Calcular profundidad (margin-left)
      let profundidad = 0;
      const matchMargen = pTagCompleto.match(/margin-left:\s*([\d.]+)(cm|pt)/i);

      let margenPt = 0;
      if (matchMargen) {
        const valor = parseFloat(matchMargen[1]);
        const unidad = matchMargen[2].toLowerCase();
        margenPt = unidad === "cm" ? valor * 28.3465 : valor;
      }

      if (margenPt === 0) {
        const isBold = /<b\b[^>]*>|<strong>/i.test(pTagCompleto) || /font-weight:\s*(bold|700)/i.test(pTagCompleto);
        const isUpperCase = textoLimpio === textoLimpio.toUpperCase() && textoLimpio !== textoLimpio.toLowerCase();
        
        if (isUpperCase && isBold) {
          profundidad = -3; // Nivel más alto (ej. COMANDO GENERAL)
        } else if (isUpperCase && !isBold) {
          profundidad = -2; // Segundo Nivel (ej. SEGUNDO COMANDO)
        } else {
          profundidad = -1; // Tercer Nivel (ej. Cuerpo de Ingenieros)
        }
      } else {
        profundidad = Math.round(margenPt * 10) / 10; 
      }

      // Detectar persona con Cédula y Cargo
      const regexPersona = /([^,]+),\s*(?:C\.I\.\s*N[°º]?|C\.I\.|N[°º])\s*([\d\.]+)\s*,\s*([^,]+)/i;
      const matchPersona = textoLimpio.match(regexPersona);

      if (matchPersona) {
        const nombreRaw = matchPersona[1];
        const nombreMatches = nombreRaw.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
        const nombre = nombreMatches ? nombreMatches[0].trim() : nombreRaw.trim();

        const cedulaSucia = matchPersona[2];
        const cedula = cedulaSucia.replace(/\./g, "").trim();
        
        let cargo = matchPersona[3].trim(); 
        if (cargo.includes(',')) {
           cargo = cargo.substring(0, cargo.indexOf(',')).trim();
        } else if (cargo.toLowerCase().endsWith('p/v.')) {
           cargo = cargo.substring(0, cargo.length - 4).trim();
        }

        const rutaDependencias = pilaJerarquia
          .map((nodo) => nodo.texto)
          .reverse()
          .join(", ");

        const ubicacion = rutaDependencias ? `${cargo}, ${rutaDependencias}` : cargo;

        resultados.push({ nombre, cedula, cargo, ubicacion });
      } else {
        // Es un nodo de jerarquía (Dependencia, Batallón, Sección, etc.)
        // Eliminar de la pila los nodos que estén al mismo nivel o más profundos, 
        // excepto si son cabeceras iniciales antes de los resultados
        while (
          pilaJerarquia.length > 0 &&
          pilaJerarquia[pilaJerarquia.length - 1].profundidad >= profundidad &&
          !(pilaJerarquia[pilaJerarquia.length - 1].profundidad < 0 && profundidad < 0 && resultados.length === 0)
        ) {
          pilaJerarquia.pop();
        }

        if (
          !textoLimpio.startsWith("PRIMERO:") &&
          !textoLimpio.startsWith("SEGUNDO:")
        ) {
          pilaJerarquia.push({ profundidad, texto: textoLimpio });
        }
      }
    }

    return resultados;
  }

  /**
   * Caso 2: Clasificador de Cese en el Empleo / Reserva Activa.
   * Detecta enunciados con patrón de cese de empleo, extrayendo el asunto, grado/nombre y cédula.
   * Ejemplo: "ÚNICO: CESAR EN EL EMPLEO (PROPIA SOLICITUD) al Capitán LUIS MIGUEL CARVAJAL CARRIÓN, C.I. N° 20.022.914."
   */
  private parseCeseEmpleo(contenidoHtml: string): Oficial[] {
    const resultados: Oficial[] = [];
    const regexParrafo = /<p[^>]*>(.*?)<\/p>/gis;
    let matchParrafo;

    while ((matchParrafo = regexParrafo.exec(contenidoHtml)) !== null) {
      const pContenido = matchParrafo[1];
      const textoLimpio = pContenido
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!textoLimpio) continue;

      // Regex para patrón de cese de empleo
      // ÚNICO: [Asunto] al/del [Grado Nombre], C.I. N° [Cédula]
      const regexCese = /(?:ÚNICO|PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO):\s*([^,]+?)\s+(?:al?\s+(?:ciudadano\s+|ciudadana\s+)?|del?\s+la?\s+)([^,]+),\s*(?:C\.I\.\s*N[°º]?|C\.I\.|N[°º])\s*([\d\.]+)/i;
      const matchCese = textoLimpio.match(regexCese);

      if (matchCese) {
        const asuntoExtraido = matchCese[1].trim();
        const rankAndName = matchCese[2].trim();
        const cedulaSucia = matchCese[3];
        const cedula = cedulaSucia.replace(/\./g, "").trim();

        // Extraer nombre en mayúsculas al final
        const nombreMatches = rankAndName.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
        const nombre = nombreMatches ? nombreMatches[0].trim() : rankAndName;
        
        // Extraer cargo/grado (lo que queda al inicio)
        let cargo = rankAndName.replace(nombre, "").trim();
        if (!cargo) cargo = "Oficial";

        // Para cese en el empleo, la ubicación es el asunto extraído
        const ubicacion = asuntoExtraido;

        resultados.push({ nombre, cedula, cargo, ubicacion });
      }
    }

    return resultados;
  }

  /**
   * Convierte a MAYÚSCULAS y remueve acentos/diéresis, pero protege la letra Ñ/ñ,
   * comillas y paréntesis para optimizar las búsquedas.
   */
  public normalizarAsunto(texto: string): string {
    if (!texto) return "";
    let res = texto.toUpperCase();

    // Reemplazar de manera explícita y manual para preservar la Ñ y caracteres de búsqueda clave
    res = res.replace(/[ÁÀÄÂ]/g, "A")
             .replace(/[ÉÈËÊ]/g, "E")
             .replace(/[ÍÌÏÎ]/g, "I")
             .replace(/[ÓÒÖÔ]/g, "O")
             .replace(/[ÚÙÜÛ]/g, "U")
             .replace(/[ÝŸ]/g, "Y");

    return res.trim();
  }
}
