import { Component, Input, OnInit } from '@angular/core';
import { TinderDocumentModel, TinderDocumentRole } from '../../models/tinder-document.model';

@Component({
  selector: 'app-workflow-panel',
  templateUrl: './workflow-panel.component.html',
  styleUrls: ['./workflow-panel.component.scss']
})
export class WorkflowPanelComponent implements OnInit {

  @Input() document: TinderDocumentModel | null = null;
  public newCommentText: string = '';

  private rolesOrder: TinderDocumentRole[] = [
    'TRANSCRIPTOR',
    'JEFE',
    'SUBDIRECTOR',
    'DIRECTOR',
    'MINISTRO'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  isCurrentOrPast(role: TinderDocumentRole): boolean {
    if (!this.document) return false;
    const currentIndex = this.rolesOrder.indexOf(this.document.estatus);
    const roleIndex = this.rolesOrder.indexOf(role);
    return roleIndex <= currentIndex;
  }

  advanceWorkflow() {
    if (!this.document) return;
    const currentIndex = this.rolesOrder.indexOf(this.document.estatus);
    if (currentIndex < this.rolesOrder.length - 1) {
      this.document.estatus = this.rolesOrder[currentIndex + 1];
    }
  }

  rejectWorkflow() {
    if (!this.document) return;
    const currentIndex = this.rolesOrder.indexOf(this.document.estatus);
    if (currentIndex > 0) {
      this.document.estatus = this.rolesOrder[currentIndex - 1];
    }
  }

  addComment() {
    if (!this.document || !this.newCommentText.trim()) return;
    
    if (!this.document.comentarios) {
      this.document.comentarios = [];
    }

    this.document.comentarios.push({
      id: Math.random().toString(36).substring(2, 9),
      text: this.newCommentText,
      author: 'Usuario Actual', // Para ser reemplazado con datos de JWT del usuario real
      date: new Date().toISOString(),
      status: 'pending'
    });

    this.newCommentText = '';
  }

}
