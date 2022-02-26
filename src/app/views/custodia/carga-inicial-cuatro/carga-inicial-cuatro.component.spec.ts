import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInicialCuatroComponent } from './carga-inicial-cuatro.component';

describe('CargaInicialCuatroComponent', () => {
  let component: CargaInicialCuatroComponent;
  let fixture: ComponentFixture<CargaInicialCuatroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaInicialCuatroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaInicialCuatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
