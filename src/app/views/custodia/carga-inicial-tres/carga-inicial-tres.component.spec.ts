import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInicialTresComponent } from './carga-inicial-tres.component';

describe('CargaInicialTresComponent', () => {
  let component: CargaInicialTresComponent;
  let fixture: ComponentFixture<CargaInicialTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaInicialTresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaInicialTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
