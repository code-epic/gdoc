import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento, IWKFCuenta, IWKFDependencia } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'
import { FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SubDocumento } from '../ministerial/ministerial.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-sbuscador',
    templateUrl: './sbusqueda-avanzada.component.html',
    styleUrls: ['./sbuscador.component.scss']
})
export class SbusquedaAvanzada implements OnInit {
    public Configuracion: any

    public lstT = [];
    public lstR = [];
    public lstC = [];
    public lstU = [];
    public lstCA = [];

    ngOnInit(): void {
        this.Configuracion = sessionStorage.getItem("MD_CConfiguracion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion"))) : []
        this.listarConfiguracion()
    }

    public SubDocumento: SubDocumento = {
        subdocumento: 0,
        cuenta: '',
        estatus: '',
        decision: '',
        accion: '',
        comentario: '',
        historico: '',
        archivo: '',
        nombre_archivo: '',
        fecha: '',
        usuario: ''
    } 

    public Doc: IDocumento = {
        ncontrol: '',
        wfdocumento: 0,
        fcreacion: '',
        forigen: '',
        norigen: '',
        salida: '',
        tipo: '',
        remitente: '',
        unidad: '',
        comando: '',
        contenido: '',
        instrucciones: '',
        codigo: '0',
        nexpediente: '',
        creador: '',
        archivo: '',
        privacidad: 0,
        subdocumento: '',
        dependencias: '',
        puntodecuenta: '',
    }

    public asunto = ''
    public unidad = ''
    public comando = ''
    public lstDependencias = []

    constructor(
        private dialog: MatDialogRef<SbusquedaAvanzada>
    ){ }

    listarConfiguracion() {
        console.log(this.Configuracion)
        this.Configuracion.forEach(e => {
            switch (e.tipo) {
                case "1":
                this.lstT.push(e)
                break
                case "2":
                this.lstR.push(e)
                break
                case "3":
                this.lstU.push(e)
                break
                case "4":
                this.lstC.push(e)
                break
                case "5":
                this.lstCA.push(e)
                break
            }
        })
    }

    close(): void {
        this.dialog.close();
    }
}