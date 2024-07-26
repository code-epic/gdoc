import {Inject, Injectable} from '@angular/core';
import {IDatosBasicos} from '../../../../services/resoluciones/resolucion.service';

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
<table cellspacing="0" border="0">
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
<td class="bordes-todos" colspan=2 rowspan=7 height="182" align="left" valign=top><font color="#000000"><br><img [src]="ttps://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/${DB.cedula}/foto.jpg" width=210 height=210 hspace=1 vspace=3>
</font></td>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">NOMBRES Y  APELLIDOS</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.nombres}</font></td>
<td class="bordes-todos" colspan=9 align="center" valign=middle><b><font face="Calibri">ORDEN DE MÉRITO ASCENSOS</font></b></td>
<td class="bordes-todos" colspan=5 align="center" valign=middle><b><font face="Calibri">RESULTADOS DE EVALUACIÓN</font></b></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">CÉDULA DE IDENTIDAD</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle sdval="14448856" sdnum="1033;0;#,##0"><font face="Calibri" color="#000000">${DB.cedula}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">CA.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">PUNTAJE NIEA</font></b></td>
<td class="bordes-todos" align="center" valign=middle sdval="79.881" sdnum="1033;0;0.000"><font face="Calibri" color="#000000">${DB.inea}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">GDO/CAT</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.gdo_cat}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">CN.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">OM NIEA</font></b></td>
<td class="bordes-todos" align="center" valign=middle><font face="Calibri">1/2</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">AÑOS DE SERVICIO</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.anio_servicio}/font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">CF.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font color="#000000">N/A</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">OM J/A</font></b></td>
<td class="bordes-todos" align="center" valign=middle><font face="Calibri"> ${DB.om_ja}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">TIEMPO EN EL GRADO</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.tiempo_grado}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">CC.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.cc_orden}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.cc_orden_anio}</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">OM J/R</font></b></td>
<td class="bordes-todos" align="center" valign=middle><font face="Calibri">${DB.om_jr}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">ESPECIALIDAD</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.especialidad}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">TN.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tn_orden}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tn_orden_anio}</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">OM J/C</font></b></td>
<td class="bordes-todos" align="center" valign=middle><font color="#000000">${DB.om_jc}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">NIVEL EDUCATIVO</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><font face="Calibri">${DB.nivel_education}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">TF.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tf_orden}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tf_orden_anio}</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">SITUACIÓN</font></b></td>
<td class="bordes-todos" align="center" valign=middle><b><font face="Calibri" size=4>${DB.situacion}</font></b></td>
</tr>
<tr>
<td class="bordes-todos" height="33" align="center" valign=middle><b><font face="Calibri">PROM. AÑO</font></b></td>
<td class="bordes-todos" align="center" valign=middle sdval="2007" sdnum="1033;0;0"><font face="Calibri" color="#000000">${DB.promocion}</font></td>
<td class="bordes-todos" colspan=2 align="left" valign=middle><b><font face="Calibri">OPORTUNIDAD DE ASCENSO</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=middle><b><font face="Calibri">${DB.oportunidad_ascenso}</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><b><font face="Calibri">TC.</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tc_orden}</font></td>
<td class="bordes-todos" colspan=3 align="left" valign=middle><font face="Calibri">${DB.tc_orden_anio}</font></td>
<td class="bordes-todos" colspan=4 align="center" valign=top><b><font face="Calibri">PAF</font></b></td>
<td class="bordes-todos" align="center" valign=middle sdval="100" sdnum="1033;0;0"><font face="Calibri" color="#000000">${DB.paf}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="29" align="center" valign=middle><b><font face="Calibri">N° DE TELÉFONO</font></b></td>
<td class="bordes-todos" colspan=2 align="center" valign=middle><font face="Calibri">${DB.telefono}</font></td>
<td style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000" colspan=15 align="left" valign=middle><b><font face="Calibri">CMDTE DE UNIDAD: ${DB.cmdt_unidad}</font></b></td>
<td class="bordes-todos" colspan=2 align="center" valign=middle><b><font color="#000000">TLF:</font></b></td>
<td style="border-top: 1px solid #000000; border-bottom: 1px solid #000000" colspan=5 align="center" valign=middle><font face="Calibri">${DB.cmdt_tlf}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 rowspan=4 height="88" align="center" valign=middle><b><font face="Calibri">RÉGIMEN<br>DISCIPLINARIO MILITAR:</font></b></td>
<td class="bordes-todos" colspan=3 rowspan=2 align="left" valign=middle><b><font face="Calibri">INVESTIGACIÓN ADMINISTRATIVA</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">SI</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font color="#000000">${DB.investiga_adm == true ? 'X' : '' }</font></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">NO</font></b></td>
<td class="bordes-todos" colspan=2 rowspan=2 align="center" valign=middle><font face="Calibri" size=5>${DB.investiga_adm == false ? 'X' : '' }</font></td>
<td class="bordes-todos" colspan=5 rowspan=2 align="left" valign=middle><b><font face="Calibri">INVESTIGACIÓN  JUDICIAL</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">SI</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font color="#000000">${DB.investiga_judicial == true ? 'X' : '' }</font></td>
<td class="bordes-todos" colspan=2 rowspan=2 align="center" valign=middle><b><font face="Calibri">NO</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font face="Calibri" size=5>${DB.investiga_judicial == false ? 'X' : '' }</font></td>
<td class="bordes-todos" rowspan=4 align="left" valign=middle><font color="#000000"><br></font></td>
<td class="bordes-todos" colspan=5 rowspan=2 align="center" valign=middle><b><font face="Calibri">REGISTRO SIPOL</font></b></td>
</tr>
<tr>
</tr>
<tr>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=3 rowspan=2 align="left" valign=middle><b><font face="Calibri">INVESTIGACIÓN PENAL MILITAR</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">SI</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font color="#000000">${DB.investiga_judicial == true ? 'X' : '' }</font></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">NO</font></b></td>
<td class="bordes-todos" colspan=2 rowspan=2 align="center" valign=middle><font face="Calibri" size=5>${DB.investiga_judicial == false ? 'X' : '' }</font></td>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=5 rowspan=2 align="left" valign=middle><b><font face="Calibri">JUICIO ABIERTO</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><b><font face="Calibri">SI</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font color="#000000">${DB.juicio_abierto == true ? 'X' : '' }</font></td>
<td class="bordes-todos" colspan=2 rowspan=2 align="center" valign=middle><b><font face="Calibri">NO</font></b></td>
<td class="bordes-todos" rowspan=2 align="center" valign=middle><font face="Calibri" size=5>${DB.juicio_abierto == false ? 'X' : '' }</font></td>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><b><font face="Calibri">SI</font></b></td>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><font color="#000000">${DB.registro_cipol == true ? 'X' : '' }</font></td>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" colspan=2 rowspan=2 align="center" valign=middle><b><font face="Calibri">NO</font></b></td>
<td style="border-left: 1px solid #000000; border-right: 1px solid #000000" rowspan=2 align="center" valign=middle><font face="Calibri" size=5>${DB.registro_cipol == false ? 'X' : '' }</font></td>
</tr>
<tr>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="51" align="center" valign=middle><b><font face="Calibri">CARGO ACTUAL:</font></b></td>
<td class="bordes-todos" colspan=11 align="left" valign=middle><font face="Calibri">${DB.cargo_actual}</font></td>
<td class="bordes-todos" colspan=13 align="center" valign=middle><b><font face="Calibri">CURSOS REALIZADOS</font></b></td>
</tr>
<tr>
<td class="bordes-todos" colspan=13 height="23" align="center" valign=middle><b><font face="Calibri">ÚLTIMOS CARGOS</font></b></td>
<td class="bordes-todos" colspan=5 rowspan=2 align="center" valign=middle><b><font face="Calibri">UNIDAD/PAÍS</font></b></td>
<td class="bordes-todos" colspan=6 rowspan=2 align="center" valign=middle><b><font face="Calibri">NOMBRE DEL CURSO</font></b></td>
<td class="bordes-todos" colspan=2 rowspan=2 align="center" valign=middle><b><font face="Calibri">ORDEN DE<br>MÉRITO</font></b></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="23" align="center" valign=middle><b><font face="Calibri">UNIDAD</font></b></td>
<td class="bordes-todos" colspan=11 align="center" valign=middle><b><font face="Calibri">DESCRIPCIÓN/ FECHA</font></b></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="46" align="center" valign=top><font face="Calibri">${DB.unidad}</font></td>
<td class="bordes-todos" colspan=11 align="left" valign=top><font face="Calibri">
${DB.unidad_descripcion}</font></td>
<td class="bordes-todos" colspan=5 align="left" valign=top><font face="Calibri">${DB.curso_unidad}</font></td>
<td class="bordes-todos" colspan=6 align="left" valign=top><font face="Calibri">${DB.curso_nombre}</font></td>
<td class="bordes-todos" colspan=2 align="left" valign=top><font face="Calibri">${DB.curso_merito_orden}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="46" align="center" valign=middle><font color="#000000">${DB.unidad2}</font></td>
<td class="bordes-todos" colspan=11 align="center" valign=middle><font color="#000000">${DB.unidad_descripcion2}</font></td>
<td class="bordes-todos" colspan=5 align="center" valign=middle><font color="#000000">${DB.curso_unidad2}</font></td>
<td class="bordes-todos" colspan=6 align="center" valign=middle><font color="#000000">${DB.curso_nombre2}</font></td>
<td class="bordes-todos" colspan=2 align="center" valign=middle><font color="#000000">${DB.curso_merito_orden2}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="46" align="center" valign=middle><font color="#000000">${DB.unidad3}</font></td>
<td class="bordes-todos" colspan=11 align="center" valign=middle><font color="#000000">${DB.unidad_descripcion3}</font></td>
<td class="bordes-todos" colspan=5 align="center" valign=middle><font color="#000000">${DB.curso_unidad3}</font></td>
<td class="bordes-todos" colspan=6 align="center" valign=middle><font color="#000000">${DB.curso_nombre3}</font></td>
<td class="bordes-todos" colspan=2 align="center" valign=middle><font color="#000000">${DB.curso_merito_orden3}</font></td>
</tr>
<tr>
<td class="bordes-todos" colspan=2 height="30" align="left" valign=middle><b><font face="Calibri">OTRAS EVALUACIONES</font></b></td>
<td class="bordes-todos" colspan=24 rowspan=5 align="justify" valign=top><b><font face="Calibri">${DB.otras_evaludacion}</font></b></td>
</tr>
<tr>
<td class="bordes-todos" height="30" align="left" valign=middle><b><font face="Calibri" size=1>CALIFICACIÓN DE CONDUCTA</font></b></td>
<td class="bordes-todos" align="left" valign=middle sdval="100" sdnum="1033;0;0"><font face="Calibri" color="#000000">${DB.calificacion_conducta}</font></td>
</tr>
<tr>
<td class="bordes-todos" height="30" align="left" valign=middle><b><font face="Calibri" size=1>EVALUACIÓN<br>DE COMPAÑEROS</font></b></td>
<td class="bordes-todos" align="left" valign=middle><font face="Calibri">${DB.evaluacion_companieros}</font></td>
</tr>
<tr>
<td class="bordes-todos" height="30" align="left" valign=middle><b><font face="Calibri" size=1>ENTREVISTA</font></b></td>
<td class="bordes-todos" align="left" valign=middle><font face="Calibri" size=1>${DB.entrevista}</font></td>
</tr>
<tr>
<td class="bordes-todos" height="31" align="left" valign=middle><b><font face="Calibri" size=1>EXAMEN DE CONOCIMIENTO</font></b></td>
<td class="bordes-todos" align="left" valign=middle sdval="70" sdnum="1033;0;0"><font face="Calibri" color="#000000">${DB.examen_conocimiento}</font></td>
</tr>
<tr>
<td class="bordes-todos" height="42" align="left" valign=top><b><font face="Calibri">Proceso de Ascenso ${DB.ascenso_proceso}</font></b></td>
<td class="bordes-todos" colspan=2 align="left" valign=top><b><font face="Calibri">OM: Orden de Mérito</font></b></td>
<td class="bordes-todos" colspan=2 align="left" valign=top><b><font face="Calibri">NIEA:  Nómina Inicial de Evaluación para Ascenso</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=top><b><font face="Calibri">J/A: Junta de Apreciación</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=top><b><font face="Calibri">J/R:  Junta de Revisión</font></b></td>
<td class="bordes-todos" colspan=3 align="left" valign=top><b><font face="Calibri">J/C:  Junta<br>Calificadora</font></b></td>
<td class="bordes-todos" colspan=8 align="left" valign=top><b><font face="Calibri">Situación:  R= Recomendado<br>NR= No Recomendado</font></b></td>
<td class="bordes-todos" colspan=4 align="left" valign=top><b><font face="Calibri">PAF: Prueba de<br>Aptitud Física</font></b></td>
</tr>
</table>
</section>
</body>

</html>

        
        
        
        `);
        printWindow.document.head.innerHTML = `
            <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
            <title>CV-${DB.nombres}</title>
            <style type="text/css">
                @media print { 
                    @page { size: landscape; }
                    table { max-height: 100%; overflow: hidden; page-break-after: always; }
                    .bordes-todos {
                        border: 1px solid #000000;
                    }
                }
                .bordes-todos {
                    border: 1px solid #000000;
                }
                body,div,table,thead,tbody,tfoot,tr,th,td,p { font-family:"Times New Roman"; font-size:x-small }
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
