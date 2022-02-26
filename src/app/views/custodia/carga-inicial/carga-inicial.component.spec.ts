import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInicialComponent } from './carga-inicial.component';

describe('CargaInicialComponent', () => {
  let component: CargaInicialComponent;
  let fixture: ComponentFixture<CargaInicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaInicialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
