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

  extraerDatosMilitar(contenidoHtml: string): Oficial[] {
    const resultados: Oficial[] = [];
    const pilaJerarquia: NodoJerarquia[] = [];

    // Regex para atrapar todo el contenido dentro de las etiquetas <p>...</p>
    const regexParrafo = /<p[^>]*>(.*?)<\/p>/gis;
    // Variables de jerarquía
    let matchParrafo;

    // 1. Iterar sobre cada párrafo del HTML
    while ((matchParrafo = regexParrafo.exec(contenidoHtml)) !== null) {
      const pTagCompleto = matchParrafo[0];
      const pContenido = matchParrafo[1];

      // Limpiar el texto: quitar etiquetas HTML (como <u>, <b>, <span>), entidades (&nbsp;) y espacios extra
      const textoLimpio = pContenido
        .replace(/<[^>]+>/g, "") // Elimina cualquier etiqueta HTML interna
        .replace(/&nbsp;/g, " ") // Reemplaza espacios non-breaking
        .replace(/\s+/g, " ") // Normaliza múltiples espacios
        .trim();

      if (!textoLimpio || textoLimpio === "-") continue;

      // 2. Extraer la tabulación (margin-left) para calcular la profundidad
      let profundidad = 0;
      const matchMargen = pTagCompleto.match(/margin-left:\s*([\d.]+)(cm|pt)/i);

      let margenPt = 0;
      if (matchMargen) {
        const valor = parseFloat(matchMargen[1]);
        const unidad = matchMargen[2].toLowerCase();
        // Convertir cm a pt (1 cm ≈ 28.3465 pt) para tener una escala universal
        margenPt = unidad === "cm" ? valor * 28.3465 : valor;
      }

      // Lógica avanzada para determinar jerarquías cuando el margen es 0
      // Usamos el formato (Negrita, Mayúsculas) para diferenciar los niveles base
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

      // 3. Regex para detectar si el párrafo contiene una Cédula y Cargo
      // Busca variaciones de "C.I. N°", atrapa los números con puntos, y luego atrapa el texto hasta la coma.
      const regexPersona = /([^,]+),\s*(?:C\.I\.\s*N[°º]?|C\.I\.|N[°º])\s*([\d\.]+)\s*,\s*([^,]+)/i;
      const matchPersona = textoLimpio.match(regexPersona);

      if (matchPersona) {
        // Es una persona: Extraemos y limpiamos datos
        const nombreRaw = matchPersona[1];
        const nombreMatches = nombreRaw.match(/[A-ZÁÉÍÓÚÑ\s]+$/);
        const nombre = nombreMatches ? nombreMatches[0].trim() : nombreRaw.trim();

        const cedulaSucia = matchPersona[2];
        const cedula = cedulaSucia.replace(/\./g, ""); // Quita los puntos
        
        // Limpiamos el cargo hasta la primera coma (si el regex capturó de más) o quitamos el "p/v."
        let cargo = matchPersona[3].trim(); 
        if (cargo.includes(',')) {
           cargo = cargo.substring(0, cargo.indexOf(',')).trim();
        } else if (cargo.toLowerCase().endsWith('p/v.')) {
           cargo = cargo.substring(0, cargo.length - 4).trim();
        }

        // 4. Construir la ubicación leyendo la pila (stack) en reversa
        const rutaDependencias = pilaJerarquia
          .map((nodo) => nodo.texto)
          .reverse()
          .join(", ");

        const ubicacion = `${cargo} de ${rutaDependencias}`;

        resultados.push({ nombre, cedula, cargo, ubicacion });
      } else {
        // Es un nodo de jerarquía (Dependencia, Batallón, Sección, etc.)

        // 5. Eliminar de la pila los nodos que estén al mismo nivel o más profundos
        // Esto simula que estamos entrando a una nueva rama del árbol organizacional
        while (
          pilaJerarquia.length > 0 &&
          pilaJerarquia[pilaJerarquia.length - 1].profundidad >= profundidad
        ) {
          pilaJerarquia.pop();
        }

        // Ignorar párrafos misceláneos que no son dependencias organizacionales
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
}
