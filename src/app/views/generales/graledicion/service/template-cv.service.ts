import {Inject, Injectable} from '@angular/core';
import {IDatosBasicos} from '../../../../services/resoluciones/resolucion.service';

@Injectable({
    providedIn: 'root'
})
export class TemplateCVService {

    createHtmlSectionForPrint(datosBasicos: any) {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
        <!DOCTYPE html>
<html>
<head>
<title>Presentaci&#243;n de PowerPoint</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<style>
body {padding:0; margin:0; text-align:center; background-color:#777}
.page {margin:5px 0}
.page svg {background-color:#fff}
</style>
</head>
<body>

<div class="page">
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   version="1.1"
   id="svg2"
   width="960"
   height="720"
   viewBox="0 0 960 720"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs6">
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath16">
      <path
         d="M 0,1.2207e-4 H 720 V 540.00012 H 0 Z"
         clip-rule="evenodd"
         id="path14" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath78">
      <path
         d="M 145.56,0 H 276.12 V 99.12 H 145.56 Z"
         clip-rule="evenodd"
         id="path76" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath162">
      <path
         d="m 11.028,393.42 h 107.76 V 529.25 H 11.028 Z"
         clip-rule="evenodd"
         id="path160" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath304">
      <path
         d="m 669,448.68 h 42.48 v 84 H 669 Z"
         clip-rule="evenodd"
         id="path302" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath440">
      <path
         d="m 11.04,342.6 h 64.8 v 84 h -64.8 z"
         clip-rule="evenodd"
         id="path438" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath492">
      <path
         d="m 118.8,324.84 h 131.28 v 84 H 118.8 Z"
         clip-rule="evenodd"
         id="path490" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath512">
      <path
         d="m 250.08,324.84 h 340.68 v 84 H 250.08 Z"
         clip-rule="evenodd"
         id="path510" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath536">
      <path
         d="m 590.76,324.84 h 120.72 v 84 H 590.76 Z"
         clip-rule="evenodd"
         id="path534" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath564">
      <path
         d="M 11.04,256.32 H 118.8 v 168 H 11.04 Z"
         clip-rule="evenodd"
         id="path562" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath576">
      <path
         d="M 11.04,256.32 H 118.8 v 168 H 11.04 Z"
         clip-rule="evenodd"
         id="path574" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath584">
      <path
         d="m 118.8,307.2 h 160.44 v 84 H 118.8 Z"
         clip-rule="evenodd"
         id="path582" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath596">
      <path
         d="m 279.24,307.2 h 88.08 v 84 h -88.08 z"
         clip-rule="evenodd"
         id="path594" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath608">
      <path
         d="m 367.32,307.2 h 131.4 v 84 h -131.4 z"
         clip-rule="evenodd"
         id="path606" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath620">
      <path
         d="m 498.72,307.2 h 92.04 v 84 h -92.04 z"
         clip-rule="evenodd"
         id="path618" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath640">
      <path
         d="m 118.8,289.56 h 160.44 v 84 H 118.8 Z"
         clip-rule="evenodd"
         id="path638" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath652">
      <path
         d="m 279.24,289.56 h 88.08 v 84 h -88.08 z"
         clip-rule="evenodd"
         id="path650" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath664">
      <path
         d="m 367.32,289.56 h 131.4 v 84 h -131.4 z"
         clip-rule="evenodd"
         id="path662" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath676">
      <path
         d="m 498.72,289.56 h 92.04 v 84 h -92.04 z"
         clip-rule="evenodd"
         id="path674" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath688">
      <path
         d="m 590.76,289.56 h 120.72 v 84 H 590.76 Z"
         clip-rule="evenodd"
         id="path686" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath704">
      <path
         d="m 118.8,244.8 h 350.28 v 126 H 118.8 Z"
         clip-rule="evenodd"
         id="path702" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath756">
      <path
         d="m 118.8,244.8 h 350.28 v 126 H 118.8 Z"
         clip-rule="evenodd"
         id="path754" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath768">
      <path
         d="m 118.8,244.8 h 350.28 v 126 H 118.8 Z"
         clip-rule="evenodd"
         id="path766" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath776">
      <path
         d="m 118.8,244.8 h 350.28 v 126 H 118.8 Z"
         clip-rule="evenodd"
         id="path774" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath812">
      <path
         d="m 656.16,191.28 h 55.32 v 168 h -55.32 z"
         clip-rule="evenodd"
         id="path810" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath836">
      <path
         d="M 11.04,145.68 H 118.8 v 189 H 11.04 Z"
         clip-rule="evenodd"
         id="path834" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath856">
      <path
         d="m 118.8,208.68 h 350.28 v 63 H 118.8 Z"
         clip-rule="evenodd"
         id="path854" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath884">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path882" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath900">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path898" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath912">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path910" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath920">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path918" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath932">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path930" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath944">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path942" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath952">
      <path
         d="m 544.56,145.68 h 111.6 v 189 h -111.6 z"
         clip-rule="evenodd"
         id="path950" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath992">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path990" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1092">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1090" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1104">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1102" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1112">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1110" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1192">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1190" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1204">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1202" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1212">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1210" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1272">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1270" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1284">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1282" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1292">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1290" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1368">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1366" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1380">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1378" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1388">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1386" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1460">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1458" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1472">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1470" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1480">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1478" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1540">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1538" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1552">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1550" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1560">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1558" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1632">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1630" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1644">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1642" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1652">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1650" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1732">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1730" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1744">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1742" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1752">
      <path
         d="M 118.8,0 H 711.48 V 447.48 H 118.8 Z"
         clip-rule="evenodd"
         id="path1750" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1812">
      <path
         d="m 11.04,60.48 h 64.8 v 117.6 h -64.8 z"
         clip-rule="evenodd"
         id="path1810" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1824">
      <path
         d="m 11.04,60.48 h 64.8 v 117.6 h -64.8 z"
         clip-rule="evenodd"
         id="path1822" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1840">
      <path
         d="m 11.04,37.8 h 64.8 v 117.6 h -64.8 z"
         clip-rule="evenodd"
         id="path1838" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1852">
      <path
         d="m 11.04,37.8 h 64.8 v 117.6 h -64.8 z"
         clip-rule="evenodd"
         id="path1850" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1868">
      <path
         d="m 11.04,44.52 h 64.8 v 58.8 h -64.8 z"
         clip-rule="evenodd"
         id="path1866" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1880">
      <path
         d="m 75.84,40.32 h 42.96 v 67.2 H 75.84 Z"
         clip-rule="evenodd"
         id="path1878" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1892">
      <path
         d="m 75.84,40.32 h 42.96 v 67.2 H 75.84 Z"
         clip-rule="evenodd"
         id="path1890" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1900">
      <path
         d="m 11.04,0 h 64.8 v 110.04 h -64.8 z"
         clip-rule="evenodd"
         id="path1898" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath1912">
      <path
         d="m 11.04,0 h 64.8 v 110.04 h -64.8 z"
         clip-rule="evenodd"
         id="path1910" />
    </clipPath>
  </defs>
  <g
     id="g8"
     transform="matrix(1.3333333,0,0,-1.3333333,0,720)">
    <g
       id="g10">
      <g
         id="g12"
         clip-path="url(#clipPath16)">
        <path
           d="M 0,6.104e-6 H 720 V 540.00001 H 0 Z"
           style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
           id="path18" />
      </g>
    </g>
    <path
       d="m 3.625,2.625 h 712.75 v 534.75 H 3.625 Z"
       style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path20" />
    <path
       d="M 80.703,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path22" />
    <path
       d="M 145.58,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path24" />
    <path
       d="M 276.13,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path26" />
    <path
       d="M 346.55,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path28" />
    <path
       d="M 409.05,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path30" />
    <path
       d="M 485.8,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path32" />
    <path
       d="M 626.64,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path34" />
    <path
       d="M 10.709,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path36" />
    <path
       d="M 711.53,38.404 V 6.2793"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path38" />
    <path
       d="M 10.209,37.904 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path40" />
    <path
       d="M 10.209,6.7793 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path42" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,25.152,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text46"><tspan
         x="0 4.7880001 8.0279999 12.825 16.542 21.096001 24.687 29.493 31.643999 36.441002 40.994999"
         y="0"
         id="tspan44">Proceso de </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,18.432,15.024)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text50"><tspan
         x="0 5.4000001 8.9910002 12.717 17.271 22.068001 25.659 30.465"
         y="0"
         id="tspan48">Ascenso </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,51.216,15.024)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text54"><tspan
         x="0 2.9790001 8.8559999 12.708 17.271"
         y="0"
         id="tspan52">JUL24</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,87.912,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text58"><tspan
         x="0 6.1110001 14.022 16.533001"
         y="0"
         id="tspan56">OM: </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,106.39,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text62"><tspan
         x="0 5.994 9.1350002 13.797 18.233999 22.914"
         y="0"
         id="tspan60">Orden </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,95.112,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text66"><tspan
         x="0 4.6799998 9.1169996 11.268 18.962999 23.391001 26.532 28.548 31.563"
         y="0"
         id="tspan64">de Mérito</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,152.81,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text70"><tspan
         x="0 5.8769999 8.2799997 12.708 18.108 20.618999"
         y="0"
         id="tspan68">NIEA: </tspan></text>
    <g
       id="g72">
      <g
         id="g74"
         clip-path="url(#clipPath78)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,177.41,25.824)"
           style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text82"><tspan
             x="0 5.7600002 10.548 17.739 19.809 24.471001 28.782 30.816 33.102001 37.782001 39.825001 43.659 45.702 50.013 52.083 54.216 58.896 63.333"
             y="0"
             id="tspan80">Nómina Inicial de </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,176.81,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text86"><tspan
         x="0 4.428 8.4960003 12.807 14.877 19.548 23.858999 27.702 29.745001 34.533001 39.213001"
         y="0"
         id="tspan84">Evaluación </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,218.11,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text90"><tspan
         x="0 4.6799998 8.9910002 12.132 16.443001 18.360001 23.517 27 30.834 35.271 39.951 43.433998"
         y="0"
         id="tspan88">para Ascenso</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,283.39,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text94"><tspan
         x="0 2.9790001 6.849 12.24 14.751"
         y="0"
         id="tspan92">J/A: </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,300.31,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text98"><tspan
         x="0 2.8710001 7.5599999 12.24 15.255 19.566 21.6 26.280001"
         y="0"
         id="tspan96">Junta de</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,293.35,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text102"><tspan
         x="0 5.1570001 9.8369999 12.978 17.396999 21.231001 23.274 27.584999 31.427999 33.471001 38.258999 42.938999"
         y="0"
         id="tspan100">Apreciación </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,353.81,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text106"><tspan
         x="0 2.9790001 6.849 11.88 14.391"
         y="0"
         id="tspan104">J/R: </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,372.29,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text110"><tspan
         x="0 2.8710001 7.5599999 12.24 15.255 19.566"
         y="0"
         id="tspan108">Junta </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,353.81,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text114"><tspan
         x="0 4.6799998 9.1169996 11.268 16.181999 20.618999 24.687 26.757 30.222 32.264999 37.053001"
         y="0"
         id="tspan112">de Revisión</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,416.33,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text118"><tspan
         x="0 2.9790001 6.849 11.628 14.139"
         y="0"
         id="tspan116">J/C: </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,434.45,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text122"><tspan
         x="0 2.8710001 7.5599999 12.24 15.255"
         y="0"
         id="tspan120">Junta</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,432.29,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text126"><tspan
         x="0 4.7969999 9.1079998 11.178 13.203 15.948 18.018 21.825001 26.153999 30.834 35.622002 38.763"
         y="0"
         id="tspan124">Calificadora</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,493.08,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text130"><tspan
         x="0 4.2030001 6.3629999 9.4860001 14.283 18.729 22.445999 24.606001 29.403 34.200001"
         y="0"
         id="tspan128">Situación:</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,534.38,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text134"><tspan
         x="0 4.914 9.3509998 11.385 16.299 20.736 24.57 29.358 36.549 40.994999 45.674999 50.355 54.666 59.355"
         y="0"
         id="tspan132">R= Recomendado</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,533.06,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text138"><tspan
         x="0 5.7600002 10.674 15.111 17.145 22.914 27.702 29.618999 34.533001 38.970001 42.804001 47.591999 54.783001 59.229 63.909 68.588997 72.900002 77.588997"
         y="0"
         id="tspan136">NR= No Recomendado</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,633.94,25.824)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text142"><tspan
         x="0 4.7880001 10.197"
         y="0"
         id="tspan140">PAF</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,648.24,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text146"><tspan
         x="0 2.4119999 4.4460001 9.099 12.24 16.92 21.357 26.037001"
         y="0"
         id="tspan144">: Prueba</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,680.76,25.824)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text150"><tspan
         x="0 4.6799998"
         y="0"
         id="tspan148">de</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,654,15.024)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text154"><tspan
         x="0 5.1570001 9.8369999 12.852 14.877 17.892 22.554001 27.233999 29.628 33.705002 35.748001 39.230999 41.273998 45.108002"
         y="0"
         id="tspan152">Aptitud Física</tspan></text>
    <g
       id="g156">
      <g
         id="g158"
         clip-path="url(#clipPath162)">
        <g
           id="g164"
           transform="matrix(107.76,0,0,135.83,11.028,393.42)">
          <image
             width="1"
             height="1"
             preserveAspectRatio="none"
             transform="matrix(1,0,0,-1,0,1)"
             xlink:href="data:image/png;base64,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"
             id="image166" />
        </g>
      </g>
    </g>
    <path
       d="m 656.19,222.84 h 55.343 v 34.746 H 656.19 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path168" />
    <path
       d="M 75.887,393.92 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path170" />
    <path
       d="M 75.887,131.15 V 39.372"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path172" />
    <path
       d="M 118.79,529.75 V 292.46"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path174" />
    <path
       d="M 118.79,275.78 V 39.372"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path176" />
    <path
       d="M 250.06,529.75 V 357.54"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path178" />
    <path
       d="M 279.29,358.54 V 322.16"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path180" />
    <path
       d="M 367.37,358.54 V 322.16"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path182" />
    <path
       d="M 449.31,529.75 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path184" />
    <path
       d="M 469.08,323.16 V 152.85"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path186" />
    <path
       d="M 498.76,500.05 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path188" />
    <path
       d="M 498.76,358.54 V 322.16"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path190" />
    <path
       d="M 544.55,500.05 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path192" />
    <path
       d="M 544.55,293.46 V 152.85"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path194" />
    <path
       d="M 590.72,529.75 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path196" />
    <path
       d="M 590.72,358.54 V 322.16"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path198" />
    <path
       d="M 656.19,293.46 V 152.85"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path200" />
    <path
       d="M 669.05,500.05 V 375.23"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path202" />
    <path
       d="M 118.29,499.55 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path204" />
    <path
       d="M 118.29,481.86 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path206" />
    <path
       d="M 118.29,464.17 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path208" />
    <path
       d="M 118.29,446.48 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path210" />
    <path
       d="M 118.29,428.8 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path212" />
    <path
       d="M 118.29,411.11 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path214" />
    <path
       d="M 10.528,393.42 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path216" />
    <path
       d="M 10.528,375.73 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path218" />
    <path
       d="M 10.528,358.04 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path220" />
    <path
       d="M 118.29,340.35 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path222" />
    <path
       d="M 10.528,322.66 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path224" />
    <path
       d="M 10.528,292.96 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path226" />
    <path
       d="M 10.528,275.28 H 469.58"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path228" />
    <path
       d="M 10.528,257.59 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path230" />
    <path
       d="M 10.528,222.84 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path232" />
    <path
       d="M 10.528,188.1 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path234" />
    <path
       d="M 10.528,153.35 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path236" />
    <path
       d="M 10.528,130.65 H 119.29"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path238" />
    <path
       d="M 10.528,107.95 H 119.29"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path240" />
    <path
       d="M 10.528,85.25 H 119.29"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path242" />
    <path
       d="M 10.528,62.55 H 119.29"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path244" />
    <path
       d="M 11.028,529.75 V 39.372"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path246" />
    <path
       d="M 711.53,529.75 V 39.372"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path248" />
    <path
       d="M 10.528,529.25 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path250" />
    <path
       d="M 10.528,39.872 H 712.03"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
       id="path252" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,511.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text256"><tspan
         x="0 6.5935202 13.32648 22.061399 27.688801 33.3162 38.11692 42.798119 45.188519 50.367722 54.899521 60.895439 66.19416 70.97496 75.188042 79.401123 82.010643 88.255562 94.988518"
         y="0"
         id="tspan254">NOMBRES Y APELLIDOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,511.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text260"><tspan
         x="0 3.11748 9.7110004 15.47784 21.951839 28.42584 30.93576 35.855999 41.264278 43.644718 52.160519 57.927361 63.33564 65.845558 71.612396 73.763763 79.181999 85.77552 92.120041 98.82312 105.21744 110.1078 114.90852 119.70924 122.21916 130.73495 136.5018 142.14912 147.91595 153.32423 158.20464"
         y="0"
         id="tspan258">${datosBasicos.nombres}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,480.48,517.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text264"><tspan
         x="0 6.7329602 12.34044 18.61524 23.39604 29.989559 32.379959 38.624882 43.425598 45.676559 54.451321 59.252041 64.87944 67.538757 72.468964"
         y="0"
         id="tspan262">ORDEN DE MÉRITO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,498.36,505.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text268"><tspan
         x="0 5.9959202 10.67712 15.94596 20.756639 27.350161 32.031361 38.76432"
         y="0"
         id="tspan266">ASCENSOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,624.02,517.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text272"><tspan
         x="0 5.6273999 10.42812 15.10932 21.613199 25.78644 30.71664 36.702599 42.947521 49.680481"
         y="0"
         id="tspan270">RESULTADOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,617.3,505.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text276"><tspan
         x="0 6.2449198 11.04564 13.2966 18.127199 24.013559 30.00948 34.222561 40.6866 46.682522 51.951359 54.61068 61.343639"
         y="0"
         id="tspan274">DE EVALUACIÓN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,487.34)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text280"><tspan
         x="0 5.2688398 10.07952 16.32444 22.82832 27.00156 32.997478 35.387878 41.632801 46.433521 48.684479 51.3438 57.618599 62.389439 68.982964 73.913162 76.572479 82.787521 88.78344 95.028358"
         y="0"
         id="tspan278">CÉDULA DE IDENTIDAD </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,487.34)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text284"><tspan
         x="0 5.0497198 10.09944 12.60936 17.659081 22.708799 27.718679 30.2286 35.27832 40.328041"
         y="0"
         id="tspan282">${datosBasicos.cedula}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,467.14,487.34)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text288"><tspan
         x="0 5.2688398 11.3046"
         y="0"
         id="tspan286">CA.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,600.02,487.34)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text292"><tspan
         x="0 5.2987199 11.76276 18.356279 23.28648 29.27244 32.509441 37.310162 39.82008 46.413601 49.072922 53.853722"
         y="0"
         id="tspan290">PUNTAJE NIEA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,676.46,487.34)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text296"><tspan
         x="0 5.0497198 10.09944 12.58944 17.63916 22.688881"
         y="0"
         id="tspan294">${datosBasicos.inea}</tspan></text>
    <g
       id="g298">
      <g
         id="g300"
         clip-path="url(#clipPath304)" />
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,469.63)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text308"><tspan
         x="0 6.3445201 12.61932 19.322399 23.63508 28.903919 34.939678"
         y="0"
         id="tspan306">GDO/CAT</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,469.63)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text312"><tspan
         x="0 5.3086801 10.5576 13.06752 15.46788 21.23472 25.80636 28.31628 36.832081 39.341999 43.5252 49.292042 55.417439"
         y="0"
         id="tspan310">${datosBasicos.gdo_cat}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,466.9,469.63)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text316"><tspan
         x="0 5.2688398 11.87232"
         y="0"
         id="tspan314">CN.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,611.06,469.63)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text320"><tspan
         x="0 6.7199602"
         y="0"
         id="tspan318">OM</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,628.82,469.63)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text324"><tspan
         x="0 6.5935202 9.25284 14.03364"
         y="0"
         id="tspan322">NIEA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,683.45,469.63)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text328"><tspan
         x="0 5.04 8.8748398"
         y="0"
         id="tspan326">1/2</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,451.94)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text332"><tspan
         x="0 5.9959202 12.58944 19.322399 23.993641 26.384041 32.62896 37.42968 39.680641 44.39172 49.19244 54.819839 60.7062 63.36552 68.634361 71.263802"
         y="0"
         id="tspan330">AÑOS DE SERVICIO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,451.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text336"><tspan
         x="0 5.0497198 10.09944 12.46992 18.236759 24.7008 31.294319"
         y="0"
         id="tspan334">${datosBasicos.anio_servicio}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,467.86,451.94)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text340"><tspan
         x="0 5.2688398 9.8404799"
         y="0"
         id="tspan338">CF.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,614.3,451.94)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text344"><tspan
         x="0 6.7329602 15.46788 17.71884 21.0156 25.298401"
         y="0"
         id="tspan342">OM J/A</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,683.45,451.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text348"><tspan
         x="0 5.04 8.8748398"
         y="0"
         id="tspan346">1/2</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,434.26)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text352"><tspan
         x="0 4.9302001 7.58952 12.36036 21.1152 26.413919 33.117001 35.626919 40.427639 47.02116 49.272121 54.102718 58.3158 60.696239 67.040756 72.68808 78.683998 84.928917"
         y="0"
         id="tspan350">TIEMPO EN EL GRADO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,434.26)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text356"><tspan
         x="0 5.0497198 7.3006802 13.06752 19.551479 26.145 30.71664"
         y="0"
         id="tspan354">${datosBasicos.tiempo_grado}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,467.5,434.26)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text360"><tspan
         x="0 5.2800398 10.56008"
         y="0"
         id="tspan358">CC.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,514.7,434.26)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text364"><tspan
         x="0 5.04 8.8748398"
         y="0"
         id="tspan362">${ datosBasicos.cc_orden }</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,555.89,434.26)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text368"><tspan
         x="0 3.11748 9.4819202 13.66512 18.71484"
         y="0"
         id="tspan366">${ datosBasicos.cc_orden_anio }</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,614.42,434.26)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text372"><tspan
         x="0 6.7329602 15.46788 17.71884 21.0156 25.298401"
         y="0"
         id="tspan370">OM J/R</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,683.45,434.26)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text376"><tspan
         x="0 5.04 8.8748398"
         y="0"
         id="tspan374">${datosBasicos.om_jr}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,416.57)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text380"><tspan
         x="0 4.8007202 9.4819202 14.78064 19.56144 24.83028 27.489599 33.485519 37.698601 40.328041 46.57296 52.568878"
         y="0"
         id="tspan378">ESPECIALIDAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,416.57)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text384"><tspan
         x="0 4.57164 9.4719601 14.88024 20.527559 23.037479 28.31628 30.8262 37.41972 41.99136 44.38176 47.399639 53.99316 60.118561 66.712082 73.176117 77.976837 84.570358 88.753563 95.347076 101.63184 104.14176 109.9086"
         y="0"
         id="tspan382">${datosBasicos.especialidad}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,467.02,416.57)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text388"><tspan
         x="0 4.9302001 11.49384"
         y="0"
         id="tspan386">TN.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,512.18,416.57)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text392"><tspan
         x="0 5.04 8.8748398 13.91484"
         y="0"
         id="tspan390">${datosBasicos.tn_orden}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,555.89,416.57)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text396"><tspan
         x="0 3.11748 9.4819202 13.66512 18.71484"
         y="0"
         id="tspan394">${datosBasicos.tn_orden_anio}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,614.66,416.57)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text400"><tspan
         x="0 6.7329602 15.46788 17.71884 21.0156 25.298401"
         y="0"
         id="tspan398">OM J/C</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,398.88)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text404"><tspan
         x="0 6.5935202 9.25284 15.1392 19.91004 24.123119 26.503559 31.304279 37.549198 44.053082 49.321918 55.30788 60.238079 62.8974 68.743919"
         y="0"
         id="tspan402">NIVEL EDUCATIVO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,398.88)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text408"><tspan
         x="0 5.1493201 10.5576 15.46788 21.712799 27.12108 32.88792 39.013321 45.606838 47.748241 50.766121 57.359638 63.485039 70.07856 76.542603 81.343323 87.936836 92.120041 98.713562 104.99832 111.59184"
         y="0"
         id="tspan406">${datosBasicos.nivel_education}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,468.1,398.88)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text412"><tspan
         x="0 4.9200001 9.4814396"
         y="0"
         id="tspan410">TF.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,512.18,398.88)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text416"><tspan
         x="0 5.04 8.8748398 13.91484"
         y="0"
         id="tspan414">${datosBasicos.tf_orden}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,555.89,398.88)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text420"><tspan
         x="0 3.11748 9.4819202 13.66512 18.71484"
         y="0"
         id="tspan418">${datosBasicos.tf_orden_anio} </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,606.98,398.88)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text424"><tspan
         x="0 4.6812 7.3405199 12.27072 18.7248 24.72072 29.989559 32.64888 39.38184"
         y="0"
         id="tspan422">SITUACIÓN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,686.38,397.56)"
       style="font-variant:normal;font-weight:bold;font-size:14.04px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text428"><tspan
         x="0"
         y="0"
         id="tspan426">${datosBasicos.situacion}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,18.096,381.17)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text432"><tspan
         x="0 5.2815361 10.902528 17.651712 26.377728 29.043455 31.299841 37.350143 43.9296"
         y="0"
         id="tspan430">PROM. AÑO</tspan></text>
    <g
       id="g434">
      <g
         id="g436"
         clip-path="url(#clipPath440)" />
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,87.288,381.17)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text444"><tspan
         x="0 5.039988 10.079976 15.119964"
         y="0"
         id="tspan442">${datosBasicos.anio_promocion}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,121.66,381.17)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text448"><tspan
         x="0 6.7491841 12.000768 18.749952 24.370943 29.283072 35.762688 42.342144 45.007874 51.237888 57.238274 63.478271 65.984253 72.224258 77.026558 79.282944 85.333244 89.985794 95.267326 100.06963 106.64909 111.37152"
         y="0"
         id="tspan446">OPORTUNIDAD DE ASCENSO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,252.94,381.17)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text452"><tspan
         x="0 5.2815361 10.902528 13.568256 22.294271 27.126528 32.74752"
         y="0"
         id="tspan450">${datosBasicos.oportunidad_ascenso}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,467.74,381.17)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text456"><tspan
         x="0 4.94208 10.223616"
         y="0"
         id="tspan454">TC.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,509.66,381.17)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text460"><tspan
         x="0 5.039988 10.079976 13.9119 18.951887"
         y="0"
         id="tspan458">${datosBasicos.tc_orden}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,555.89,381.17)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text464"><tspan
         x="0 3.1150081 9.4748163 13.668096 18.729984"
         y="0"
         id="tspan462">${datosBasicos.tc_orden_anio}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,621.98,381.17)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text468"><tspan
         x="0 5.2815361 11.28192"
         y="0"
         id="tspan466">PAF</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,682.85,381.17)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text472"><tspan
         x="0 5.039988 10.079976"
         y="0"
         id="tspan470"> ${datosBasicos.paf} </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,30.36,363.48)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text476"><tspan
         x="0"
         y="0"
         id="tspan474">N</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,36.96,363.48)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text480"><tspan
         x="0"
         y="0"
         id="tspan478">°</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,42.6,363.48)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text484"><tspan
         x="0 6.2449198 11.04564 13.43604 18.36624 23.157 27.370081 32.160839 36.732479 43.465439 50.029079"
         y="0"
         id="tspan482">DE TELÉFONO</tspan></text>
    <g
       id="g486">
      <g
         id="g488"
         clip-path="url(#clipPath492)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,363.48)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text496"><tspan
             x="0 5.04 10.08 15.12"
             y="0"
             id="tspan494">${datosBasicos.cod_area}</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,141.82,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text500"><tspan
         x="0"
         y="0"
         id="tspan498">-</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,144.82,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text504"><tspan
         x="0 5.0497198 10.09944 15.22884 20.278561 25.417919 30.56724"
         y="0"
         id="tspan502">${datosBasicos.num_tel}</tspan></text>
    <g
       id="g506">
      <g
         id="g508"
         clip-path="url(#clipPath512)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,252.94,363.48)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text516"><tspan
             x="0 5.2688398 14.03364 20.278561 25.208759"
             y="0"
             id="tspan514">CMDTE</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,285.34,363.48)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text520"><tspan
         x="0 6.2399998"
         y="0"
         id="tspan518">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,298.68,363.48)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text524"><tspan
         x="0 6.50388 13.06752 15.72684 21.9618 27.95772 34.202641 36.951599"
         y="0"
         id="tspan522">UNIDAD: </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,337.92,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text528"><tspan
         x="0 5.3086801 11.03568 13.5456 15.94596 19.06344 25.427879 31.194719 37.65876 40.04916 44.232361 50.825878 55.995121 60.905399 65.566681 67.747917 73.514763 79.749718 86.114159 92.239563"
         y="0"
         id="tspan526">${datosBasicos.cmdt_unidad}</tspan></text>
    <g
       id="g530">
      <g
         id="g532"
         clip-path="url(#clipPath536)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,593.66,363.48)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text540"><tspan
             x="0 4.9302001 9.14328 13.67508 16.42404"
             y="0"
             id="tspan538">TLF: </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,612.5,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text544"><tspan
         x="0 5.04 10.08 15.12"
         y="0"
         id="tspan542">${datosBasicos.comandante_unidad_cod_area}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,632.66,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text548"><tspan
         x="0"
         y="0"
         id="tspan546">-</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,635.66,363.48)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text552"><tspan
         x="0 5.0497198 10.09944 15.22884 20.37816 25.427879 30.56724"
         y="0"
         id="tspan550">${datosBasicos.comandante_unidad_num_tel}</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,45.12,342.96)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text556"><tspan
         x="0 5.6273999 10.42812 16.77264 19.431959 28.17684 32.977558 39.571079"
         y="0"
         id="tspan554">RÉGIMEN </tspan></text>
    <g
       id="g558">
      <g
         id="g560"
         clip-path="url(#clipPath564)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,14.28,330.94)"
           style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text568"><tspan
             x="0 6.2399998 8.9057283 13.558272 18.839808 21.505535 26.75712 30.980352 33.596161 40.175617 46.225922 51.846912 54.472706 61.221889 63.578114 72.324097 74.989822 79.163139 81.828865 86.721024 92.721405 98.3424"
             y="0"
             id="tspan566">DISCIPLINARIO MILITAR:</tspan></text>
      </g>
    </g>
    <g
       id="g570">
      <g
         id="g572"
         clip-path="url(#clipPath576)" />
    </g>
    <g
       id="g578">
      <g
         id="g580"
         clip-path="url(#clipPath584)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,345.79)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text588"><tspan
             x="0 2.6593201 9.2229605 15.10932 19.92 24.6012 29.531401 32.19072 38.53524 44.521198 49.790039 52.44936 59.18232 65.745956 68.275803 74.271721 80.51664 89.271477 91.930801 98.494438 101.15376 105.83496 110.76516 116.37264 122.4084 127.3386 129.95808 135.84444"
             y="0"
             id="tspan586">INVESTIGACIÓN ADMINISTRATIVA</tspan></text>
      </g>
    </g>
    <g
       id="g590">
      <g
         id="g592"
         clip-path="url(#clipPath596)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,282.17,345.79)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text600"><tspan
             x="0 4.6812 7.3405199 38.853958 45.447479 52.180439"
             y="0"
             id="tspan598">SI NO </tspan></text>
      </g>
    </g>
    <g
       id="g602">
      <g
         id="g604"
         clip-path="url(#clipPath608)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,370.27,345.79)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text612"><tspan
             x="0 2.6593201 9.2229605 15.10932 19.92 24.6012 29.531401 32.19072 38.53524 44.521198 49.790039 52.44936 59.18232 65.745956 70.437119 73.674118 80.178001 86.393044 89.052361 94.321198 96.980522 102.95652"
             y="0"
             id="tspan610">INVESTIGACIÓN JUDICIAL</tspan></text>
      </g>
    </g>
    <g
       id="g614">
      <g
         id="g616"
         clip-path="url(#clipPath620)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,501.7,345.79)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text624"><tspan
             x="0 4.6812 7.3405199 38.853958 45.447479 52.180439"
             y="0"
             id="tspan622">SI NO </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,617.54,345.79)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text628"><tspan
         x="0 5.6273999 10.42812 16.77264 19.431959 24.103201 29.0334 34.640881 41.37384"
         y="0"
         id="tspan626">REGISTRO </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,661.46,345.79)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text632"><tspan
         x="0 4.6812 7.3405199 12.5994 19.332359"
         y="0"
         id="tspan630">SIPOL</tspan></text>
    <g
       id="g634">
      <g
         id="g636"
         clip-path="url(#clipPath640)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,328.1)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text644"><tspan
             x="0 2.6593201 9.2229605 15.10932 19.92 24.6012 29.531401 32.19072 38.53524 44.521198 49.790039 52.44936 59.18232 65.745956 68.275803 73.574516 78.355324 84.948837 90.944763 95.157837 97.657799 106.41264 109.07196 113.25516 115.91448 120.84468 126.81072"
             y="0"
             id="tspan642">INVESTIGACIÓN PENAL MILITAR</tspan></text>
      </g>
    </g>
    <g
       id="g646">
      <g
         id="g648"
         clip-path="url(#clipPath652)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,282.17,328.1)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text656"><tspan
             x="0 4.6812 7.3405199 38.853958 45.447479 52.180439"
             y="0"
             id="tspan654">SI NO </tspan></text>
      </g>
    </g>
    <g
       id="g658">
      <g
         id="g660"
         clip-path="url(#clipPath664)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,370.27,328.1)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text668"><tspan
             x="0 3.237 9.74088 12.36036 17.6292 20.288521 27.021481 29.27244 35.308201 40.89576 43.55508 48.355801 53.9832 58.913399"
             y="0"
             id="tspan666">JUICIO ABIERTO</tspan></text>
      </g>
    </g>
    <g
       id="g670">
      <g
         id="g672"
         clip-path="url(#clipPath676)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,501.7,328.1)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text680"><tspan
             x="0 4.6812 7.3405199 38.853958 45.447479 52.180439"
             y="0"
             id="tspan678">SI NO </tspan></text>
      </g>
    </g>
    <g
       id="g682">
      <g
         id="g684"
         clip-path="url(#clipPath688)" />
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,611.66,328.1)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text692"><tspan
         x="0 4.6812 7.3405199 38.853958 45.447479 52.180439"
         y="0"
         id="tspan690">SI NO </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,30.96,304.39)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text696"><tspan
         x="0 5.2815361 11.28192 16.902912 23.26272 30.011904 32.268288 38.278656 43.560192 48.502274 54.961922 60.962303 65.185539"
         y="0"
         id="tspan694">CARGO ACTUAL:</tspan></text>
    <g
       id="g698">
      <g
         id="g700"
         clip-path="url(#clipPath704)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,310.06)"
           style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text708"><tspan
             x="0"
             y="0"
             id="tspan706">A</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,132.82,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text712"><tspan
         x="0 6.6094079 12.000768 18.140928 23.013121"
         y="0"
         id="tspan710">ORDEN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,167.74,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text716"><tspan
         x="0 6.1199598"
         y="0"
         id="tspan714">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,184.18,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text720"><tspan
         x="0 4.1999998"
         y="0"
         id="tspan718">LA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,199.42,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text724"><tspan
         x="0 4.912128 9.4947844 14.27712 20.057856 25.319424 27.835392 34.444801"
         y="0"
         id="tspan722">ESTACIÓN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,245.86,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text728"><tspan
         x="0 5.1617279 10.58304 13.099008 19.548672 24.840193 27.356159 32.517887 38.298622"
         y="0"
         id="tspan726">PRINCIPAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,293.76,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text732"><tspan
         x="0 6.1199598"
         y="0"
         id="tspan730">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,310.2,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text736"><tspan
         x="0 6.2399998 12.599808 18.380545 23.761921 29.902081 35.642879 40.924416 47.533825 52.086529 56.888832 62.669567"
         y="0"
         id="tspan734">GUARDACOSTAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,382.8,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text740"><tspan
         x="0 4.1733122 8.9955835"
         y="0"
         id="tspan738">“TN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,398.3,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text744"><tspan
         x="0"
         y="0"
         id="tspan742">.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,406.22,310.06)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text748"><tspan
         x="0 5.1617279 10.073856 16.214016 21.595392"
         y="0"
         id="tspan746">PEDRO</tspan></text>
    <g
       id="g750">
      <g
         id="g752"
         clip-path="url(#clipPath756)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,439.82,310.06)"
           style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text760"><tspan
             x="0 4.1932802 10.563072 15.844608 21.7152"
             y="0"
             id="tspan758">LUCAS</tspan></text>
      </g>
    </g>
    <g
       id="g762">
      <g
         id="g764"
         clip-path="url(#clipPath768)" />
    </g>
    <g
       id="g770">
      <g
         id="g772"
         clip-path="url(#clipPath776)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,301.03)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text780"><tspan
             x="0 6.36444 11.77272 17.181 19.69092 25.109159 30.846121 36.254398 41.662682"
             y="0"
             id="tspan778">URRIBARRÍ</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,165.82,301.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text784"><tspan
         x="0"
         y="0"
         id="tspan782">”</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,170.02,301.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text788"><tspan
         x="0"
         y="0"
         id="tspan786">.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,546.55,304.39)"
       style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text792"><tspan
         x="0 5.2815361 11.761152 17.382145 22.104576 28.803841 33.486336 35.872513 41.493504 46.315777 52.316158 56.539391 59.155201 63.927551 69.977859 76.197891 82.947075"
         y="0"
         id="tspan790">CURSOS REALIZADOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,202.3,280.7)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text796"><tspan
         x="0 6.50388 10.67712 15.60732 18.26664 26.97168 33.704639 38.415722 40.90572 46.174561 52.21032 57.817799 64.162323 70.895279"
         y="0"
         id="tspan794">ÚLTIMOS CARGOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,478.27,271.85)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text800"><tspan
         x="0 6.50388 13.06752 15.72684 21.9618 27.95772 34.202641 38.51532 43.814041 49.799999 52.45932"
         y="0"
         id="tspan798">UNIDAD/PAÍS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,556.99,271.85)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text804"><tspan
         x="0 6.5935202 13.32648 22.061399 27.688801 33.3162 38.11692 40.367882 46.642681 51.433441 55.646519 58.026958 63.295799 69.799683 75.407158 80.11824"
         y="0"
         id="tspan802">NOMBRE DEL CURSO</tspan></text>
    <g
       id="g806">
      <g
         id="g808"
         clip-path="url(#clipPath812)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,662.26,277.85)"
           style="font-variant:normal;font-weight:bold;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text816"><tspan
             x="0 6.7491841 12.370176 18.600191 23.402496 29.981953 32.388096 38.628098 43.430401"
             y="0"
             id="tspan814">ORDEN DE </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,667.18,265.85)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text820"><tspan
         x="0 8.7747602 13.57548 19.202881 21.8622 26.7924"
         y="0"
         id="tspan818">MÉRITO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,47.76,263.02)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text824"><tspan
         x="0 6.50388 13.06752 15.72684 21.9618 27.95772"
         y="0"
         id="tspan822">UNIDAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,249.29,263.02)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text828"><tspan
         x="0 6.2449198 11.04564 15.72684 20.99568 26.633039 29.29236 34.551239 39.82008 42.479401 49.21236 55.776001 60.09864 62.48904 67.060677 71.85144 77.120277 83.37516"
         y="0"
         id="tspan826">DESCRIPCIÓN/ FECHA</tspan></text>
    <g
       id="g830">
      <g
         id="g832"
         clip-path="url(#clipPath836)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,15.36,246.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text840"><tspan
             x="0 4.9102802 9.4819202 14.27268 20.03952 25.308359 27.818279 34.4118 40.89576 43.28616 48.435478 53.843761 56.35368 62.837639 68.146317 70.656242 75.805557 81.572403 85.7556 88.026482 94.151878 99.0522"
             y="0"
             id="tspan838">ESTACIÓN PRINCIPAL DE </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,31.32,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text844"><tspan
         x="0 6.2449198 12.60936 18.3762 23.784479 29.90988 35.67672 40.92564 47.519161 52.090801 56.881561 62.648399 67.220039"
         y="0"
         id="tspan842">GUARDACOSTAS </tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,35.16,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text848"><tspan
         x="0 4.1931601 12.70896 18.4758 23.884081 29.650921 34.909801 40.67664 43.186562 48.604801 55.198318"
         y="0"
         id="tspan846">“MARACAIBO”</tspan></text>
    <g
       id="g850">
      <g
         id="g852"
         clip-path="url(#clipPath856)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,237.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text860"><tspan
             x="0 3.11748 8.0277596 12.5994 18.36624 20.736719 26.86212 31.76244 35.945641 38.236439 44.003281 49.41156 54.301922 60.06876 62.220119 68.34552 73.245842 75.407158 79.978798 84.87912 90.287399 95.934723 98.444641 103.72344 106.23336 112.82688 117.39852 119.78892 126.03384 130.94412 137.41812 142.3284 147.73668 153.50352 157.68672 162.597 167.16864 169.4196 172.43748 178.20432 184.43929 191.03281 196.08252 201.13223"
             y="0"
             id="tspan858">JEFA DEL ÁREA DE SERVICIOS GENERALES (AGO07 </tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,325.32,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text864"><tspan
         x="0"
         y="0"
         id="tspan862">-</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,330.6,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text868"><tspan
         x="0 5.76684 12.0018 18.59532 23.645041"
         y="0"
         id="tspan866">AGO16</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,359.28,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text872"><tspan
         x="0"
         y="0"
         id="tspan870">)</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,484.03,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text876"><tspan
         x="0 2.5099199 7.43016 12.0018 16.902121 23.49564 28.06728 33.834122 40.2882"
         y="0"
         id="tspan874">IESEOFANB</tspan></text>
    <g
       id="g878">
      <g
         id="g880"
         clip-path="url(#clipPath884)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,547.49,246.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text888"><tspan
             x="0 4.9102802 9.4819202 14.27268 20.03952 26.164921"
             y="0"
             id="tspan886">ESTADO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,590.21,246.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text892"><tspan
         x="0 8.5158005 14.28264 19.083361 25.67688"
         y="0"
         id="tspan890">MAYOR</tspan></text>
    <g
       id="g894">
      <g
         id="g896"
         clip-path="url(#clipPath900)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,631.25,246.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text904"><tspan
             x="0 5.1493201 10.91616 16.32444"
             y="0"
             id="tspan902">PARA</tspan></text>
      </g>
    </g>
    <g
       id="g906">
      <g
         id="g908"
         clip-path="url(#clipPath912)" />
    </g>
    <g
       id="g914">
      <g
         id="g916"
         clip-path="url(#clipPath920)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,547.49,237.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text924"><tspan
             x="0 6.5935202 11.16516 13.67508 18.983761 21.493679 27.350161 31.53336 36.463558"
             y="0"
             id="tspan922">OFICIALES</tspan></text>
      </g>
    </g>
    <g
       id="g926">
      <g
         id="g928"
         clip-path="url(#clipPath932)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,602.09,237.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text936"><tspan
             x="0 5.76684 10.33848 12.8484 21.364201 23.874121 28.05732 33.824162 39.949558 46.672562"
             y="0"
             id="tspan934">ASIMILADOS</tspan></text>
      </g>
    </g>
    <g
       id="g938">
      <g
         id="g940"
         clip-path="url(#clipPath944)" />
    </g>
    <g
       id="g946">
      <g
         id="g948"
         clip-path="url(#clipPath952)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,547.49,228.94)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text956"><tspan
             x="0"
             y="0"
             id="tspan954">N</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,553.97,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text960"><tspan
         x="0"
         y="0"
         id="tspan958">°</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,559.61,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text964"><tspan
         x="0"
         y="0"
         id="tspan962">2</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,566.93,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text968"><tspan
         x="0 3.01788 7.58952 12.46992"
         y="0"
         id="tspan966">(FEB</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,584.81,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text972"><tspan
         x="0 5.04"
         y="0"
         id="tspan970">24</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,594.89,228.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text976"><tspan
         x="0"
         y="0"
         id="tspan974">)</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,672,237.94)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text980"><tspan
         x="0 5.04 10.08 13.91484 18.95484"
         y="0"
         id="tspan978">31/35</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,22.08,138.91)"
       style="font-variant:normal;font-weight:bold;font-size:9px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text984"><tspan
         x="0 6.1110001 10.566 15.588 20.988001 25.191 27.459 31.886999 37.169998 42.57 46.403999 52.280998 57.681 62.469002 64.872002 70.983002 76.860001 81.288002"
         y="0"
         id="tspan982">OTRAS EVALUACIONES</tspan></text>
    <g
       id="g986">
      <g
         id="g988"
         clip-path="url(#clipPath992)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,142.03)"
           style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text996"><tspan
             x="0 5.9959202 11.29464 16.902121 21.712799 26.98164 29.640961 35.636879 40.90572 43.565041 50.298"
             y="0"
             id="tspan994">APRECIACIÓN</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,180.82,142.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1000"><tspan
         x="0 6.474 11.27472 17.987761 22.788481 28.41588 34.4118"
         y="0"
         id="tspan998">GENERAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,219.46,142.03)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1004"><tspan
         x="0"
         y="0"
         id="tspan1002">:</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,224.5,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1008"><tspan
         x="0 6.5935202 11.16516 13.7946 19.182961 21.692881 27.459721"
         y="0"
         id="tspan1006">OFICIAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,258.48,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1012"><tspan
         x="0 5.3086801 11.9022"
         y="0"
         id="tspan1010">CON</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,279.12,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1016"><tspan
         x="0 6.1254001 8.6353197 13.66512 18.973801 21.483721 26.02548 28.5354 33.455639 38.256359"
         y="0"
         id="tspan1014">DIECISIETE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,324.6,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1020"><tspan
         x="0"
         y="0"
         id="tspan1018">(</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,327.6,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1024"><tspan
         x="0 5.1597199"
         y="0"
         id="tspan1022">17</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,337.8,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1028"><tspan
         x="0"
         y="0"
         id="tspan1026">)</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,343.08,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1032"><tspan
         x="0 5.76684 12.23088 18.94392"
         y="0"
         id="tspan1030">AÑOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,368.88,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1036"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1034">EN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,382.56,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1040"><tspan
         x="0 6.36444 12.83844 15.34836 21.473761 27.240601 33.366001 38.266319"
         y="0"
         id="tspan1038">UNIDADES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,427.7,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1044"><tspan
         x="0 6.5935202 11.74284 16.67304 22.08132 27.84816 32.62896 35.138882 40.786201 46.55304"
         y="0"
         id="tspan1042">OPERATIVAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,481.22,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1048"><tspan
         x="0"
         y="0"
         id="tspan1046">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,488.3,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1052"><tspan
         x="0 6.1254001 8.6353197 13.5456 18.85428 21.364201 25.90596 28.41588 33.336121 38.136841"
         y="0"
         id="tspan1050">DIECISIETE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,533.69,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1056"><tspan
         x="0"
         y="0"
         id="tspan1054">(</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,536.81,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1060"><tspan
         x="0 5.04"
         y="0"
         id="tspan1058">17</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,546.89,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1064"><tspan
         x="0"
         y="0"
         id="tspan1062">)</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,552.17,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1068"><tspan
         x="0 5.76684 12.3504 18.94392"
         y="0"
         id="tspan1066">AÑOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,577.97,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1072"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1070">EN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,591.65,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1076"><tspan
         x="0 4.1999998"
         y="0"
         id="tspan1074">LA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,604.01,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1080"><tspan
         x="0 4.9102802 9.4819202 14.63124 19.541519 24.850201 27.360121 33.126961 37.310162 39.82008 45.94548 51.712318"
         y="0"
         id="tspan1078">ESPECIALIDAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,661.85,142.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1084"><tspan
         x="0"
         y="0"
         id="tspan1082">.</tspan></text>
    <g
       id="g1086">
      <g
         id="g1088"
         clip-path="url(#clipPath1092)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,666.65,142.03)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1096"><tspan
             x="0 5.1493201 10.5576 15.46788 20.03952 24.93984 31.413839 36.214561"
             y="0"
             id="tspan1094">PRESENTA</tspan></text>
      </g>
    </g>
    <g
       id="g1098">
      <g
         id="g1100"
         clip-path="url(#clipPath1104)" />
    </g>
    <g
       id="g1106">
      <g
         id="g1108"
         clip-path="url(#clipPath1112)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,131.11)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1116"><tspan
             x="0 5.6473198 10.54764 13.05756 19.541519 24.342239 26.85216 33.445679 38.75436 44.959438"
             y="0"
             id="tspan1114">VEINTIOCHO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,177.58,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1120"><tspan
         x="0"
         y="0"
         id="tspan1118">(</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,180.7,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1124"><tspan
         x="0 5.04"
         y="0"
         id="tspan1122">28</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,190.78,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1128"><tspan
         x="0"
         y="0"
         id="tspan1126">)</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,198.1,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1132"><tspan
         x="0 5.4082799 10.3086 15.61728 22.30044 28.774441 35.48748 40.796162 43.30608 51.82188 54.331799 59.242081 65.71608 70.5168 77.110321"
         y="0"
         id="tspan1130">RECONOCIMIENTOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,284.16,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1136"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1134">EN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,299.88,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1140"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1138">EL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,313.32,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1144"><tspan
         x="0 6.2349601 8.7448797 13.31652 18.117241 24.71076 30.11904 32.62896 38.395802"
         y="0"
         id="tspan1142">HISTORIAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,355.92,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1148"><tspan
         x="0"
         y="0"
         id="tspan1146">.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,362.76,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1152"><tspan
         x="0 4.1831999 10.77672"
         y="0"
         id="tspan1150">LOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,382.56,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1156"><tspan
         x="0 5.3086801 11.9022 18.465839 23.774521 28.654921 33.804241 38.614922 45.327961"
         y="0"
         id="tspan1154">CONCEPTOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,436.82,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1160"><tspan
         x="0 4.9102802 13.42608 15.936 20.746679 23.256599 29.382 35.975521"
         y="0"
         id="tspan1158">EMITIDOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,481.7,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1164"><tspan
         x="0 5.1600199 11.76424"
         y="0"
         id="tspan1162">POR</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,503.18,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1168"><tspan
         x="0 4.57164 10.91616"
         y="0"
         id="tspan1166">SUS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,522.98,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1172"><tspan
         x="0 4.9102802 10.5576 16.32444 20.507641 26.87208 32.63892 38.76432 45.357841 50.766121 55.666439"
         y="0"
         id="tspan1170">EVALUADORES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,587.57,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1176"><tspan
         x="0"
         y="0"
         id="tspan1174">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,596.69,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1180"><tspan
         x="0 5.38836 11.98188 20.497681 26.264521 32.738522 38.863918 44.63076 51.084839 55.885559"
         y="0"
         id="tspan1178">COMANDANTE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,661.85,131.11)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1184"><tspan
         x="0 5.76684 11.14524 15.94596 22.3104 28.07724"
         y="0"
         id="tspan1182">ACTUAL</tspan></text>
    <g
       id="g1186">
      <g
         id="g1188"
         clip-path="url(#clipPath1192)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,698.59,131.11)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1196"><tspan
             x="0 4.3202"
             y="0"
             id="tspan1194">LA</tspan></text>
      </g>
    </g>
    <g
       id="g1198">
      <g
         id="g1200"
         clip-path="url(#clipPath1204)" />
    </g>
    <g
       id="g1206">
      <g
         id="g1208"
         clip-path="url(#clipPath1212)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,120.07)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1216"><tspan
             x="0 5.3086801 11.03568 15.8364 21.702841 25.88604 32.479561 38.76432 44.531158"
             y="0"
             id="tspan1214">CATALOGAN</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,175.78,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1220"><tspan
         x="0 5.3086801 11.9022 20.507641"
         y="0"
         id="tspan1218">COMO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,206.02,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1224"><tspan
         x="0 6.36444 12.83844"
         y="0"
         id="tspan1222">UNA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,227.74,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1228"><tspan
         x="0 4.9102802 10.07952 15.45792 20.3682 24.551399 29.4816 35.955601 40.756321"
         y="0"
         id="tspan1226">EXCELENTE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,276.6,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1232"><tspan
         x="0 5.1493201 10.5576 17.151119 21.722759 26.633039 31.204679 33.7146 40.308121 46.78212 52.548962"
         y="0"
         id="tspan1230">PROFESIONAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,336.48,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1236"><tspan
         x="0 6.7030802 13.0974 15.60732 20.507641"
         y="0"
         id="tspan1234">QUIEN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,366.6,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1240"><tspan
         x="0 6.2399802"
         y="0"
         id="tspan1238">HA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,381.72,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1244"><tspan
         x="0 6.1254001 10.91616 19.431959 26.02548 30.59712 35.397839 40.806122 46.57296 52.69836"
         y="0"
         id="tspan1242">DEMOSTRADO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,444.14,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1248"><tspan
         x="0 4.9102802 10.07952 15.34836 20.25864 25.527479 30.836161 33.346081 40.0392 46.513199 52.280041 56.463242 61.38348"
         y="0"
         id="tspan1246">EXCEPCIONALES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,513.26,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1252"><tspan
         x="0 5.3086801 11.03568 16.184999 21.951839 27.260521 29.770439 35.89584 41.662682 47.758202 52.66848"
         y="0"
         id="tspan1250">CAPACIDADES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,573.65,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1256"><tspan
         x="0 5.1493201 10.91616 16.32444"
         y="0"
         id="tspan1254">PARA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,598.85,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1260"><tspan
         x="0 6.5935202 12.0018 18.236759 24.003599 30.46764 32.977558 37.63884 43.405682 48.813961"
         y="0"
         id="tspan1258">ORGANIZAR,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,653.21,120.07)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1264"><tspan
         x="0 5.1493201 9.3325195 15.09936 21.593281 24.103201 28.674841 31.184759 36.493439 42.260281"
         y="0"
         id="tspan1262">PLANIFICAR</tspan></text>
    <g
       id="g1266">
      <g
         id="g1268"
         clip-path="url(#clipPath1272)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,703.99,120.07)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1276"><tspan
             x="0"
             y="0"
             id="tspan1274">Y</tspan></text>
      </g>
    </g>
    <g
       id="g1278">
      <g
         id="g1280"
         clip-path="url(#clipPath1284)" />
    </g>
    <g
       id="g1286">
      <g
         id="g1288"
         clip-path="url(#clipPath1292)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,109.03)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1296"><tspan
             x="0 4.9102802 8.0277596 12.93804 18.246719 24.69084 29.49156 35.2584"
             y="0"
             id="tspan1294">EJECUTAR</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,165.22,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1300"><tspan
         x="0 4.8007202 10.56756 15.97584 20.866199 26.633039"
         y="0"
         id="tspan1298">TAREAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,199.3,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1304"><tspan
         x="0 5.1493201 10.5576 17.151119 22.30044 24.81036 30.5772"
         y="0"
         id="tspan1302">PROPIAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,237.34,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1308"><tspan
         x="0 6.2403998"
         y="0"
         id="tspan1306">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,251.38,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1312"><tspan
         x="0 4.57164 10.91616"
         y="0"
         id="tspan1310">SUS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,269.76,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1316"><tspan
         x="0 4.57164 11.02572 17.49972 22.808399 25.318319 32.01144 38.485439 43.395721"
         y="0"
         id="tspan1314">FUNCIONES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,317.76,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1320"><tspan
         x="0"
         y="0"
         id="tspan1318">;</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,323.28,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1324"><tspan
         x="0 5.1493201 10.06956 15.47784 23.993641 26.503559 31.31424 33.824162 38.634838 45.108841 51.234241"
         y="0"
         id="tspan1322">PERMITIENDO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,384,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1328"><tspan
         x="0 6.3600202"
         y="0"
         id="tspan1326">UN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,399.74,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1332"><tspan
         x="0 5.76684 11.89224 16.792561 22.10124 28.435801 34.202641 40.328041"
         y="0"
         id="tspan1330">ADECUADO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,449.54,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1336"><tspan
         x="0 8.5158005 14.28264 20.746679 25.77648 29.003519"
         y="0"
         id="tspan1334">MANEJO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,488.06,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1340"><tspan
         x="0 6.5935202 11.74284 16.67304 22.08132 27.84816 32.62896 35.138882 40.786201"
         y="0"
         id="tspan1338">OPERATIVO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,538.37,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1344"><tspan
         x="0 6.1199999"
         y="0"
         id="tspan1342">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,552.29,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1348"><tspan
         x="0 4.1999998"
         y="0"
         id="tspan1346">LA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,565.13,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1352"><tspan
         x="0 6.36444 12.83844 15.34836 21.473761 27.240601 33.366001"
         y="0"
         id="tspan1350">UNIDAD,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,603.89,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1356"><tspan
         x="0 5.76684 10.33848 12.8484 21.364201 23.874121 28.445761 36.961559"
         y="0"
         id="tspan1354">ASIMISMO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,650.33,109.03)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1360"><tspan
         x="0 4.56004"
         y="0"
         id="tspan1358">SU</tspan></text>
    <g
       id="g1362">
      <g
         id="g1364"
         clip-path="url(#clipPath1368)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,664.13,109.03)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1372"><tspan
             x="0 4.9102802 9.5815201 14.15316 20.497681 25.407961 30.81624 35.47752 42.071041"
             y="0"
             id="tspan1370">ESFUERZO,</tspan></text>
      </g>
    </g>
    <g
       id="g1374">
      <g
         id="g1376"
         clip-path="url(#clipPath1380)" />
    </g>
    <g
       id="g1382">
      <g
         id="g1384"
         clip-path="url(#clipPath1388)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,98.088)"
           style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1392"><tspan
             x="0 6.1401601 11.012352 17.152512 19.66848 24.959999 30.740736 36.002304 38.518272 45.127682"
             y="0"
             id="tspan1390">DEDICACIÓN</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,176.98,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1396"><tspan
         x="0"
         y="0"
         id="tspan1394">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,185.38,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1400"><tspan
         x="0 5.1617279 10.58304 17.27232 21.854977 26.727167 31.309824 33.82579 40.4352 46.884865 52.6656 56.978687 59.494656 64.077309 72.583679"
         y="0"
         id="tspan1398">PROFESIONALISMO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,268.2,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1404"><tspan
         x="0 6.2200322 12.000768"
         y="0"
         id="tspan1402">HAN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,290.4,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1408"><tspan
         x="0 5.2815361 11.890944 17.641727 23.871744 28.674047 35.033855 40.694782 46.435585 52.575745"
         y="0"
         id="tspan1406">COADYUVADO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,353.16,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1412"><tspan
         x="0"
         y="0"
         id="tspan1410">A</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,362.64,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1416"><tspan
         x="0 4.1999998"
         y="0"
         id="tspan1414">LA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,376.2,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1420"><tspan
         x="0 5.3913598 12.000768 18.450432 23.033089 28.065023 33.346561 39.816193 45.097729 47.613697 54.223103"
         y="0"
         id="tspan1418">CONSECUCIÓN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,440.54,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1424"><tspan
         x="0 6.1199598"
         y="0"
         id="tspan1422">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,455.18,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1428"><tspan
         x="0 4.1932802 10.912512"
         y="0"
         id="tspan1426">LOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,474.26,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1432"><tspan
         x="0 6.7092481 12.220416 15.335424 20.247553 25.049856 27.565825 33.226753 39.916031"
         y="0"
         id="tspan1430">OBJETIVOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,522.38,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1436"><tspan
         x="0 5.1617279 9.3550081 15.135744 21.705215 26.507521 31.419647 37.200382 43.30061 49.910015"
         y="0"
         id="tspan1434">PLANTEADOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,580.49,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1440"><tspan
         x="0 5.1599979 11.767676"
         y="0"
         id="tspan1438">POR</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,601.37,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1444"><tspan
         x="0 4.1999998"
         y="0"
         id="tspan1442">LA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,614.93,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1448"><tspan
         x="0 4.5826559 10.922496 16.084225 20.996351 26.417664 28.933632 35.543041 40.914433 43.430401 49.57056 55.311359"
         y="0"
         id="tspan1446">SUPERIORIDAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,676.39,98.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1452"><tspan
         x="0"
         y="0"
         id="tspan1450">.</tspan></text>
    <g
       id="g1454">
      <g
         id="g1456"
         clip-path="url(#clipPath1460)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,682.51,98.088)"
           style="font-variant:normal;font-weight:normal;font-size:9.984px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1464"><tspan
             x="0 5.1617279 11.771136 16.323839 21.235968"
             y="0"
             id="tspan1462">POSEE</tspan></text>
      </g>
    </g>
    <g
       id="g1466">
      <g
         id="g1468"
         clip-path="url(#clipPath1472)" />
    </g>
    <g
       id="g1474">
      <g
         id="g1476"
         clip-path="url(#clipPath1480)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,87.048)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1484"><tspan
             x="0 5.76684 9.9500399 14.76072"
             y="0"
             id="tspan1482">ALTO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,145.54,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1488"><tspan
         x="0 4.57164 9.4719601 15.94596 20.746679 23.256599 29.382"
         y="0"
         id="tspan1486">SENTIDO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,183.94,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1492"><tspan
         x="0 6.1199999"
         y="0"
         id="tspan1490">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,197.38,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1496"><tspan
         x="0 5.1493201 10.06956 15.47784 20.2686 25.178881 31.65288 36.56316 43.037159 48.34584 50.855759 56.622601"
         y="0"
         id="tspan1494">PERTENENCIA,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,258.96,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1500"><tspan
         x="0 4.9102802 10.5576 13.06752 19.192921 24.103201 30.5772 35.88588 38.395802 44.16264 50.596802 56.722198"
         y="0"
         id="tspan1498">EVIDENCIANDO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,324.72,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1504"><tspan
         x="0 6.2449198 11.6532 17.42004"
         y="0"
         id="tspan1502">GRAN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,351,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1508"><tspan
         x="0 5.4082799 10.3086 14.88024 20.02956 26.623079 33.09708 37.66872 43.5252 48.943439 51.453362 55.636559 58.146481 64.271881 70.038719"
         y="0"
         id="tspan1506">RESPONSABILIDAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,429.62,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1512"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1510">EN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,443.42,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1516"><tspan
         x="0 4.1831999 10.06956"
         y="0"
         id="tspan1514">LAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,460.46,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1520"><tspan
         x="0 5.76684 11.14524 15.94596 18.575399 24.222719 26.732639 32.85804 38.624882 44.750278 49.64064"
         y="0"
         id="tspan1518">ACTIVIDADES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,517.1,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1524"><tspan
         x="0 6.5935202 11.74284 16.67304 22.08132 27.84816 33.117001 35.626919 42.22044 48.704399 54.471241 58.654442 63.57468"
         y="0"
         id="tspan1522">OPERACIONALES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,587.69,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1528"><tspan
         x="0 5.1493201 10.5576 17.151119 22.30044 24.81036 30.5772"
         y="0"
         id="tspan1526">PROPIAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,625.25,87.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1532"><tspan
         x="0 6.1199999"
         y="0"
         id="tspan1530">DE</tspan></text>
    <g
       id="g1534">
      <g
         id="g1536"
         clip-path="url(#clipPath1540)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,638.69,87.048)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1544"><tspan
             x="0 6.2449198 12.60936 18.3762 23.784479 29.90988 35.67672 40.92564 47.519161 52.200359 57.00108 62.767921 67.429199"
             y="0"
             id="tspan1542">GUARDACOSTAS,</tspan></text>
      </g>
    </g>
    <g
       id="g1546">
      <g
         id="g1548"
         clip-path="url(#clipPath1552)" />
    </g>
    <g
       id="g1554">
      <g
         id="g1556"
         clip-path="url(#clipPath1560)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,76.008)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1564"><tspan
             x="0 8.5158005 14.28264 20.746679 25.65696 28.774441 34.541279 41.005322 47.130718"
             y="0"
             id="tspan1562">MANEJANDO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,178.54,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1568"><tspan
         x="0 5.3086801 11.99184"
         y="0"
         id="tspan1566">CON</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,200.14,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1572"><tspan
         x="0 4.9102802 10.07952 15.34836 20.25864 24.441839 29.37204 35.965561 40.875839"
         y="0"
         id="tspan1570">EXCELENTE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,249.1,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1576"><tspan
         x="0 4.1831999 6.69312 12.81852 17.74872 23.157 28.784401 33.445679 39.730438"
         y="0"
         id="tspan1574">LIDERAZGO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,298.56,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1580"><tspan
         x="0 5.7600002"
         y="0"
         id="tspan1578">AL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,311.52,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1584"><tspan
         x="0 5.1493201 10.06956 15.47784 20.04948 26.643 33.09708 38.863918"
         y="0"
         id="tspan1582">PERSONAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,357.72,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1588"><tspan
         x="0 5.4182401 11.18508 14.28264"
         y="0"
         id="tspan1586">BAJO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,381.72,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1592"><tspan
         x="0 4.56004"
         y="0"
         id="tspan1590">SU</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,395.78,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1596"><tspan
         x="0 8.5158005 14.28264 20.746679 26.87208 33.465599"
         y="0"
         id="tspan1594">MANDO,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,434.9,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1600"><tspan
         x="0 5.3086801 11.64324 20.15904 25.308359 29.51148 32.0214 36.941639 43.415642 49.6506"
         y="0"
         id="tspan1598">CUMPLIENDO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,494.3,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1604"><tspan
         x="0 4.8007202 11.39424 17.51964 23.28648"
         y="0"
         id="tspan1602">TODAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,525.26,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1608"><tspan
         x="0 4.57164 11.02572"
         y="0"
         id="tspan1606">SUS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,544.01,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1612"><tspan
         x="0 4.8007202 10.56756 15.97584 20.866199 26.633039"
         y="0"
         id="tspan1610">TAREAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,578.33,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1616"><tspan
         x="0"
         y="0"
         id="tspan1614">A</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,587.21,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1620"><tspan
         x="0 5.3086801 11.03568 16.54356 22.3104 26.493601 29.003519 35.128922 40.89576 47.02116"
         y="0"
         id="tspan1618">CABALIDAD,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,639.89,76.008)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1624"><tspan
         x="0 5.3086801 11.9022"
         y="0"
         id="tspan1622">CON</tspan></text>
    <g
       id="g1626">
      <g
         id="g1628"
         clip-path="url(#clipPath1632)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,661.37,76.008)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1636"><tspan
             x="0 4.9102802 9.4819202 11.99184 17.270639 19.78056 24.7008 31.174801 36.483479 38.993401 44.760239"
             y="0"
             id="tspan1634">EFICIENCIA,</tspan></text>
      </g>
    </g>
    <g
       id="g1638">
      <g
         id="g1640"
         clip-path="url(#clipPath1644)" />
    </g>
    <g
       id="g1646">
      <g
         id="g1648"
         clip-path="url(#clipPath1652)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,65.088)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1656"><tspan
             x="0 6.1254001 11.02572 19.541519 26.13504 30.70668 35.507401 40.91568 46.682522 53.1366 59.262001"
             y="0"
             id="tspan1654">DEMOSTRANDO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,190.54,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1660"><tspan
         x="0 6.3600202"
         y="0"
         id="tspan1658">UN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,206.38,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1664"><tspan
         x="0 5.76684 9.9500399 14.76072"
         y="0"
         id="tspan1662">ALTO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,230.74,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1668"><tspan
         x="0 6.474 8.9839201 14.63124 19.541519"
         y="0"
         id="tspan1666">NIVEL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,257.52,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1672"><tspan
         x="0 6.1199999"
         y="0"
         id="tspan1670">DE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,271.44,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1676"><tspan
         x="0 4.1831999 9.1134005 14.88024 19.06344 23.874121 29.640961"
         y="0"
         id="tspan1674">LEALTAD</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,310.2,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1680"><tspan
         x="0"
         y="0"
         id="tspan1678">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,318,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1684"><tspan
         x="0 6.1254001 8.6353197 13.20696 18.4758 20.98572 26.13504 30.34812 32.85804 39.341999 45.108841"
         y="0"
         id="tspan1682">DISCIPLINA,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,368.64,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1688"><tspan
         x="0 4.91998"
         y="0"
         id="tspan1686">ES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,381,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1692"><tspan
         x="0 5.1493201 10.5576 17.151119 22.917959 28.226641 32.997478 35.507401 41.15472 46.921558"
         y="0"
         id="tspan1690">PROACTIVA,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,433.46,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1696"><tspan
         x="0 5.4082799 10.3086 14.88024 20.02956 24.93984 29.740561 36.105 42.698521 47.270161"
         y="0"
         id="tspan1694">RESPETUOSA</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,489.5,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1700"><tspan
         x="0"
         y="0"
         id="tspan1698">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,497.3,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1704"><tspan
         x="0 5.76684 10.5576 15.46788 21.941879 26.742599 32.509441"
         y="0"
         id="tspan1702">ATENTA,</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,535.37,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1708"><tspan
         x="0 4.8007202 10.56756 17.031601 21.832319"
         y="0"
         id="tspan1706">TANTO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,566.81,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1712"><tspan
         x="0 5.38836 11.98188"
         y="0"
         id="tspan1710">CON</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,588.29,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1716"><tspan
         x="0 4.6712399 11.03568"
         y="0"
         id="tspan1714">SUS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,606.89,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1720"><tspan
         x="0 4.57164 10.91616 16.065479 20.98572 26.393999 28.903919 35.49744 40.90572 45.816002"
         y="0"
         id="tspan1718">SUPERIORES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,660.29,65.088)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1724"><tspan
         x="0 5.3086801 11.9022 20.417999"
         y="0"
         id="tspan1722">COMO</tspan></text>
    <g
       id="g1726">
      <g
         id="g1728"
         clip-path="url(#clipPath1732)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,690.31,65.088)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1736"><tspan
             x="0 5.3086801 11.9022"
             y="0"
             id="tspan1734">CON</tspan></text>
      </g>
    </g>
    <g
       id="g1738">
      <g
         id="g1740"
         clip-path="url(#clipPath1744)" />
    </g>
    <g
       id="g1746">
      <g
         id="g1748"
         clip-path="url(#clipPath1752)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,121.66,54.048)"
           style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1756"><tspan
             x="0 4.57164 10.91616"
             y="0"
             id="tspan1754">SUS</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,139.54,54.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1760"><tspan
         x="0 5.3086801 11.9022 20.417999 25.56732 31.33416 37.788239 42.698521 48.1068 54.700321"
         y="0"
         id="tspan1758">COMPAÑEROS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,201.1,54.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1764"><tspan
         x="0"
         y="0"
         id="tspan1762">Y</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,208.3,54.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1768"><tspan
         x="0 4.57164 10.91616 16.3344 22.10124 26.284439 31.075199 35.985481 41.393761 47.8578 54.451321"
         y="0"
         id="tspan1766">SUBALTERNOS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,267.36,54.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1772"><tspan
         x="0"
         y="0"
         id="tspan1770">.</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,272.4,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1776"><tspan
         x="0 6.60004"
         y="0"
         id="tspan1774">NO</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,288,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1780"><tspan
         x="0 5.2987199 12.0018 16.683001 21.483721"
         y="0"
         id="tspan1778">POSEE</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,316.92,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1784"><tspan
         x="0 4.6812 10.67712 17.270639 22.53948 25.198799 31.931761 38.495399 43.30608"
         y="0"
         id="tspan1782">SANCIONES</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,367.44,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1788"><tspan
         x="0 6.2449198 8.9042397 13.56552 18.83436 21.493679 26.7924 30.965639 33.624962 40.188599 46.224361 51.831841 54.491161 60.48708"
         y="0"
         id="tspan1786">DISCIPLINARIAS</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,435.02,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1792"><tspan
         x="0 4.7999802"
         y="0"
         id="tspan1790">EN</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,448.82,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1796"><tspan
         x="0 4.6799798"
         y="0"
         id="tspan1794">SU</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,462.38,54.048)"
       style="font-variant:normal;font-weight:bold;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1800"><tspan
         x="0 6.2449198 8.9042397 13.56552 18.49572 25.22868 30.836161 33.49548 39.481441"
         y="0"
         id="tspan1798">HISTORIAL</tspan></text>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,506.06,54.048)"
       style="font-variant:normal;font-weight:normal;font-size:9.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1804"><tspan
         x="0"
         y="0"
         id="tspan1802">.</tspan></text>
    <g
       id="g1806">
      <g
         id="g1808"
         clip-path="url(#clipPath1812)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,121.01)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1816"><tspan
             x="0 3.7096801 7.9274402 10.89936 12.702 15.9384 17.741039 21.45072 25.66848 29.350321 31.17384 35.85096"
             y="0"
             id="tspan1814">CALIFICACIÓN</tspan></text>
      </g>
    </g>
    <g
       id="g1818">
      <g
         id="g1820"
         clip-path="url(#clipPath1824)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,112.61)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1828"><tspan
             x="0 4.4335198 7.7951999 9.3681602 13.07088 17.747999 22.306801 26.74032 31.2852 35.015759 38.4888"
             y="0"
             id="tspan1826">DE CONDUCTA</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,90.528,116.21)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1832"><tspan
         x="0 4.5599999 9.1199999"
         y="0"
         id="tspan1830">100</tspan></text>
    <g
       id="g1834">
      <g
         id="g1836"
         clip-path="url(#clipPath1840)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,98.304)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1844"><tspan
             x="0 3.36168 7.4402399 11.658 14.62992 19.174801 23.392559 27.10224 28.904881 33.582001"
             y="0"
             id="tspan1842">EVALUACIÓN</tspan></text>
      </g>
    </g>
    <g
       id="g1846">
      <g
         id="g1848"
         clip-path="url(#clipPath1852)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,89.904)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1856"><tspan
             x="0 4.4335198 7.7951999 9.3681602 13.07088 17.747999 23.858879 27.5616 31.77936 36.338161 39.699841 43.653118 48.330238"
             y="0"
             id="tspan1854">DE COMPAÑEROS</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,91.008,93.504)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1860"><tspan
         x="0 4.5599999 8.0310001"
         y="0"
         id="tspan1858">1/2</tspan></text>
    <g
       id="g1862">
      <g
         id="g1864"
         clip-path="url(#clipPath1868)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,71.4)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1872"><tspan
             x="0 3.36168 7.9204798 11.39352 15.3468 18.708481 22.787041 24.58968 27.83304 31.30608"
             y="0"
             id="tspan1870">ENTREVISTA</tspan></text>
      </g>
    </g>
    <g
       id="g1874">
      <g
         id="g1876"
         clip-path="url(#clipPath1880)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,79.008,71.16)"
           style="font-variant:normal;font-weight:normal;font-size:8.04px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1884"><tspan
             x="0 3.9556799 8.1445198 12.45396 16.409639 19.78644 23.709961 28.76712 32.722801"
             y="0"
             id="tspan1882">EXCELENTE</tspan></text>
      </g>
    </g>
    <g
       id="g1886">
      <g
         id="g1888"
         clip-path="url(#clipPath1892)" />
    </g>
    <g
       id="g1894">
      <g
         id="g1896"
         clip-path="url(#clipPath1900)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,52.896)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1904"><tspan
             x="0 3.36168 7.19664 11.4144 17.51136 20.873039 25.431841 27.22752 31.661039 35.02272"
             y="0"
             id="tspan1902">EXAMEN DE </tspan></text>
      </g>
    </g>
    <g
       id="g1906">
      <g
         id="g1908"
         clip-path="url(#clipPath1912)">
        <text
           xml:space="preserve"
           transform="matrix(1,0,0,-1,13.872,44.496)"
           style="font-variant:normal;font-weight:bold;font-size:6.96px;font-family:Calibri;-inkscape-font-specification:'Calibri Bold';writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
           id="text1916"><tspan
             x="0 3.7096801 8.3867998 12.9456 17.622721 21.332399 23.13504 29.24592 31.048559 34.41024 38.96904 42.442081"
             y="0"
             id="tspan1914">CONOCIMIENTO</tspan></text>
      </g>
    </g>
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,92.808,48.096)"
       style="font-variant:normal;font-weight:normal;font-size:9px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1920"><tspan
         x="0 4.5599999"
         y="0"
         id="tspan1918">70</tspan></text>
    <path
       d="m 624.79,324.79 h 19.125 v 12.25 H 624.79 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1922" />
    <path
       d="m 624.79,324.79 h 19.125 v 12.25 H 624.79 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1924" />
    <path
       d="m 671.69,324.79 h 19.125 v 12.25 H 671.69 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1926" />
    <path
       d="m 671.69,324.79 h 19.125 v 12.25 H 671.69 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1928" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,676.68,324.86)"
       style="font-variant:normal;font-weight:normal;font-size:18.024px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1932"><tspan
         x="0"
         y="0"
         id="tspan1930">X</tspan></text>
    <path
       d="m 297.63,343.85 h 19 v 12.25 h -19 z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1934" />
    <path
       d="m 297.63,343.85 h 19 v 12.25 h -19 z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1936" />
    <path
       d="m 340.88,343.85 h 19.125 V 356.1 H 340.88 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1938" />
    <path
       d="m 340.88,343.85 h 19.125 V 356.1 H 340.88 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1940" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,345.82,343.94)"
       style="font-variant:normal;font-weight:normal;font-size:18px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1944"><tspan
         x="0"
         y="0"
         id="tspan1942">X</tspan></text>
    <path
       d="m 297.63,325.35 h 19 v 12.25 h -19 z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1946" />
    <path
       d="m 297.63,325.35 h 19 v 12.25 h -19 z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1948" />
    <path
       d="m 340.88,325.35 h 19.125 V 337.6 H 340.88 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1950" />
    <path
       d="m 340.88,325.35 h 19.125 V 337.6 H 340.88 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1952" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,345.82,325.44)"
       style="font-variant:normal;font-weight:normal;font-size:18px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1956"><tspan
         x="0"
         y="0"
         id="tspan1954">X</tspan></text>
    <path
       d="m 516.96,343.94 h 19 v 12.25 h -19 z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1958" />
    <path
       d="m 516.96,343.94 h 19 v 12.25 h -19 z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1960" />
    <path
       d="m 560.21,343.94 h 19.125 v 12.25 H 560.21 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1962" />
    <path
       d="m 560.21,343.94 h 19.125 v 12.25 H 560.21 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1964" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,564.94,343.66)"
       style="font-variant:normal;font-weight:normal;font-size:18.96px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1968"><tspan
         x="0"
         y="0"
         id="tspan1966">X</tspan></text>
    <path
       d="m 516.96,325.44 h 19 v 12.25 h -19 z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1970" />
    <path
       d="m 516.96,325.44 h 19 v 12.25 h -19 z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1972" />
    <path
       d="m 560.21,325.44 h 19.125 v 12.25 H 560.21 Z"
       style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none"
       id="path1974" />
    <path
       d="m 560.21,325.44 h 19.125 v 12.25 H 560.21 Z"
       style="fill:none;stroke:#000000;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:8;stroke-dasharray:none;stroke-opacity:1"
       id="path1976" />
    <text
       xml:space="preserve"
       transform="matrix(1,0,0,-1,565.18,325.51)"
       style="font-variant:normal;font-weight:normal;font-size:18px;font-family:Calibri;-inkscape-font-specification:Calibri;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none"
       id="text1980"><tspan
         x="0"
         y="0"
         id="tspan1978">X</tspan></text>
  </g>
</svg>

</div>
</body>
</html>

        `);
        printWindow?.document.close();
        printWindow?.print();
        printWindow?.close();
    }
}
