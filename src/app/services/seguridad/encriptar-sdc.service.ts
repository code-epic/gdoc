import { Injectable } from "@angular/core";
import { Md5 } from "md5-typescript";

/**
 * Servicio / Utilidad EncriptarSDC
 * Emula de forma idéntica la lógica de cifrado de Sandra en Go:
 *
 * func (R *Rot) encrypt(r rune) rune {
 *     isLowerCase := r >= 'a' && r <= 'z'
 *     isUpperCase := r >= 'A' && r <= 'Z'
 *     if isLowerCase {
 *         if r >= 'm' { return r - 13 } else { return r + 13 }
 *     } else if isUpperCase {
 *         if r >= 'M' { return r - 13 } else { return r + 13 }
 *     }
 *     return r
 * }
 *
 * func GCodeEncrypt(text string) string {
 *     extension := ""
 *     s := strings.Split(text, ".")
 *     if len(s) > 1 {
 *         extension = "." + s[len(s)-1]
 *     }
 *     return GenerarMD5(GenerarROT13(text)) + extension
 * }
 */
@Injectable({
  providedIn: "root",
})
export class EncriptarSDC {
  constructor() {}

  /**
   * Genera el cifrado ROT13 emulando exactamente la implementación Go:
   * Si letra mayúscula: r >= 'M' ? r - 13 : r + 13
   * Si letra minúscula: r >= 'm' ? r - 13 : r + 13
   * Demás caracteres se mantienen iguales.
   *
   * @param text Texto de entrada a transformar
   * @returns Texto cifrado con el algoritmo Rot de Go
   */
  public static GenerarROT13(text: string): string {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (char >= "a" && char <= "z") {
        if (char >= "m") {
          result += String.fromCharCode(code - 13);
        } else {
          result += String.fromCharCode(code + 13);
        }
      } else if (char >= "A" && char <= "Z") {
        if (char >= "M") {
          result += String.fromCharCode(code - 13);
        } else {
          result += String.fromCharCode(code + 13);
        }
      } else {
        result += char;
      }
    }
    return result;
  }

  /**
   * Genera el hash MD5 en formato hexadecimal a partir de un texto.
   *
   * @param text Texto de entrada
   * @returns Hash MD5 en minúsculas (32 caracteres)
   */
  public static GenerarMD5(text: string): string {
    if (!text) return "";
    return Md5.init(text);
  }

  /**
   * Emulación de la función Go GCodeEncrypt.
   * Extrae la extensión si existe, aplica ROT13 (Go version) al texto completo,
   * calcula el hash MD5 y concatena la extensión original.
   *
   * @param text Nombre de archivo o texto a encriptar
   * @returns Hash MD5(ROT13(text)) + extensión original si existía
   */
  public static GCodeEncrypt(text: string): string {
    if (!text) return "";
    let extension = "";
    const s = text.split(".");
    if (s.length > 1) {
      extension = "." + s[s.length - 1];
    }
    return EncriptarSDC.GenerarMD5(EncriptarSDC.GenerarROT13(text)) + extension;
  }

  // ─── Métodos de instancia para inyección de dependencias en Angular ────────────
  public GCodeEncrypt(text: string): string {
    return EncriptarSDC.GCodeEncrypt(text);
  }

  public GenerarROT13(text: string): string {
    return EncriptarSDC.GenerarROT13(text);
  }

  public GenerarMD5(text: string): string {
    return EncriptarSDC.GenerarMD5(text);
  }
}
