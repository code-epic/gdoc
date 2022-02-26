import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionesLiquidadasComponent } from './transacciones-liquidadas.component';

describe('TransaccionesLiquidadasComponent', () => {
  let component: TransaccionesLiquidadasComponent;
  let fixture: ComponentFixture<TransaccionesLiquidadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaccionesLiquidadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaccionesLiquidadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
