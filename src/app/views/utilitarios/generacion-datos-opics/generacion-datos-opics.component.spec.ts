import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionDatosOpicsComponent } from './generacion-datos-opics.component';

describe('GeneracionDatosOpicsComponent', () => {
  let component: GeneracionDatosOpicsComponent;
  let fixture: ComponentFixture<GeneracionDatosOpicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionDatosOpicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionDatosOpicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
