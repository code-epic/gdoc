const fs = require('fs');

let ts = fs.readFileSync('src/app/views/secretaria/sministerial/sministerial.component.ts', 'utf8');
ts = ts.replace(/SministerialComponent/g, 'ScuadroDecisorioComponent');
ts = ts.replace(/app-sministerial/g, 'app-scuadro-decisorio');
ts = ts.replace(/sministerial\.component/g, 'scuadro-decisorio.component');
ts = ts.replace(/estadoActual = 4;/g, 'estadoActual = 17;');

// Simplificar ngOnInit para fijar título a 'Cuadro Decisorio'
ts = ts.replace(/let ruta = this\.rutaActiva\.snapshot\.params\.filtro;[\s\S]*?this\.seleccionNavegacion\(0\);/, `this.titulo = "Cuadro Decisorio";
    this.estadoActual = 17;
    this.estadoOrigen = 2;
    this.seleccionNavegacion(0);`);

fs.writeFileSync('src/app/views/secretaria/scuadro-decisorio/scuadro-decisorio.component.ts', ts);

let html = fs.readFileSync('src/app/views/secretaria/sministerial/sministerial.component.html', 'utf8');
html = html.replace(/MINISTERIAL/g, 'CUADRO DECISORIO');
html = html.replace(/ministerial/g, 'scuadro-decisorio');

fs.writeFileSync('src/app/views/secretaria/scuadro-decisorio/scuadro-decisorio.component.html', html);
