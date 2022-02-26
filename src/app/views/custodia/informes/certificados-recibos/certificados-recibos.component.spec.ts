import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosRecibosComponent } from './certificados-recibos.component';

describe('CertificadosRecibosComponent', () => {
  let component: CertificadosRecibosComponent;
  let fixture: ComponentFixture<CertificadosRecibosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadosRecibosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosRecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
