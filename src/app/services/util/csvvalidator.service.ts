import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface ValidationError {
  type: string;
  text: string;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CsvValidatorService {

  private readonly SPECIAL_CHARS_REGEX = /^[a-zA-Z0-9\s\-_.]+$/;

  /**
   * Valida un archivo CSV como Observable.
   * @param file Archivo a validar
   * @returns Observable que emite { isValid, errors }
   */
  validate(file: File): Observable<{ isValid: boolean; errors: ValidationError[] }> {
    // 1. Validar extensión sincrónicamente
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return of({
        isValid: false,
        errors: [{
          type: 'error',
          text: 'Formato de archivo inválido.',
          recommendations: ['Asegúrate de que el archivo sea de tipo CSV (.csv).']
        }]
      });
    }

    // 2. Leer archivo como Observable<string>
    return this.readFileAsText(file).pipe(
      map(content => this.validateContent(content)),
      catchError(() =>
        of({
          isValid: false,
          errors: [{
            type: 'error',
            text: 'No se pudo leer el archivo.',
            recommendations: ['Asegúrate de que el archivo no esté corrupto o bloqueado.']
          }]
        })
      )
    );
  }

  /* ------------------------------------------------------------------ */
  /* Lectura reactiva del archivo                                         */
  /* ------------------------------------------------------------------ */
  private readFileAsText(file: File): Observable<string> {
    return new Observable<string>(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        subscriber.next(reader.result as string);
        subscriber.complete();
      };
      reader.onerror = () => subscriber.error(reader.error);
      reader.readAsText(file);

      // Teardown
      return () => reader.abort();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Validación síncrona del contenido                                    */
  /* ------------------------------------------------------------------ */
  private validateContent(content: string): { isValid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];
    const lines = content.split(/\r\n|\n/).filter(l => l.trim() !== '');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const columns = line.split(',');
      const lineNumber = i + 1;

      // Número de columnas
      if (columns.length !== 2) {
        errors.push({
          type: 'error',
          text: `Error en la línea ${lineNumber}: Formato de columnas incorrecto.`,
          recommendations: [
            `La línea ${lineNumber} debe contener exactamente dos columnas separadas por una coma.`,
            'Ejemplo: "valor1,valor2"',
            'Verifica que no haya comas extras o faltantes.'
          ]
        });
        return { isValid: false, errors };
      }

      // Caracteres especiales
      for (let j = 0; j < columns.length; j++) {
        const field = columns[j].trim();
        if (!this.SPECIAL_CHARS_REGEX.test(field)) {
          errors.push({
            type: 'error',
            text: `Error en la línea ${lineNumber}, columna ${j + 1}: Caracteres especiales detectados.`,
            recommendations: [
              `El campo "${field}" contiene caracteres no permitidos.`,
              'Usa solo letras (a-z, A-Z), números (0-9), espacios, guiones (-) y guiones bajos (_).',
              'Evita símbolos como #, $, %, &, *, @, !, ?, etc.'
            ]
          });
          return { isValid: false, errors };
        }
      }
    }

    return { isValid: true, errors: [] };
  }
}