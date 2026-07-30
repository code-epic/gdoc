---
name: resolucion_format
description: Reglas estrictas de formato y estilo para la generación de Resoluciones Ministeriales (MPPD).
---

# M. RESOLUCIÓN

Es el acto administrativo de rango sublegal mediante el cual el Ministro del Poder Popular para la Defensa, dicta decisiones de carácter general o particular por disposición del Presidente de la República o por disposición especifica de la ley.

Este instrumento es elaborado por la Dirección General del Despacho, para su presentación y suscripción por parte de la máxima autoridad administrativa.

## Instrucciones para su elaboración (Reglas de Diseño y Formato)

La Resolución tendrá la siguiente estructura estricta. **Debes aplicar estas medidas exactas tanto en HTML/CSS como en la generación de PDFs desde Golang.**

### 1. Encabezamiento

Comprende el membrete, lugar y fecha de publicación, data de la Independencia, Federación y Revolución, así como la palabra "RESOLUCIÓN" y el número.

**a. Membrete:**
- **Posición**: Se deberá escribir a dos punto cinco centímetros (2.5 cm) del borde superior de la página.
- **Alineación**: Centrado.
- **Interlineado**: Sencillo (line-height: 1).
- **Fuente**: Letra Tahoma, tamaño N° 13 (13pt).
- **Estilo**: Mayúscula y negrita (bold).
- **Contenido**:
  ```
  REPÚBLICA BOLIVARIANA DE VENEZUELA
  MINISTERIO DEL PODER POPULAR PARA LA DEFENSA
  DESPACHO DEL MINISTRO
  ```

**b. Lugar y fecha de publicación:**
- **Posición**: A partir de una (01) línea debajo del membrete.
- **Alineación**: Izquierda.
- **Formato**: Mismas reglas de tamaño y tipo de letra del membrete (Tahoma 13, Negrita).
- **Contenido**: `Caracas, día mes año` (ej. Caracas, 30 JUL 2026).

**c. Data de la Independencia, Federación y Revolución:**
- **Posición**: Debajo del lugar y fecha de publicación.
- **Alineación**: Derecha.
- **Formato**: Mismas reglas de tamaño y tipo (Tahoma 13, Negrita).
- **Contenido**: `215°, 166° y 27°`

**d. Denominación:**
- **Posición**: En el centro de la hoja, a una (01) línea debajo de la data de la Independencia.
- **Formato**: Mismas reglas de tamaño y tipo (Tahoma 13, Negrita).
- **Contenido**: `RESOLUCIÓN N° [Número]`

### 2. Basamento Legal

Se incluye la identificación del Ministro, su nombramiento, y normas facultativas.
- **Posición**: A una (01) línea debajo de la palabra "RESOLUCIÓN".
- **Fuente**: Tahoma N° 13.
- **Alineación**: Justificado.
- **Interlineado**: 1.15.

Seguidamente, a una (01) línea debajo del basamento legal se escribirá la palabra:
- **Contenido**: `RESUELVE`
- **Estilo**: Mayúscula y negrilla (Tahoma 13, Bold).
- **Alineación**: Centrado.

### 3. Cuerpo

En este espacio se coloca la decisión adoptada (ascensos, nombramientos, etc.).
- **Fuente**: Tahoma N° 13.
- **Alineación**: Justificado.
- **Interlineado**: 1.15.

### 4. Término y Firmas

- **Comuníquese y publíquese:**
  - **Posición vertical**: A cuatro (04) líneas debajo de la última línea del cuerpo.
  - **Posición horizontal**: Comenzando a un centímetro (1 cm) del margen izquierdo.
  
- **Por el Ejecutivo Nacional:**
  - **Posición vertical**: Inmediatamente a una (01) línea debajo de "Comuníquese y publíquese".
  - **Posición horizontal**: Comenzando a uno punto cinco centímetros (1.5 cm) del margen izquierdo.

- **Firma de la Autoridad Administrativa:**
  - **Posición vertical**: A dos (02) líneas debajo de las palabras "Por el Ejecutivo Nacional".
  - **Alineación**: Alineada al margen derecho de la hoja, pero con sus textos internos centrados respecto a sí misma (estilo bloque de firma).
  - **Formato**: Mismas reglas del membrete (Tahoma 13, Negrita).
  - **Contenido**:
    - Nombre del firmante en negrita.
    - Rango en negrita.
    - Cargo en negrita (dividido en 2 líneas: `Ministerio del Poder Popular \n para la Defensa`).

- **Iniciales del Redactor:**
  - En la esquina inferior izquierda del documento.
