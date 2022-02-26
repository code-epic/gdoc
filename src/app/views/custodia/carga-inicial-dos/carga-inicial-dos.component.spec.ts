import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInicialDosComponent } from './carga-inicial-dos.component';

describe('CargaInicialDosComponent', () => {
  let component: CargaInicialDosComponent;
  let fixture: ComponentFixture<CargaInicialDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaInicialDosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaInicialDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
