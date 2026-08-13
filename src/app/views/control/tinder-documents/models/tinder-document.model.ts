export type TinderDocumentRole = 
  | 'TRANSCRIPTOR'
  | 'JEFE'
  | 'SUBDIRECTOR'
  | 'DIRECTOR'
  | 'MINISTRO';

export type TinderDocumentType = 'RADIOGRAMA' | 'NORMAL';

export interface TinderDocumentComment {
  id: string;
  text: string;
  status: 'pending' | 'resolved';
  author: string;
  date: string;
}

export interface TinderDocumentContent {
  header?: any;
  body?: any;
  footer?: any;
  signatures?: any;
}

export interface TinderDocumentModel {
  id?: string;
  numero_control: string;
  tipo: TinderDocumentType;
  asignacion?: string;
  definicion?: string;
  estatus: TinderDocumentRole;
  contenido: TinderDocumentContent;
  comentarios: TinderDocumentComment[];
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
