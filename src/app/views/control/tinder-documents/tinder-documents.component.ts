import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TinderDocumentModel } from './models/tinder-document.model';

@Component({
  selector: 'app-tinder-documents',
  templateUrl: './tinder-documents.component.html',
  styleUrls: ['./tinder-documents.component.scss']
})
export class TinderDocumentsComponent implements OnInit, OnDestroy {

  public activeDocument: TinderDocumentModel | null = null;
  public loading: boolean = false;
  public listadoDocumentos: TinderDocumentModel[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    document.body.classList.add('immersive-active');
    this.cargarDocumentos();
  }

  cargarDocumentos() {
    this.loading = true;
    this.listadoDocumentos = [
      {
        numero_control: '001-2026',
        tipo: 'RADIOGRAMA',
        estatus: 'TRANSCRIPTOR',
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        comentarios: [],
        contenido: {},
        signatures: {
          mainSignatory: 'GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ',
          signatoryTitle: 'GENERAL EN JEFE',
          signatoryRole: 'MINISTRO DEL PODER POPULAR PARA LA DEFENSA',
          wetStampImageUrl: 'assets/img/mppd/sello_mppd.png',
          signatureImageUrl: 'assets/img/mppd/firma_mppd.png'
        }
      } as any,
      {
        numero_control: '002-2026',
        tipo: 'NORMAL',
        estatus: 'JEFE',
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        comentarios: [],
        contenido: {},
        signatures: {
          mainSignatory: 'GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ',
          signatoryTitle: 'GENERAL EN JEFE',
          signatoryRole: 'MINISTRO DEL PODER POPULAR PARA LA DEFENSA',
          wetStampImageUrl: 'assets/img/mppd/sello_mppd.png',
          signatureImageUrl: 'assets/img/mppd/firma_mppd.png'
        }
      } as any
    ];
    this.loading = false;
  }

  exitComponent() {
    this.router.navigate(['/control']);
  }

  abrirDocumento(doc: TinderDocumentModel) {
    this.activeDocument = doc;
  }

  nuevoDocumento() {
    this.activeDocument = {
      numero_control: 'NUEVO',
      tipo: 'NORMAL',
      estatus: 'TRANSCRIPTOR',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
      comentarios: [],
      contenido: {},
      signatures: {
        mainSignatory: 'GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ',
        signatoryTitle: 'GENERAL EN JEFE',
        signatoryRole: 'MINISTRO DEL PODER POPULAR PARA LA DEFENSA',
        wetStampImageUrl: 'assets/img/mppd/sello_mppd.png',
        signatureImageUrl: 'assets/img/mppd/firma_mppd.png'
      }
    } as any;
  }

  cerrarDocumento() {
    this.activeDocument = null;
    this.cargarDocumentos();
  }

  cambiarTipo(tipo: 'RADIOGRAMA' | 'NORMAL') {
    if (this.activeDocument) {
      this.activeDocument.tipo = tipo;
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('immersive-active');
  }

}
