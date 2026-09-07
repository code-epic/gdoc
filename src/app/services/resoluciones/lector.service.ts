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

    // 3. Ejecutar el clasificador directo de líneas (para otros formatos o patrones sin jerarquía)
    const porDirecto = this.parseMilitarDirecto(contenidoHtml);

    // Consolidar resultados eliminando duplicados por cédula (preferir el del cese o jerárquico si coincide)
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

    porDirecto.forEach((o) => {
      o.ubicacion = this.normalizarAsunto(o.ubicacion);
      o.cargo = this.normalizarAsunto(o.cargo);
      if (o.cedula && !mapaOficiales.has(o.cedula)) {
        mapaOficiales.set(o.cedula, o);
      }
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

      // Detectar persona con Cédula y Cargo (Cargo puede ser opcional al final o terminar en punto)
      const regexPersona = /([^,]+),\s*(?:C\.?I\.?\s*(?:N[°ºo\.]*|NRO\.?|NUMERO)?|CÉDULA(?:\s+DE\s+IDENTIDAD)?\s*(?:N[°ºo\.]*)?|(?:V|E)-)\s*[:\.-]*\s*(?:[VEve]-?)?\s*([\d\.]+)(?:\s*,\s*([^,.]+))?/i;
      const matchPersona = textoLimpio.match(regexPersona);

      if (matchPersona && this.esCedulaValida(matchPersona[2])) {
        let nombreRaw = matchPersona[1].trim();
        if (nombreRaw.startsWith('-')) {
          nombreRaw = nombreRaw.substring(1).trim();
        }
        
        if (!/(?:Resolución|Resolucion|Código|Codigo|Venezuela|Decreto|Gaceta|Oficio|Partidas?)/i.test(nombreRaw)) {
          let nombre = "";
          let grado = "";

          const nombreMatches = nombreRaw.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
          if (nombreMatches && nombreMatches[0].trim() !== nombreRaw) {
            nombre = nombreMatches[0].trim();
            grado = nombreRaw.replace(nombre, '').trim() || "S/G";
          } else {
            const sep = this.separarGradoYNombre(nombreRaw);
            nombre = sep.nombre;
            grado = sep.grado;
          }

          const cedulaSucia = matchPersona[2];
          const cedula = cedulaSucia.replace(/\./g, "").trim();
          
          let cargo = matchPersona[3] ? matchPersona[3].trim() : ""; 
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

          resultados.push({ nombre, cedula, cargo: grado + (cargo ? " " + cargo : ""), ubicacion });
        }
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
   * Caso 2: Clasificador de Cese en el Empleo / Reserva Activa / Designación.
   * Detecta enunciados con patrón de cese de empleo o designación, extrayendo el asunto, grado/nombre y cédula.
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

      // Regex para patrón de cese de empleo / designación
      // ÚNICO: [Asunto] al/del [Grado Nombre], C.I. N° [Cédula]
      const regexCese = /(?:ÚNICO|PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO):\s*([^,]+?)\s+(?:al?\s+(?:ciudadano\s+|ciudadana\s+)?|del?\s+la?\s+)([^,]+),\s*(?:C\.?I\.?\s*(?:N[°ºo\.]*|NRO\.?|NUMERO)?|CÉDULA(?:\s+DE\s+IDENTIDAD)?\s*(?:N[°ºo\.]*)?|(?:V|E)-)\s*[:\.-]*\s*(?:[VEve]-?)?\s*([\d\.]+)/i;
      const matchCese = textoLimpio.match(regexCese);

      if (matchCese && this.esCedulaValida(matchCese[3])) {
        const asuntoExtraido = matchCese[1].trim();
        const rankAndName = matchCese[2].trim();
        const cedulaSucia = matchCese[3];
        const cedula = cedulaSucia.replace(/\./g, "").trim();

        let nombre = "";
        let cargo = "";

        const nombreMatches = rankAndName.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
        if (nombreMatches && nombreMatches[0].trim() !== rankAndName) {
          nombre = nombreMatches[0].trim();
          cargo = rankAndName.replace(nombre, "").trim() || "Oficial";
        } else {
          const sep = this.separarGradoYNombre(rankAndName);
          nombre = sep.nombre;
          cargo = sep.grado !== "S/G" ? sep.grado : "Oficial";
        }

        // Para cese o designación, la ubicación es el asunto extraído
        const ubicacion = asuntoExtraido;

        resultados.push({ nombre, cedula, cargo, ubicacion });
      }
    }

    return resultados;
  }

  /**
   * Caso 3: Clasificador Directo de Líneas / Párrafos.
   * Analiza cualquier texto o etiqueta buscando patrones de [Grado] [Nombre] [, ] C.I. [Cédula].
   */
  private parseMilitarDirecto(contenidoHtml: string): Oficial[] {
    const resultados: Oficial[] = [];
    if (!contenidoHtml) return resultados;

    // Convertir etiquetas de quiebre en saltos de línea para procesar por bloques/líneas
    const htmlNormalizado = contenidoHtml
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n");

    const textoLimpio = htmlNormalizado
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ");

    const lineas = textoLimpio.split("\n");

    for (const linea of lineas) {
      const l = linea.trim();
      if (!l || l === "-") continue;

      const regexPersona = /([^,.\n]+?)\s*,?\s*(?:C\.?I\.?\s*(?:N[°ºo\.]*|NRO\.?|NUMERO)?|CÉDULA(?:\s+DE\s+IDENTIDAD)?\s*(?:N[°ºo\.]*)?|(?:V|E)-)\s*[:\.-]*\s*(?:[VEve]-?)?\s*([\d\.]+)(?:\s*[,.]?\s*([^,.\n]+))?/gi;
      let match;
      while ((match = regexPersona.exec(l)) !== null) {
        const rankAndName = match[1].trim();
        const cedulaSucia = match[2];
        const cargoPost = match[3] ? match[3].trim() : "";

        // Omitir prefijos no deseados (Resolución Nº, Código Nº, Venezuela Nº, Decreto Nº, Gaceta Nº, Oficio Nº, Partidas)
        if (/(?:Resolución|Resolucion|Código|Codigo|Venezuela|Decreto|Gaceta|Oficio|Partidas?)/i.test(rankAndName)) {
          continue;
        }

        if (!this.esCedulaValida(cedulaSucia)) continue;

        const { grado, nombre } = this.separarGradoYNombre(rankAndName);
        if (!nombre) continue;

        const cargo = cargoPost ? `${grado} ${cargoPost}` : grado;
        const ubicacion = cargoPost || grado;

        const cedula = cedulaSucia.replace(/\./g, "").trim();

        resultados.push({
          nombre,
          cedula,
          cargo,
          ubicacion,
        });
      }
    }

    return resultados;
  }

  /**
   * Helper que separa inteligentemente Grado/Rango del Nombre del Oficial (Nueva funcionalidad añadida).
   * Maneja rangos compuestos (ej. Sargento Supervisor, Sargento Ayudante, Sargento Mayor de Primera, etc.),
   * prefijos (Ciudadano, al, del) y diferencias de mayúsculas/minúsculas.
   */
  public separarGradoYNombre(textoRaw: string): { grado: string; nombre: string } {
    if (!textoRaw) return { grado: "S/G", nombre: "" };

    // 1. Limpiar prefijos conocidos (al, del, a la, de la, ciudadano, ciudadana, guiones, viñetas)
    let limpio = textoRaw
      .replace(/^[\s\-*•–]+/, "")
      .replace(/^(?:al?\s+(?:ciudadano\s+|ciudadana\s+)?|del?\s+(?:la\s+)?(?:ciudadano\s+|ciudadana\s+)?|ciudadano\s+|ciudadana\s+)/i, "")
      .trim();

    if (!limpio) return { grado: "S/G", nombre: textoRaw.trim() };

    // 2. Intentar extraer nombre si está en MAYÚSCULAS al final y el grado en Mixto (ej: Sargento Ayudante DAVID ENRIQUE HERMOSO VELASCO)
    const matchMayusculasFinal = limpio.match(/^(.*?)\s+([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})+)$/);
    if (matchMayusculasFinal) {
      const posibleGrado = matchMayusculasFinal[1].trim();
      const posibleNombre = matchMayusculasFinal[2].trim();
      if (posibleGrado.length > 0 && posibleGrado !== posibleGrado.toUpperCase()) {
        return { grado: posibleGrado, nombre: posibleNombre };
      }
    }

    // 3. Lista de rangos militares ordenados de mayor a menor longitud
    const rangosConocidos = [
      "SARGENTO MAYOR DE PRIMERA",
      "SARGENTO MAYOR DE SEGUNDA",
      "SARGENTO MAYOR DE TERCERA",
      "SARGENTO SUPERVISOR",
      "SARGENTO AYUDANTE",
      "SARGENTO PRIMERO",
      "SARGENTO SEGUNDO",
      "GENERAL DE DIVISION",
      "GENERAL DE BRIGADA",
      "GENERAL EN JEFE",
      "MAYOR GENERAL",
      "ALMIRANTE EN JEFE",
      "VICEALMIRANTE",
      "CONTRALMIRANTE",
      "TENIENTE CORONEL",
      "CAPITAN DE NAVIO",
      "CAPITAN DE FRAGATA",
      "CAPITAN DE CORBETA",
      "PRIMER TENIENTE",
      "TENIENTE DE NAVIO",
      "TENIENTE DE FRAGATA",
      "ALFEREZ DE NAVIO",
      "MAESTRE PRINCIPAL",
      "MAESTRE TECNICO",
      "MAESTRE MAYOR",
      "MAESTRE DE PRIMERA",
      "MAESTRE DE SEGUNDA",
      "MAESTRE DE TERCERA",
      "TROPA PROFESIONAL",
      "TROPA ALISTADA",
      "CORONEL",
      "CAPITAN",
      "TENIENTE",
      "SARGENTO",
      "MAESTRE",
      "MAYOR",
      "CADETE",
      "ALUMNO",
      "OFICIAL"
    ];

    const limpioUpper = this.normalizarAsunto(limpio);
    for (const rango of rangosConocidos) {
      if (limpioUpper.startsWith(rango)) {
        const len = rango.length;
        const grado = limpio.substring(0, len).trim();
        const nombre = limpio.substring(len).replace(/^[\s,:-]+/, "").trim();
        if (nombre.length > 0) {
          return { grado, nombre };
        }
      }
    }

    // 4. Si la cadena tiene nombre en mayúsculas al final (ej: "Sargento Supervisor INGEL RAFAEL ARANGUREN PERDOMO")
    const matchNombreUpper = limpio.match(/[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})+$/);
    if (matchNombreUpper) {
      const nombre = matchNombreUpper[0].trim();
      const grado = limpio.replace(nombre, "").replace(/[\s,:-]+$/, "").trim() || "S/G";
      return { grado, nombre };
    }

    // 5. Fallback por número de palabras (si tiene 3 o más palabras, las últimas 2 o 3 son el nombre)
    const palabras = limpio.split(/\s+/);
    if (palabras.length >= 3) {
      const nombre = palabras.slice(-2).join(" ");
      const grado = palabras.slice(0, -2).join(" ");
      return { grado, nombre };
    }

    return { grado: "S/G", nombre: limpio };
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

  /**
   * Valida si la cadena extraída corresponde a una Cédula de Identidad venezolana real.
   * Omite explícitamente números de resolución (ej. 001151), códigos (ej. 04516), partidas (4.02)
   * y números/cantidades pequeñas (ej. limitantes a 43.238).
   */
  public esCedulaValida(cedulaStr: string): boolean {
    if (!cedulaStr) return false;
    const clean = cedulaStr.replace(/\./g, "").trim();
    if (!/^\d{6,9}$/.test(clean)) {
      return false;
    }
    const val = parseInt(clean, 10);
    // Cédulas venezolanas válidas están en el rango de 500.000 a 100.000.000 (val >= 100000)
    // Esto excluye códigos como 04516 (4516), 001151 (1151) y limitantes como 43.238 (43238).
    if (isNaN(val) || val < 100000 || val > 100000000) {
      return false;
    }
    return true;
  }
}

