import { Inject, Injectable } from '@angular/core';
import { IDatosBasicos } from '../../../../services/resoluciones/resolucion.service';

@Injectable({
    providedIn: 'root'
})
export class TemplateCVService {

    crearHTML(DB: any) {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
        <!DOCTYPE html>

<html>
<body>
<section>
<table cellspacing="0">
    <colgroup width="90"></colgroup>
    <colgroup width="72"></colgroup>
    <colgroup width="40"></colgroup>
    <colgroup width="172"></colgroup>
    <colgroup width="52"></colgroup>
    <colgroup width="31"></colgroup>
    <colgroup width="28"></colgroup>
    <colgroup width="40"></colgroup>
    <colgroup width="25"></colgroup>
    <colgroup width="10"></colgroup>
    <colgroup width="65"></colgroup>
    <colgroup width="48"></colgroup>
    <colgroup width="31"></colgroup>
    <colgroup width="25"></colgroup>
    <colgroup width="19"></colgroup>
    <colgroup width="27"></colgroup>
    <colgroup width="28"></colgroup>
    <colgroup width="13"></colgroup>
    <colgroup width="22"></colgroup>
    <colgroup width="28"></colgroup>
    <colgroup width="18"></colgroup>
    <colgroup width="46"></colgroup>
    <colgroup width="41"></colgroup>
    <colgroup span="2" width="30"></colgroup>
    <colgroup width="55"></colgroup>
    
    <tr>
        <td colspan=2 rowspan=8 height="170"><br>
            <img [src]="https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/${DB.cedula}/foto.jpg" width=150 height=150 hspace=1 vspace=3>
        </td>
        <td class="center header" colspan=10>DATOS BASICOS</td>
        <td class="center header" colspan=9><b>ORDEN DE MÉRITO ASCENSOS</b></td>
        <td class="center header" colspan=5><b>RESULTADOS DE EVALUACIÓN</b></td>
    </tr>

    <tr>
        <td colspan=2><b>NOMBRES Y  APELLIDOS</b></td>
        <td colspan=8>${DB.nombres}</td>
        <td colspan=3><b>CA.</b></td>
        <td colspan=3>N/A</td>
        <td colspan=3>N/A</td>
        <td class="center" colspan=4><b>PUNTAJE NIEA</b></td>
        <td class="center"  sdval="79.881" sdnum="1033;0;0.000">${DB.inea}</td>
    </tr>

    <tr>
        <td colspan=2><b>CÉDULA DE IDENTIDAD</b></td>
        <td colspan=8  sdval="14448856" sdnum="1033;0;#,##0">${DB.cedula}</td>
        <td colspan=3><b>CN.</b></td>
        <td colspan=3>N/A</td>
        <td colspan=3>N/A</td>
        <td class="center" colspan=4><b>OM NIEA</b></td>
        <td class="center">1/2</td>
    </tr>

    <tr>
        <td colspan=2><b>GDO/CAT</b></td>
        <td colspan=8>${DB.gdo_cat}</td>
        <td colspan=3><b>CF.</b></td>
        <td colspan=3>N/A</td>
        <td colspan=3>N/A</td>
        <td class="center" colspan=4><b>OM J/A</b></td>
        <td class="center"> ${DB.om_ja}</td>
    </tr>

    <tr>
        <td colspan=2><b>AÑOS DE SERVICIO</b></td>
        <td colspan=8>${DB.anio_servicio}</td>
        <td colspan=3><b>CC.</b></td>
        <td colspan=3>${DB.cc_orden}</td>
        <td colspan=3>${DB.cc_orden_anio}</td>
        <td class="center" colspan=4><b>OM J/R</b></td>
        <td class="center">${DB.om_jr}</td>
    </tr>

    <tr>
        <td colspan=2><b>TIEMPO EN EL GRADO</b></td>
        <td colspan=8>${DB.tiempo_grado}</td>
        <td colspan=3><b>TN.</b></td>
        <td colspan=3>${DB.tn_orden}</td>
        <td colspan=3>${DB.tn_orden_anio}</td>
        <td class="center" colspan=4><b>OM J/C</b></td>
        <td class="center">${DB.om_jc}</td>
    </tr>

    <tr>
        <td colspan=2><b>NIVEL EDUCATIVO</b></td>
        <td colspan=8>${DB.nivel_education}</td>
        <td colspan=3><b>TF.</b></td>
        <td colspan=3>${DB.tf_orden}</td>
        <td colspan=3>${DB.tf_orden_anio}</td>
        <td class="center" colspan=4><b>SITUACIÓN</b></td>
        <td class="center"><b><font size=2>${DB.situacion}</b></td>
    </tr>

    <tr>
        <td colspan=2><b>OPORTUNIDAD DE ASCENSO</b></td>
        <td colspan=8>${DB.oportunidad_ascenso}</td>
        <td colspan=3><b>TC.</b></td>
        <td colspan=3>${DB.tc_orden}</td>
        <td colspan=3>${DB.tc_orden_anio}</td>
        <td class="center" colspan=4><b>PAF</b></td>
        <td class="center"  sdval="100" sdnum="1033;0;0">${DB.paf}</td>
    </tr>

    <tr>
        <td class="center" colspan=2 height="30"><b>CARGO ACTUAL:</b></td>
        <td colspan=24>${DB.cargo_actual}</td>
    </tr>


    <tr class="center">
        <td colspan=2 rowspan=4 height="60"><b>RÉGIMEN<br>DISCIPLINARIO MILITAR:</b></td>
        <td colspan=4 rowspan=2 height="30"><b>INVESTIGACIÓN ADMINISTRATIVA</b></td>
        <td colspan=4 rowspan=2><b>INVESTIGACIÓN PENAL MILITAR</b></td>
        <td colspan=4 rowspan=2><b>JUICIO ABIERTO</b></td>
        <td colspan=6 rowspan=2><b>INVESTIGACIÓN  JUDICIAL</b></td>
        <td colspan=6 rowspan=2><b>REGISTRO SIPOL</b></td>
    </tr>

    <tr>
    </tr>

    <tr class="center strong">

        <td colspan=1 rowspan=2 height="30">SI</td>
        <td class="size-5" colspan=1 rowspan=2>${DB.investiga_adm == true ? 'X' : ''}</td>
        <td colspan=1 rowspan=2>NO</td>
        <td class="size-5" colspan=1 rowspan=2>${DB.investiga_adm == false ? 'X' : ''}</td>

        <td colspan=1>SI</td>
        <td class="size-5" colspan=1>${DB.investiga_judicial == true ? 'X' : ''}</td>
        <td colspan=1>NO</td>
        <td class="size-5" colspan=1>${DB.investiga_judicial == false ? 'X' : ''}</td>

        <td colspan=1>SI</td>
        <td class="size-5" colspan=1>${DB.juicio_abierto == true ? 'X' : ''}</td>
        <td colspan=1>NO</td>
        <td class="size-5 " colspan=1>${DB.juicio_abierto == false ? 'X' : ''}</td>

        <td colspan=1 rowspan=1>SI</td>
        <td class="size-5" colspan=2 rowspan=2>${DB.investiga_judicial == true ? 'X' : ''}</td>
        <td colspan=1 rowspan=2>NO</td>
        <td class="size-5" colspan=2 rowspan=2>${DB.investiga_judicial == false ? 'X' : ''}</td>

        <td colspan=1>SI</td>
        <td class="size-5" colspan=2>${DB.registro_cipol == true ? 'X' : ''}</tdsize-5>
        <td colspan=1>NO</td>
        <td class="size-5" colspan=2>${DB.registro_cipol == false ? 'X' : ''}</td>
    </tr>

    <tr>
    </tr>

    <tr>
        <td class="center" height="21.75"><b>PROM. AÑO</b></td>
        <td class="center"  sdval="2007" sdnum="1033;0;0">${DB.promocion}</td>
        <td colspan=1><b>ESPECIALIDAD</b></td>
        <td colspan=1>${DB.especialidad}</td>
        <td class="center" colspan=1><b>N° DE TELÉFONO</b></td>
        <td class="center" colspan=5>${DB.telefono}</td>
        <td colspan=7><b>CMDTE DE UNIDAD: ${DB.cmdt_unidad}</b></td>
        <td class="center" colspan=4><b>TLF:</b></td>
        <td class="center" colspan=5>${DB.cmdt_tlf}</td>
    </tr>

    <tr class="center">
        <td class="header" colspan=13 height="23"><b>ÚLTIMOS CARGOS</b></td>
        <td class="header" class="center" colspan=13><b>CURSOS REALIZADOS</b></td>
    </tr>

    <tr class="center">
        <td colspan=2 height="19"><b>UNIDAD</b></td>
        <td colspan=11><b>DESCRIPCIÓN/ FECHA</b></td>
        <td colspan=5><b>UNIDAD/PAÍS</b></td>
        <td colspan=6><b>NOMBRE DEL CURSO</b></td>
        <td colspan=2><b>ORDEN DE<br>MÉRITO</b></td>
    </tr>

    <tr class="center">
        <td class="contenido" colspan=2 height="30">${DB.unidad}</td>
        <td class="contenido_d" colspan=11>${DB.unidad_descripcion}</td>
        <td class="contenido" colspan=5>${DB.curso_unidad}</td>
        <td class="contenido" colspan=6>${DB.curso_nombre}</td>
        <td class="contenido" colspan=2>${DB.curso_merito_orden}</td>
    </tr>

    <tr class="center">
        <td class="contenido" colspan=2 height="30">${DB.unidad2}</td>
        <td class="contenido_d" colspan=11>${DB.unidad_descripcion2}</td>
        <td class="contenido" colspan=5>${DB.curso_unidad2}</td>
        <td class="contenido" colspan=6>${DB.curso_nombre2}</td>
        <td class="contenido" colspan=2>${DB.curso_merito_orden2}</td>
    </tr>

    <tr class="center">
        <td class="contenido" colspan=2 height="30">${DB.unidad3}</td>
        <td class="contenido_d" colspan=11>${DB.unidad_descripcion3}</td>
        <td class="contenido" colspan=5>${DB.curso_unidad3}</td>
        <td class="contenido" colspan=6>${DB.curso_nombre3}</td>
        <td class="contenido" colspan=2>${DB.curso_merito_orden3}</td>
    </tr>

    <tr>
        <td class="header center" colspan=26 height="20"><b>OTRAS EVALUACIONES</b></td>
    </tr>

    <tr>
        <td colspan=2><b><font size=1>CALIFICACIÓN DE CONDUCTA</b></td>
        <td class="evaluacion" colspan=24 rowspan=8 align="justify"><b>${DB.otras_evaludacion}</b></td>
    </tr>

    <tr>
        <td colspan=2 sdval="100" sdnum="1033;0;0">${DB.calificacion_conducta}</td>
    </tr>

    <tr>
        <td colspan=2><b><font size=1>EVALUACIÓN DE COMPAÑEROS</b></td>
    </tr>

    <tr>
        <td colspan=2>${DB.evaluacion_companieros}</td>
    </tr>

    <tr>
        <td colspan=2><b><font size=1>ENTREVISTA</b></td>
    </tr>

    <tr>
        <td colspan=2><font size=1>${DB.entrevista}</td>
    </tr>

    <tr>
        <td colspan=2><b><font size=1>EXAMEN DE CONOCIMIENTO</b></td>
    </tr>

    <tr>
        <td colspan=2 sdval="70" sdnum="1033;0;0">${DB.examen_conocimiento}</td>
    </tr>

    <tr>
        <td height="20" colspan=1><b>Proceso de Ascenso ${DB.ascenso_proceso}</b></td>
        <td colspan=1><b>OM: Orden de Mérito</b></td>
        <td colspan=3><b>NIEA: Nómina Inicial de Evaluación para Ascenso</b></td>
        <td colspan=3><b>J/A: Junta de Apreciación</b></td>
        <td colspan=3><b>J/R: Junta de Revisión</b></td>
        <td colspan=3><b>J/C: Junta<br>Calificadora</b></td>
        <td colspan=8><b>Situación: R= Recomendado<br>NR= No Recomendado</b></td>
        <td colspan=4><b>PAF: Prueba de<br>Aptitud Física</b></td>
    </tr>

</table>
</section>
<script>
    const elemento = document.querySelector('.evaluacion b');

    const elementos = document.querySelectorAll('.contenido');
    const elementos_d = document.querySelectorAll('.contenido_d');
    adjustFontSizeIfNeededArr(elementos, elementos_d, elemento);

    function adjustFontSizeIfNeededArr(elementos, elementos_d, elemento_texto) {
        elementos.forEach(elemento => {
            if (elemento.innerText.length > 140) {
                elemento.style.fontSize = '9px';
            }
        });

        elementos_d.forEach(elemento => {
            if (elemento.innerText.length > 600) {
                elemento.style.fontSize = '9px';
            }
        });

        let content = elemento_texto.innerText;
        if (content.length > 1063) {
            elemento_texto.style.fontSize = '9px';
        }if(content.length > 3000){
            elemento_texto.style.fontSize = '8px';
        }   
    }
</script>
</body>

</html>

        `);
        printWindow.document.head.innerHTML = `
            <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        
            <style type="text/css">
                @media print { 
                    @page { size: landscape; }
                    table { max-height: 100%; overflow: hidden; page-break-after: always; }
                }
                .header{
                    background-color: #ca230ec7;
                    color: #fff;
                    font-weight: bold;
                }
                table, td{
                    border: 1px solid #000000;
                }
                .center{
                    text-align: center;
                }
                .size-5{
                    font-size: 20px;
                }
                .strong{
                    font-weight: bold;
                }
                
            
                body,div,table,thead,tbody,tfoot,tr,th,td,p { font-family:Calibri; font-size:x-small }
                a.comment-indicator:hover + comment { background:#ffd; position:absolute; display:block; border:1px solid black; padding:0.5em;  }
                a.comment-indicator { background:red; display:inline-block; border:1px solid black; width:0.5em; height:0.5em;  }
                comment { display:none;  }
            </style>

            </head>`
        // printWindow?.document.close();
        // printWindow?.print();
        // printWindow?.close();
    }
}
