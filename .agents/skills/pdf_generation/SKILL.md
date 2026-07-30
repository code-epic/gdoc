---
name: PDF Generation Architecture
description: Patrón de diseño para generar y visualizar documentos estilo A4 (Pixel-Perfect) antes de su exportación a PDF.
---

# PDF Generation Architecture (Document Canvas)

## Objetivo
Estandarizar la visualización y edición de documentos oficiales simulando el entorno físico (hoja A4). Este diseño facilita la integración posterior con motores de renderizado backend (ej. wkhtmltopdf, LaTeX, Typst) al garantizar que la vista HTML es métricamente idéntica al resultado esperado.

## Reglas de Implementación (SCSS)
1. **El Canvas A4**: El contenedor principal debe medir exactamente `210mm` x `297mm` (con un min-height para permitir que el contenido fluya).
2. **Márgenes Exactos**: Los márgenes internos deben respetar las normas documentales. Ejemplo: `padding: 30mm 20mm 30mm 25mm;`.
3. **Métricas de Impresión**: Utiliza siempre unidades absolutas de impresión (`mm`, `pt`) en lugar de unidades relativas (`px`, `em`) para elementos que deben ser consistentes en el PDF.
4. **Capas y Z-Index**:
    - Las firmas y sellos deben posicionarse de forma absoluta (`position: absolute`) en relación con un contenedor relativo (ej. `footer`).
    - **Sello húmedo**: Z-Index 1, ligeramente translúcido.
    - **Firma**: Z-Index 2.

## Componente (Angular)
- Usa el nombre de la clase `.a4-canvas` en el envoltorio principal.
- Separa semánticamente el documento en `<header>`, `<main>` y `<footer>`.
- En caso de habilitar edición, usa delimitadores como `.editable-zone` y emite eventos hacia el componente padre en lugar de mezclar la lógica de edición pesada dentro del mismo canvas.
