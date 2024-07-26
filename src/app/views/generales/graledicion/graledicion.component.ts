import {Component, OnInit} from '@angular/core';
import {IDatosBasicos} from '../../../services/resoluciones/resolucion.service';
import {TemplateCVService} from './service/template-cv.service';

@Component({
    selector: 'app-graledicion',
    templateUrl: './graledicion.component.html',
    styleUrls: ['./graledicion.component.scss']
})
export class GraledicionComponent implements OnInit {
    // public event:any;
    public event: any = {
        anio: 0,
        area: 'rerererere',
        cargo: 'fddffdfdfd',
        categoria: '0',
        cedula: '14448856',
        clasificacion: '1',
        componente: '100',
        condicion: '1',
        correo: 'reerreer@yopmail.com',
        dia: 0,
        especialidad: 'feeererre',
        estadomayor: 'fdfdfdfdfd',
        estudios: 'rerererere',
        fecha: '1900-01-01',
        grado: '1',
        mes: 0,
        motivo: 'rerererererere',
        n_componente: 0,
        n_grado: 0,
        nacimiento: '2024-7-9',
        nombres: 'JOANNIER MARÍA BOUQUETT MAVAREZ',
        observacion: 'rererereererererer',
        orden: 0,
        profesion: '',
        profesionx: '',
        promocion: '2024-7-1',
        reserva: 0,
        resolucion: 0,
        sexo: 'M',
        situacion: 'ACT',
        solicitud: 0,
        telefono: '0424123321',
        ubicacion: 'dfdffdfd',
        ultimo_ascenso: '2024-7-16',

        //   campos nuevos agregados 24/07/2024
        inea: '79,881',
        gdo_cat: 'CC. ASIMILADA',
        anio_servicio: '17 AÑOS',
        tiempo_grado: '4 AÑOS',
        nivel_education: 'PREGRADO (ODONTÓLOGO)',
        oportunidad_ascenso: 'PRIMERO',
        cmdt_unidad: 'CA. JUAN LÓPEZ AGUDO',
        cmdt_tlf: '04241233212',
        cc_orden: '1/6',
        cc_orden_anio: 'JUL20',
        tn_orden: '1/6',
        tn_orden_anio: 'JUL20',
        tf_orden: '1/6',
        tf_orden_anio: 'JUL20',
        tc_orden: '1/6',
        tc_orden_anio: 'JUL20',
        om_jr: '1/2',
        om_ja: '1/2',
        om_jc: '1/2',
        anio_promocion: '2007',
        paf: '100',
        cargo_actual: 'A ORDEN DE LA ESTACIÓN PRINCIPAL DE GUARDACOSTAS “TN. PEDRO LUCAS URRIBARRÍ”.',
        investiga_adm: false,
        investiga_penal_mil: false,
        investiga_judicial: false,
        juicio_abierto: false,
        registro_cipol: false,
        unidad: 'ESTACIÓN PRINCIPAL DE GUARDACOSTAS “MARACAIBO”',
        unidad_descripcion: 'JEFA DEL ÁREA DE SERVICIOS GENERALES (AGO07 - AGO16)',
        unidad2: 'N/A',
        unidad_descripcion2: 'N/A',
        unidad3: 'N/A',
        unidad_descripcion3: 'N/A',
        curso_unidad: ' IESEOFANB',
        curso_nombre: ' ESTADO MAYOR PARA\n' + 'OFICIALES\n' + 'ASIMILADOS N° 2\n' + '(FEB24)',
        curso_merito_orden: '31/35',
        curso_unidad2: 'N/A',
        curso_nombre2: 'N/A',
        curso_merito_orden2: 'N/A',
        curso_unidad3: 'N/A',
        curso_nombre3: 'N/A',
        curso_merito_orden3: 'N/A',
        otras_evaludacion: 'APRECIACIÓN GENERAL: OFICIAL CON DIECISIETE (17) AÑOS EN UNIDADES OPERATIVAS Y DIECISIETE (17) AÑOS EN LA ESPECIALIDAD. PRESENTA VEINTIOCHO  (28)  RECONOCIMIENTOS  EN  EL  HISTORIAL.  LOS  CONCEPTOS  EMITIDOS  POR  SUS  EVALUADORES  Y  COMANDANTE  ACTUAL  LA CATALOGAN COMO UNA EXCELENTE PROFESIONAL QUIEN HA DEMOSTRADO EXCEPCIONALES CAPACIDADES PARA ORGANIZAR, PLANIFICAR Y EJECUTAR TAREAS PROPIAS DE SUS FUNCIONES; PERMITIENDO UN ADECUADO MANEJO OPERATIVO DE LA UNIDAD, ASIMISMO SU ESFUERZO, DEDICACIÓN  Y  PROFESIONALISMO  HAN  COADYUVADO  A  LA  CONSECUCIÓN  DE  LOS  OBJETIVOS  PLANTEADOS  POR  LA  SUPERIORIDAD.  POSEE ALTO SENTIDO DE PERTENENCIA, EVIDENCIANDO GRAN RESPONSABILIDAD EN LAS ACTIVIDADES OPERACIONALES PROPIAS DE GUARDACOSTAS, MANEJANDO CON EXCELENTE LIDERAZGO AL PERSONAL BAJO SU MANDO, CUMPLIENDO TODAS SUS TAREAS A CABALIDAD, CON EFICIENCIA, DEMOSTRANDO UN ALTO NIVEL DE LEALTAD Y DISCIPLINA, ES PROACTIVA, RESPETUOSA Y ATENTA, TANTO CON SUS SUPERIORES COMO CON SUS COMPAÑEROS Y SUBALTERNOS. NO POSEE SANCIONES DISCIPLINARIAS EN SU HISTORIAL.',
        calificacion_conducta: '100',
        evaluacion_companieros:'1/2',
        entrevista:'EXCELENTE',
        examen_conocimiento: '70',
        ascenso_proceso: 'JUL24',

    };

    constructor(private templateCv: TemplateCVService) {
    }

    ngOnInit(): void {
    }

    generarPdf(event: any) {
        console.log("json de test", this.event);

        this.templateCv.crearHTML(this.event); //eliminar esta linea luego de probar
        // this.templateCv.createHtmlSectionForPrint(event.data); //descomentar para integrar
    }

}
