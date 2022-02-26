import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosFinancierosComponent } from './instrumentos-financieros.component';

describe('InstrumentosFinancierosComponent', () => {
  let component: InstrumentosFinancierosComponent;
  let fixture: ComponentFixture<InstrumentosFinancierosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosFinancierosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosFinancierosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
