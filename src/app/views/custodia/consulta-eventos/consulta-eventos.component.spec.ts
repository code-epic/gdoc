import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEventosComponent } from './consulta-eventos.component';

describe('ConsultaEventosComponent', () => {
  let component: ConsultaEventosComponent;
  let fixture: ComponentFixture<ConsultaEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
