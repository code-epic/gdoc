import { Component, Injectable, OnInit } from '@angular/core';
import { AllService } from 'src/app/services/allservice.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';


import { Router } from "@angular/router"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"

import { Resolucion } from "src/app/services/control/documentos.service"
import {
    NgbCalendar,
    NgbDateAdapter,
    NgbDateParserFormatter,
    NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap"
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { map, startWith } from "rxjs/operators"
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { IResoluciones } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';



export interface ITipoResolucion {
    codigo: string
    nombre: string
}


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
    readonly DELIMITER = "-";

    fromModel(value: string | null): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10),
            };
        }
        return null;
    }

    toModel(date: NgbDateStruct | null): string | null {
        return date
            ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
            : null;
    }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = "/";

    parse(value: string): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10),
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        return date
            ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
            : "";
    }
}

@Component({
    selector: 'app-rsbuzon',
    templateUrl: './rsbuzon.component.html',
    styleUrls: ['./rsbuzon.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ],
})
export class RsbuzonComponent implements OnInit {
    public estadoActual = 3;
    public estatusActual = 1;
    public destino = 14;
    fecha_desde = '-09-01'
    fecha_hasta = '-09-30'
    xyear = '2024'
    public lstMeses = []
    public lstYear = []
    public xmeses = ''

    public extender_plazo: any;
    public x = false;
    public vrecibido = true;
    public vprocesados = false;
    public vpendientes = false;
    public blistado = false

    public cmbDestino = '';

    public paginador = 10;
    public focus;

    Componentes = []

    public xAPI: IAPICore = {
        funcion: '',
        parametros: '',
        valores: '',
    };

    isShowing: boolean;
    formSidenav: FormGroup;
    public selNav = 0;
    public lengthOfi = 0;
    public pageSizeOfi = 10;
    public pageEvent: PageEvent;
    public idd: string = '';
    public cuenta: string = '';
    public cmbAcciones = [
        { valor: '0', texto: 'ACEPTAR', visible: '0' },
        { valor: '1', texto: 'RECHAZAR', visible: '0' },
        { valor: '8', texto: 'SILENCIO ADMINISTRATIVO', visible: '0' },
        { valor: '9', texto: 'EN ESPERA DE DECISION', visible: '0' },
        { valor: '10', texto: 'EN ESPERA DE OPINION', visible: '0' },
    ];

    public lstAcciones = [];
    public bzOriginal = [];
    public bzSubDocumentos = [];
    public bzRecibido = [];
    public lstRecibidos = [];
    public bzRecibidoResumen = []
    public bzClasificar = [];
    public bzProcesados = [];
    public bzPendientes = [];
    public lst = [];
    public lstEstados = []; //Listar Estados
    public lstResponsable = []
    public lstCedula = []
    public TipoResoluciones: any

    public lstCausa: any //Objeto Comando
    public lstMotivo: any //Objeto Comando
    public lstDetalle: any //Objeto Comando
    public lstPais: any //Objeto Comando

    public estilocheck = 'none';
    public estiloclasificar = 'none';

    public xcomponente = '0'
    public xclasificacion = '0'
    public xprioridad = '0'
    public xresponsable = '0'
    public xtipo = '0'
    public xobservacion = ''
    public observaciones = ''
    public xasunto = ''


    public allComplete: boolean = false;
    public allCompletex: boolean = false;
    public lstAll: any = [];
    public lstAllx: any = [];

    public numControl = '';
    public Observacion = '';
    public AccionTexto: string = '0';
    maxRecibido = 0
    public maxCol = "12"
    public maxAscenso = "4"
    public maxColComision = "6"
    public maxCorregir = '3'
    public maxExtender = '6'
    public color = "#e3e6e6"
    public cmbGrado = '0'
    public otro_resuelto = ''
    public lstHistorico: any
    public blNombramiento: boolean = false
    public blCorregir: boolean = false
    public blReserva: boolean = false
    public blReservaAux: boolean = false
    public blComision: boolean = false
    public blComisionAux: boolean = false
    public blExtender: boolean = false
    public blAscenso: boolean = false
    public blAscensof: boolean = false
    public blReconocer: boolean = false
    public blCategoria: boolean = false
    public blComponente: boolean = false
    public blAceptar: boolean = true
    public blAlert: boolean = false
    public blCalendar: boolean = false
    public blDbEspecialidad: boolean = false

    public ultimo_ascenso: any
    public comision_inicio: any
    public comision_fin: any

    public searchView = "none"
    public contentView = ""



    public Resolucion: Resolucion = {
        id: "",
        cuenta: "",
        unidad: "",
        fecha_doc: "",
        tipo: {},
        cedula: "",
        nombres: "",
        fecha_nacimiento: "",
        componente: "",
        categoria: "",
        clasificacion: "",
        grado: "",
        carpeta: "",
        estatus: "",
        entrada: "",
        asunto: "",
        observacion: "",
        responsable: "",
        cargo_responsable: "",
        situacion: "",
        sexo: "",
        numero: "",
        gran_comando: "",
        unidad_comando: "",
        instrucciones: "",
        n_componente: 0,
        n_grado: 0,
    }





    model1: string
    model2: string


    public WAlerta: IWKFAlerta = {
        documento: 0,
        estado: 0,
        estatus: 0,
        activo: 0,
        fecha: '',
        usuario: '',
        observacion: '',
    };


    longitud = 0;
    posicion = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    public numCarpeta: string = '';

    selected = new FormControl(0);
    public lstCarpetasRecibido = [
        { 'id': 1, 'nomb': 'CONTROL DE GESTIÓN', 'cant': 0, 'cod': 'CG' },
        { 'id': 2, 'nomb': 'SECRRETARIA', 'cant': 0, 'cod': 'SC' }
    ]
    public lstCarpetas = [];
    public lstCarpetasAux = [];
    public codCarpeta = '';
    public blNavegacion: boolean = false;
    public details: boolean = false;


    public sNavegacion = ''
    btnTexto = 'Control de Gestion';


    public lstAccionesMininisterial = [
        { 'valor': '1', 'texto': 'ANALISTA', 'visible': '1' },
        { 'valor': '2', 'texto': 'JEFE DE AREA', 'visible': '1' },
        { 'valor': '3', 'texto': 'BANDEJA DE ESPERA', 'visible': '1' },
        { 'valor': '4', 'texto': 'PRESIDENCIAL', 'visible': '1' },
        { 'valor': '5', 'texto': 'ESPERA DE OPINION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
        { 'valor': '6', 'texto': 'CONSULTORIA JURIDICA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
        { 'valor': '7', 'texto': 'RESOLUCIONES', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
        { 'valor': '8', 'texto': 'SUB-DIRECCION', 'visible': '1' },
        { 'valor': '9', 'texto': 'DIRECCION GENERAL', 'visible': '1' },
        { 'valor': '10', 'texto': 'DESPACHO DEL MPPD', 'visible': '1' },  //7/5/3 Asociado a los plazos en las alertas
        { 'valor': '11', 'texto': 'ARCHIVO', 'visible': '1' },
        { 'valor': '12', 'texto': 'RESOLUCIONES / URGENTE', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
        { 'valor': '13', 'texto': 'RESOLUCIONES / JEFE DEL AREA SECRETARIA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas

    ]

    filteredOptions: Observable<ITipoResolucion[]>
    myControl = new FormControl()


    public IResolucion: IResoluciones = {
        grado: 0,
        anio: 0,
        asunto: "",
        cedula: "",
        pais: 0,
        reserva: 0,
        solicitud: 0,
        tipo: 0,
        unidad: 0,
        comando: "",
        comision_fin: "",
        comision_inicio: "",
        creador: "",
        destino: "",
        dia: 0,
        distribucion: "0",
        estatus: 0,
        modificado: "",
        fecha_termino: "",
        falta: "",
        registro: "",
        fecha_resolucion: "",
        formato: "",
        ultimo_ascenso: "",
        instrucciones: "",
        mes: 0,
        autor_modificar: "",
        motivo: "",
        numero: "",
        observacion: "",
        orden_merito: 0,
        otro_resuelto: "",
        autor_registro: "",
        termino: 0,
        unidad_texto: "",
        documento: 0,
        causa: 0,
        archivo: "",
    };

    public fecha_resolucion: any;
    public hashcontrol = "";
    public CuentaGenera: any
    public tipo: any
    public archivos: any;

    public lstDigitalesDevuelto = []

    constructor(
        private apiService: ApiService,
        private ruta: Router,
        private toastrService: ToastrService,
        private loginService: LoginService,
        private utilService: UtilService,
        private modalService: NgbModal,
        private ngxService: NgxUiLoaderService,
        public formatter: NgbDateParserFormatter,
        private _snackBar: MatSnackBar,
        private ngbCalendar: NgbCalendar,
        private dateAdapter: NgbDateAdapter<string>,
        private fb: FormBuilder,
        private allService: AllService
    ) {

        this.lstMeses = this.apiService.Xmeses
        this.lstYear = this.apiService.Xyear
    }

    async ngOnInit() {

        this.xmeses = new Date().getMonth().toString()
        this.xyear = new Date().getFullYear().toString()

        this.Componentes =
            sessionStorage.getItem('MPPD_CComponente') != undefined
                ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
                : []
        // console.log(this.Componentes)
        this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []

        this.listarResponsables()
        this.initFormSidenav();

        await this.seleccionNavegacion(0);
        this.listarEstados();


        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((value) => (typeof value === "string" ? value : value?.name)),
            map((name) => (name ? this._filter(name) : this.TipoResoluciones.slice()))
        )

        //this.listarSubDocumentos(1);
        // this.blNavegacion = true
    }

    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!
    }


    listarEstados() {
        this.xAPI.funcion = 'WKF_CEstados';
        this.xAPI.parametros = '%';
        this.xAPI.valores = '';
        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.lstEstados = data.Cuerpo.filter((e) => {
                    return (e.esta == 1 && e.id != 3) || e.id == 1;
                });
            },
            (error) => {
            }
        );
    }


    displayFn(tr: ITipoResolucion): string {
        return tr && tr.nombre ? tr.nombre : ""
    }

    private _filter(name: string): ITipoResolucion[] {
        const filterValue = name.toLowerCase()

        return this.TipoResoluciones.filter((option) =>
            option.nombre.toLowerCase().includes(filterValue)
        )
    }

    entrada_open(id, cuenta) {
        if (cuenta != undefined) {
            const xid = btoa('4,2,' + id);
            const xcuenta = btoa(cuenta);
            this.ruta.navigate(['/rsentradas', xid, xcuenta]);
            return;
        }
        const xid = btoa(id);
        this.ruta.navigate(['/rsentradas', xid]);
    }


    open(content, id, pos) {
        this.numControl = id;
        this.posicion = pos;
        //this.hashcontrol = btoa( "D" + this.numControl) //Cifrar documentos
        let modalRef = this.modalService.open(content, {
            centered: true,
            windowClass: "my-custom-modal-class",
            size: "md",
            backdrop: false,
        });

        modalRef["_windowCmptRef"].location.nativeElement.style.zIndex = "900";
    }


    openResolucion(content) {
        let modalRef = this.modalService.open(content, {
            centered: true,
            windowClass: "my-custom-modal-class",
            size: "xl",
            backdrop: false,
        });

        modalRef["_windowCmptRef"].location.nativeElement.style.zIndex = "900";
    }



    listarDocumentos(e) {
        this.sNavegacion = `${e.nomb}`
        this.bzRecibidoResumen = []
        this.details = true

        if (e.id == 2) {
            this.bzRecibido.forEach((el) => {
                if (el.tdoc == 'PUNTO DE CUENTA') this.bzRecibidoResumen.push(el)
            })


        } else {
            this.bzRecibido.forEach((el) => {
                if (el.tdoc != 'PUNTO DE CUENTA') this.bzRecibidoResumen.push(el)
            })
        }
        this.blNavegacion = true


    }


    seleccionNavegacion(e) {

        this.xAPI.funcion = 'WKF_CDocumentosResoluciones';
        this.xAPI.valores = '';
        this.selNav = e;

        this.fecha_desde = this.xyear + '-' + this.lstMeses[0].desde
        this.fecha_hasta = this.xyear + '-' + this.lstMeses[this.xmeses].hasta
        switch (e) {
            case 0:
                this.cargarAcciones(0);
                this.xAPI.parametros = this.estadoActual + "," + this.estatusActual + "," + this.fecha_desde + "," + this.fecha_hasta;
                this.listarBuzon(e);
                break;
            case 1:
                this.cargarAcciones(1);
                this.xAPI.parametros = this.estadoActual + ',' + 2 + "," + this.fecha_desde + "," + this.fecha_hasta;
                this.listarBuzon(e);
                break;
            case 2:
                // this.cargarAcciones(1);
                this.xAPI.funcion = 'WKF_CGrupoCarpetas';
                this.xAPI.parametros = '';
                // this.listarCarpetas();
                this.subEntrada()
                break;

            default:
                break;
        }
    }



    async listarBuzon(tipo: number) {
        if (tipo == 0) {
            if (this.bzRecibido.length > 0) {
                return;
            }

        } else {
            if (this.bzClasificar.length > 0) {
                return;
            }
        }
        // console.log('iniciando');
        this.cargarInformacion(tipo);
    }

    async cargarInformacion(tipo) {
        this.ngxService.startLoader('ldbuzon');
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                // console.log(data.Cuerpo)
                this.lstAll = data.Cuerpo;
                this.maxRecibido = this.lstAll.length
                let i = 0
                let arr = this.lstAll.map((e) => {
                    e.completed = false;
                    e.color = 'warn';
                    e.cuentas = e.cuenta != '' ? '' : e.nori;
                    e.priv = e.priv == 1 ? true : false;
                    e.existe = e.anom == '' ? true : false;
                    e.xaccion = e.accion;
                    if (e.tdoc == 'PUNTO DE CUENTA') {
                        i = i + 1
                    }
                    e.color = 'green'
                    switch (e.tdoc.toLowerCase()) {
                        case 'punto de cuenta':
                            e.simbolo = "-P"
                            e.color = 'green'
                            break;
                        case 'tramitacion por organo regular':
                            e.simbolo = "-T"
                            e.color = 'brown'
                            break;
                        case 'resolucion':
                            e.simbolo = "-R"
                            e.color = 'orange'
                            break;
                        default:
                            e.simbolo = ''
                            break;
                    }
                    return e;
                }); //Registros recorridos como elementos
                if (tipo == 0) {
                    this.bzRecibido = arr
                } else {
                    this.bzClasificar = arr
                }

                this.lstCarpetasRecibido[0].cant = this.maxRecibido - i
                this.lstCarpetasRecibido[1].cant = i


                this.ngxService.stopLoader('ldbuzon')
            },
            (error) => {
                console.error(error)
                this.ngxService.stopLoader('ldbuzon');
            }
        );
    }

    async subEntrada() {

        this.lstCarpetas = []
        this.xAPI.funcion = 'MPPD_CGrupoCarpertaEntrada';
        this.xAPI.parametros = '36'
        this.xAPI.valores = ''

        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                // console.log('subEntrada: ', data);  
                try {
                    if (data.Cuerpo.length > 0) {
                        data.Cuerpo.forEach(e => {
                            let dt = {
                                'cantidad': e.cantidad,
                                'llav': e.numero_carpeta,
                                'usuario': '',
                                'componente': parseInt(e.cod_componente)
                            }
                            this.lstCarpetas.push(dt)
                        });
                        this.lstCarpetasAux = this.lstCarpetas
                    }
                    this.ngxService.stopLoader('ldcarpetas')
                } catch (error) {
                    console.log(error)
                    this.ngxService.stopLoader('ldcarpetas')
                }




            },
            (error) => {
            }
        );
    }
    consultarCarpeta(e) {
        if (e.keyCode == 13) {
            this.filtrarCarpetas(e.target.value);
            this.codCarpeta = '';
        }
    }

    filtrarCarpetas(id: string) {
        if (id == '') {
            this.lstCarpetas = this.lstCarpetasAux;
        } else {
            this.lstCarpetas = this.lstCarpetasAux.filter(e => {
                return e.llav.includes(id);
            });
        }


    }

    filtrarAddElements(filter: any): any {
        this.bzOriginal = filter.map((e) => {
            e.completed = false;
            e.color = 'warn';
            e.cuentas = e.cuenta != '' ? '' : e.nori;
            e.priv = e.priv == 1 ? true : false;
            e.existe = e.anom == '' ? true : false;
            e.xaccion = e.accion;
            return e;
        });
    }

    async listarSubDocumentos(estatus: number) {
        this.xAPI.funcion = 'WKF_CSubDocumentoResoluciones';
        this.xAPI.parametros = '4,2,3,' + estatus;
        this.bzSubDocumentos = [];
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.bzSubDocumentos = data.Cuerpo.map((e) => {
                    e.completed = false;
                    e.color = 'warn';
                    e.bOk = e.cuenta == '' ? true : false;
                    e.cuentas = e.cuenta == '' ? '' : e.cuenta;
                    e.priv = e.priv == 1 ? true : false;
                    e.existe = e.anom == '' ? true : false;
                    e.xaccion = e.accion;
                    return e;
                }); //Registros recorridos como elementos
                this.lengthOfi = data.Cuerpo.length;
                console.log(this.bzSubDocumentos, 'uff -> ', this.selNav);
                if (this.selNav == 1) {
                    this.bzRecibido.push(this.bzSubDocumentos);
                }
            },
            (error) => {
            }
        );
    }

    async ConsultarCtrl(id) {
        if (id == 4) {
            this.bzRecibido = this.bzSubDocumentos;
        } else {
            this.bzRecibido = this.bzOriginal.filter((e) => {
                return e.ultimo_estado == id;
            });
        }
    }

    ConsultarProcesados(id) {
        console.log(this.bzSubDocumentos, 'uff -> ', id);
        // if (id == 4) {
        //   this.bzRecibido = this.bzSubDocumentos
        // } else {
        //   console.log(this.bzOriginal, 'xfff -> ', id)
        //   this.bzRecibido = this.bzOriginal.filter((e) => { return e.ultimo_estado == id })
        //   console.log( this.bzRecibido )
        // }
        this.bzRecibido = this.bzSubDocumentos;
        // this.bzRecibido.push(this.bzOriginal)
    }

    updateAllComplete() {
        this.allComplete =
            this.lstAll != null && this.lstAll.every((t) => t.completed);
    }

    someComplete(): boolean {
        if (this.lstAll == null) {
            return false;
        }
        return (
            this.lstAll.filter((t) => t.completed).length > 0 && !this.allComplete
        );
    }

    setAll(completed: boolean) {
        this.allComplete = completed;
        if (this.lstAll == null) {
            return;
        }

        this.lstAll.forEach((t) => (t.completed = completed));
        if (completed == false) {
            this.estiloclasificar = 'none';
        } else {
            this.estiloclasificar = '';
        }
    }

    pageChangeEvent(e) {
        this.pageSize = e.pageSize;
        this.recorrerElementos(e.pageIndex);
    }

    //recorrerElementos para paginar listados
    recorrerElementos(pagina: number) {
        let pag = this.pageSize * pagina;
        this.lstAll = this.bzOriginal.slice(pag, pag + this.pageSize);
    }





    //editar
    editar(id: string) {
        const estado = this.estadoActual;
        const estatus = this.selNav + 1;
        const base = btoa(estado + ',' + estatus + ',' + id);
        this.ruta.navigate(['/documento', base]);
    }

    insertarObservacion() {
        var usuario = this.loginService.Usuario.id;
        this.xAPI.funcion = 'WKF_IDocumentoObservacion';
        this.xAPI.valores = JSON.stringify({
            documento: this.numControl,
            estado: this.estadoActual, //Estado que ocupa
            estatus: this.selNav + 1,
            observacion: this.Observacion.toUpperCase(),
            accion: this.AccionTexto,
            usuario: usuario,
        });

        this.xAPI.parametros = '';
        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                switch (this.AccionTexto) {
                    case '0': //Oficio por opinión
                        this.promoverBuzon(0, this.utilService.FechaActual());
                        break;
                    case '8': //Oficio por SILENCIO ADMINISTRATIVO
                        this.promoverBuzon(3, this.utilService.FechaActual());
                        break;
                    case '9': //Oficio por DECISION
                        this.promoverBuzon(4, this.utilService.FechaActual());
                        break;
                    case '10': //Oficio por OPINION
                        this.promoverBuzon(5, this.utilService.FechaActual());
                        break;
                    case '1': //Rechazar en el estado inicial
                        this.rechazarBuzon();
                        break;
                }
            },
            (errot) => {
                this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
            }
        ); //
    }

    async rechazarBuzon() {
        this.xAPI.funcion = 'WKF_AUbicacionRechazo';
        this.xAPI.valores = '';
        this.xAPI.parametros =
            '1,1,1,,' + this.loginService.Usuario.id + ',' + this.numControl;
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.toastrService.success(
                    'El documento ha sido enviado al origen',
                    `GDoc Wkf.DocumentoObservacion`
                );
                this.seleccionNavegacion(this.selNav);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    async promoverBuzon(activo: number, sfecha: string) {
        var fecha = '';
        if (sfecha == '') {
            if (this.extender_plazo == undefined) {
                this.toastrService.warning(
                    'Debe seleccionar una fecha ',
                    `GDoc Wkf.DocumentoObservacion`
                );
                return false;
            } else {
                fecha = this.utilService.ConvertirFecha(this.extender_plazo);
            }
        } else {
            fecha = sfecha;
        }

        sfecha == ''
            ? this.utilService.ConvertirFecha(this.extender_plazo)
            : sfecha;

        var usuario = this.loginService.Usuario.id;
        var i = 0;
        var estatus = activo != 0 ? activo : 1; //NOTA DE ENTREGA
        //Buscar en Wk de acuerdo al usuario y la app activa
        this.xAPI.funcion = 'WKF_APromoverEstatus';
        this.xAPI.valores = '';

        this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`;
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            async (data) => {

                await this.guardarAlerta(0, fecha);
                //this.seleccionNavegacion(this.selNav);
                this.reducirVector();
                this.Observacion = '';
                this.numControl = '0';
                this.toastrService.success(
                    'Se ha promovido el documento',
                    `GDoc Wkf.DocumentoObservacion`
                );
            },
            (errot) => {
                this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
            }
        ); //
    }


    reducirVector() {
        this.bzRecibidoResumen.splice(this.posicion, 1);
        console.log('Control de datos ');

    }


    async redistribuir(destino: number = 0) {
        var dst = destino != 0 ? destino : this.cmbDestino;

        this.xAPI.funcion = 'WKF_ARedistribuir';
        this.xAPI.valores = '';
        this.xAPI.parametros =
            dst +
            ',' +
            dst +
            ',1,' +
            this.loginService.Usuario.id +
            ',' +
            this.numControl;
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.guardarAlerta(
                    1,
                    this.utilService.ConvertirFecha(this.extender_plazo)
                );
                this.toastrService.success(
                    'El documento ha sido redistribuido segun su selección',
                    `GDoc Wkf.DocumentoObservacion`
                );
                this.seleccionNavegacion(this.selNav);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    /**
     *
     * @param destino 3 es la posicion del estado actual
     */
    async promoverPuntoCuenta(destino: number = 0, estatus: number) {
        var dst = destino != 0 ? destino : this.cmbDestino;

        this.xAPI.funcion = 'WKF_ASubDocumentoRedistribuir';
        this.xAPI.valores = '';
        this.xAPI.parametros =
            dst +
            ',' +
            estatus +
            ',' +
            this.loginService.Usuario.id +
            ',' +
            this.idd +
            ',' +
            this.cuenta;
        console.log(this.xAPI);
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            async (data) => {
                this.toastrService.success(
                    'El documento ha sido redistribuido segun su selección',
                    `GDoc Wkf.DocumentoObservacion`
                );
            },
            (error) => {
                console.error(error);
            }
        );
    }

    async cargarAcciones(posicion) {
        this.lstAcciones = [];
        this.lstAcciones = this.cmbAcciones.filter((e) => {
            return e.visible == posicion;
        });
    }

    selAccion() {
        this.x = false;
        switch (this.AccionTexto) {
            case '6':
                this.x = true;
                break;

            default:
                break;
        }
    }

    //Consultar un enlace
    constancia(id: string) {
        const estado = 1;
        const estatus = 1;
        return btoa(estado + ',' + estatus + ',' + id);
        //this.ruta.navigate(['/constancia', base])
    }

    //Guardar la alerte define el momento y estadus
    guardarAlerta(activo: number, fecha: string) {
        this.WAlerta.activo = activo;
        this.WAlerta.documento = parseInt(this.numControl);
        this.WAlerta.estado = this.estadoActual;
        this.WAlerta.estatus = this.selNav + 1;
        this.WAlerta.usuario = this.loginService.Usuario.id;
        this.WAlerta.observacion = this.Observacion.toUpperCase();
        this.WAlerta.fecha = fecha;

        this.xAPI.funcion = 'WKF_AAlertas';
        this.xAPI.parametros = '';
        this.xAPI.valores = JSON.stringify(this.WAlerta);
        this.apiService.Ejecutar(this.xAPI).subscribe(
            async (alerData) => {
                console.log(alerData);
            },
            (errot) => {
                this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
            }
        ); //
    }


    async SubirArchivo(e) {
        var frm = new FormData(document.forms.namedItem('forma'));
        try {
            await this.apiService.EnviarArchivos(frm).subscribe((data) => {
                this.xAPI.funcion = 'WKF_ADocumentoAdjunto';
                this.xAPI.parametros = '';

            });
        } catch (error) {
            console.error(error);
        }
    }

    dwUrl(ncontrol: string, archivo: string): string {
        return this.apiService.Dws(btoa('D' + ncontrol) + '/' + archivo);
    }

    async crearCarpeta() {
        var elementos = ``
        let i = 0
        let coma = ''
        await this.bzClasificar.forEach(e => {
            if (e.completed) {
                if (i > 0) coma = ','
                elementos += coma + `'${e.numc}'`
                i++
            }

        })
        var componente = parseInt(this.xcomponente)
        var numero = this.numCarpeta;
        var tipo = this.xtipo
        var clasificacion = parseInt(this.xclasificacion)
        var prioridad = this.xprioridad
        var observacion = this.xobservacion
        let idtrans = this.utilService.GenerarUnicId()
        var estatus = '36'

        var usuario = this.loginService.Usuario.cedula;


        this.xAPI.funcion = 'MPPD_GEntradasResoluciones';
        this.xAPI.parametros =
            `'0',${elementos}##${componente}##${numero}##${tipo}##${estatus}##${clasificacion}##${prioridad}##${observacion}##${usuario}##${idtrans}`;
        console.log(this.xAPI.parametros)
        if (this.numCarpeta == '') {
            this.toastrService.error(
                'Debe Introducir un numero de carpeta',
                `GDoc Wkf.Ubicacion`
            );
            return;
        }

        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                console.log(data)
                this.clasificarBuzon()
            },
            (errot) => {
                this.toastrService.error(errot, `GDoc Wkf.Estatus`);
            }
        );


    }

    actualizarBzRegistrados(codigo, tipo) {
        var posicion = 0;
        var i = 0;
        this.lstAll.forEach((e) => {
            if (e.numc == codigo) {
                posicion = i;
                return;
            }
            i++;
        });
        if (tipo == 0) {
            this.lstAll.splice(posicion, 1);
        } else {
            this.lstAll[posicion].existe = false;
        }
    }

    MoverForm(id: string) {
        this.selected.setValue(2);
        // this.cedula = id;
        // this.consultarCedula(undefined);
    }

    toggleSidenav(e: any) {
        this.isShowing = !this.isShowing;
        this.formSidenav.reset();
        console.log('ELEMENTO DE LA CARPETA', e);
        this.formSidenav.patchValue({
            'esta': 1, 'fech': 2, 'id': 3, 'idw': 4,
            'nomb': e.componente,
            'obse': e.llav
        });
        this.blistado = true

        this.lstCedula = []
        this.listarCedulasEnCarpeta(e)

    }

    closeEvent(e: boolean) {
        this.isShowing = e;
        this.blistado = false
    }
    listarCedulasEnCarpeta(e) {
        this.xAPI.funcion = 'MPPD_CEntradasProceso'
        this.xAPI.parametros = `${e.llav},${e.componente},36`
        this.xAPI.valores = null

        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                console.log(data)
                this.lstAllx = data.Cuerpo
                let arr = this.lstAllx.map((e) => {
                    e.completed = false;
                    if (e.digital != '') this.lstDigitalesDevuelto.push(e.digital)
                    return e;
                });
                this.lstCedula = arr
                console.log(arr)
                console.log(this.lstDigitalesDevuelto)
            },
            err => { }
        )
    }

    initFormSidenav() {
        this.formSidenav = this.fb.group({
            esta: new FormControl(''),
            fech: new FormControl(''),
            id: new FormControl(''),
            idw: new FormControl(''),
            nomb: new FormControl(''),
            obse: new FormControl(''),
        })
    }

    getDetalle(e): string {
        return e.tdoc == "PUNTO DE CUENTA" || e.tdoc == "MULTIPLE/PUNTO DE CUENTA" ? e.s_cuenta : e.numc

    }

    principal() {
        this.sNavegacion = ''
        this.blNavegacion = false
        this.details = false
        this.bzRecibidoResumen = []
    }

    principalp() {
        this.sNavegacion = ''
        this.blNavegacion = false
        this.details = false
        this.bzRecibidoResumen = []
    }


    async listarResponsables() {
        this.xAPI.funcion = 'MPPD_ListarResponsables'
        this.xAPI.parametros = 'Resoluciones'
        this.xAPI.valores = null
        // console.log(this.xAPI)
        await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                // console.log(data)
                if (data.msj == undefined) {
                    data.forEach(e => {
                        this.lstResponsable.push({
                            'cedula': e.cedula,
                            'nombre': e.nombre
                        })
                    });
                }
            },
            err => { }
        )
    }

    getEstatusMinisterial(e): string {
        // console.log(e)
        if (e.s_estatus == null) e.s_estatus = 1
        let pos = parseInt(e.s_estatus) - 1;
        // console.log('CANT: ', pos,    this.lstAccionesMininisterial)
        return this.lstAccionesMininisterial[pos] != undefined ? this.lstAccionesMininisterial[pos].texto : ''


    }

    getColor(e): string {
        let color = '#000011'
        // console.log(e)
        switch (e) {
            case 100:
                color = '#998877'
                break
            case 200:
                color = '#abe2fa;'
                break
            case 300:
                color = '#5582b5'
                break
            case 400:
                color = '#A32A24'
                break
            case 602:
                color = '#6ddf93'
                break
            default:
                break;
        }
        return color
    }


    clasificarBuzon() {
        var lstBz = this.bzClasificar
        var usuario = this.loginService.Usuario.cedula
        var llave = ``
        var i = 0
        var estatus = 3 //NOTA DE ENTREGA
        //Buscar en Wk de acuerdo al usuario y la app activa
        this.xAPI.funcion = 'WKF_AUbicacion'
        this.xAPI.valores = ''



        lstBz.forEach(e => {
            i++
            if (e.completed == true) {
                this.xAPI.parametros = `3,${estatus},${llave},${usuario},${e.idd}`
                this.apiService.Ejecutar(this.xAPI).subscribe(
                    (data) => {
                        this.actualizarBzClasificar(e.numc, 0)
                    },
                    (errot) => {
                        this.toastrService.error(errot, `GDoc Wkf.Estatus`);
                    }) //

            }
        });
        this.seleccionNavegacion(0)

    }

    actualizarBzClasificar(codigo, tipo) {
        var posicion = 0
        var i = 0
        this.bzClasificar.forEach(e => {
            if (e.numc == codigo) {
                posicion = i
                return
            }
            i++
        })
        if (tipo == 0) {
            this.bzClasificar.splice(posicion, 1)
        } else {
            this.bzClasificar[posicion].existe = false
        }
    }






    updateAllCompletex() {
        this.allCompletex =
            this.lstAllx != null && this.lstAllx.every((t) => t.completed);
    }

    someCompletex(): boolean {
        if (this.lstAllx == null) {
            return false;
        }
        return (
            this.lstAllx.filter((t) => t.completed).length > 0 && !this.allCompletex
        );
    }

    setAllx(completed: boolean) {
        this.allCompletex = completed;
        if (this.lstAllx == null) {
            return;
        }

        this.lstAllx.forEach((t) => (t.completed = completed));
        if (completed == false) {
            this.estiloclasificar = 'none';
        } else {
            this.estiloclasificar = '';
        }
    }

    getDetalleX(e: string): string {
        return this.allService.getDetalleX(e);
    }

    getDetalleEnabled(e): boolean {
        let text = true
        let cont = e.split("|")
        if (cont.length > 0) {

            switch (cont[1]) {
                case "PR":
                    text = true
                    break;
                case "NP":
                    text = false
                    break;
                case "NPPIDD":
                    text = false
                    break;
                case "NPPIDJ":
                    text = false
                    break;
                case "CR":
                    text = false
                    break;
            }
        }



        // let cont = e.split("|")
        // if (cont.length > 0) text = cont[1]

        return text
    }


    AnularCuenta() {
        Swal.fire({
            title: 'GDoc Resoluciones',
            text: "¿Está seguro que desea anular la carpeta?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                let where = `${this.numCarpeta}`
                this.xAPI.funcion = 'MPPD_UCarpetasGroup'
                this.xAPI.parametros = where
                this.xAPI.valores = null

                this.apiService.Ejecutar(this.xAPI).subscribe(
                    (data) => {
                        this.toastrService.info(
                            "La carpeta ha sido actualizada",
                            `GDoc Resoluciones`
                        )
                        this.closeEvent(false)
                    },
                    err => {
                        console.log(err)
                    }
                )
            }
        })
    }

    AceptarResoluciones() {
        this.modalService.dismissAll()
    }



    fileSelected(e) {
        this.archivos.push(e.target.files[0]);
    }

    async SubirArchivoResoluciones() {


        console.log("R" + this.IResolucion.cedula)

        this.ngxService.startLoader("loader-aceptar");
        if (this.archivos.length > 0) {
            console.log('Existen mas archivos')

            var frm = new FormData(document.forms.namedItem("forma"));
            try {
                await this.apiService.EnviarArchivos(frm).subscribe((data) => {



                    //this.evaluarDatos();

                });
            } catch (error) {
                console.error(error);
            }
        } else {
            //this.evaluarDatos();
        }
    }



    seleccionTipo() {
        this.desactivarVista()


        if (this.fecha_resolucion == "") {
            this._snackBar.open("Debe seleccionar una fecha para continuar", "OK")
            return
        }

        if (typeof this.tipo != "object") return
        this.IResolucion.tipo = this.tipo.codigo
        let rs = this.tipo
        let valor = true
        this.resetearFechas(false)
        this.maxAscenso = '4'
        this.maxCorregir = '3'
        this.maxExtender = '6'
        this.IResolucion.grado = parseInt(this.Resolucion.grado)
        console.log(this.tipo)
        switch (parseInt(rs.tipo)) {
            case 1:
                this.blNombramiento = true
                this.maxCol = "6"
                this.viewUnidad()
                break
            case 2:
                if (this.validarCategoriaCeseReserva(parseInt(rs.codigo))) {
                    this.maxCol = "12"
                    this.getCausa(rs.codigo)
                } else {
                    valor = false
                }

                break
            case 3:
                // console.log(this.tipo, this.IResolucion.tipo)
                this.maxCol = "6"
                this.blCorregir = true
                if (this.IResolucion.tipo == 35) {

                    let vGr: any = parseInt(this.Resolucion.grado) + 2
                    this.cmbGrado = vGr.toString()
                    this.IResolucion.grado = parseInt(this.cmbGrado)
                    this.blAscenso = true
                    this.maxAscenso = '6'
                    this.maxCorregir = '6'
                }
                break

            case 4:
                if (this.fecha_resolucion == "") {
                    this._snackBar.open("Debe seleccionar una fecha de resolucion", "OK")
                    return
                }
                let fin = this.utilService.SumarAnios(this.fecha_resolucion, 1)
                this.comision_inicio = this.fecha_resolucion
                this.comision_fin = fin
                this.maxCol = "6"
                this.blComision = true
                this.maxColComision = "6"
                this.getAdministracion(rs.codigo)
                break
            case 5:
                this.maxCol = "6"
                this.blCorregir = true
                this.blExtender = true
                break
            case 6:
                this.maxCol = "12"
                this.maxColComision = "4"
                this.blComision = true
                this.blComisionAux = true
                break
            case 7:
                this.maxCol = "4"
                let vGr: any = parseInt(this.Resolucion.grado) - 2
                this.cmbGrado = vGr.toString()
                this.IResolucion.grado = parseInt(this.cmbGrado)
                this.blAscensof = true
                this.blAscenso = true
                break
            case 8:
                this.maxCol = "5"
                this.blReconocer = true
                break
            case 9:
                this.maxCol = "6"
                this.blCategoria = true
                break
            case 10:
                this.maxCol = "6"
                this.blComponente = true
                break
            case 11: //reincorporar
                this.maxCol = "6"
                this.maxExtender = '3'
                this.blExtender = true
                break
            default:
                break
        }

        this.blAceptar = valor
    }


    viewUnidad() {
        this.searchView = ""
        this.contentView = "none"
    }


    resetearFechas(active: boolean) {
        this.fecha_resolucion = active ? "" : this.fecha_resolucion
        this.ultimo_ascenso = ""
        this.comision_inicio = ""
        this.comision_fin = ""
    }



    validarCategoriaCeseReserva(codigo: number) {
        if (codigo == 9 && this.Resolucion.clasificacion == "ASIMILADOS")
            return true
        if (codigo == 10 && this.Resolucion.clasificacion == "EFECTIVO")
            return true
        this.toastrService.error(
            "Error: No coincide el tipo de resolución con la categoría",
            `GDoc Resoluciones`
        )
        return false
    }

    desactivarVista() {
        this.blCorregir = false
        this.blNombramiento = false
        this.blReserva = false
        this.blReservaAux = false
        this.blComision = false
        this.blComisionAux = false
        this.blExtender = false
        this.blAscenso = false
        this.blAscensof = false
        this.blReconocer = false
        this.blCategoria = false
        this.blComponente = false
    }

    getAdministracion(id: string) {
        this.lstCausa = []
        this.xAPI.funcion = "MPPD_CCausaResolucion"
        this.ngxService.startLoader("loader-buscar")
        this.xAPI.parametros = id
        this.xAPI.valores = ""

        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.lstCausa = data.Cuerpo
                this.ngxService.stopLoader("loader-buscar")
            },
            (err) => {
                console.error(err)
            }
        )
    }

    getCausa(id: string) {
        this.lstCausa = []
        this.lstMotivo = []
        this.xAPI.funcion = "MPPD_CCausaResolucion"
        this.ngxService.startLoader("loader-buscar")
        this.xAPI.parametros = id
        this.xAPI.valores = ""

        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                console.log(data)
                this.lstCausa = data.Cuerpo

                this.blReserva = true
                this.ngxService.stopLoader("loader-buscar")
                //
            },
            (err) => {
                console.error(err)
            }
        )
    }

    getMotivo() {
        this.lstMotivo = []
        this.xAPI.funcion = "MPPD_CMotivoResolucion"
        this.ngxService.startLoader("loader-buscar")
        this.xAPI.parametros = this.IResolucion.solicitud.toString()
        this.xAPI.valores = ""

        this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
                this.lstMotivo = data.Cuerpo

                this.blReserva = true
                this.ngxService.stopLoader("loader-buscar")
                if (this.IResolucion.solicitud.toString() == "7") this.blReservaAux = true
            },
            (err) => {
                console.error(err)
            }
        )
    }





}
