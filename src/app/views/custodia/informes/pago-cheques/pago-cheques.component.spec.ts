import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoChequesComponent } from './pago-cheques.component';

describe('PagoChequesComponent', () => {
  let component: PagoChequesComponent;
  let fixture: ComponentFixture<PagoChequesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoChequesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoChequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
