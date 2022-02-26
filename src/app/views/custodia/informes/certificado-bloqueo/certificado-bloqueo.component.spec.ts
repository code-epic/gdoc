import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoBloqueoComponent } from './certificado-bloqueo.component';

describe('CertificadoBloqueoComponent', () => {
  let component: CertificadoBloqueoComponent;
  let fixture: ComponentFixture<CertificadoBloqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoBloqueoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoBloqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
