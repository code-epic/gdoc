import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscpublicacionesComponent } from './rscpublicaciones.component';

describe('RscpublicacionesComponent', () => {
  let component: RscpublicacionesComponent;
  let fixture: ComponentFixture<RscpublicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscpublicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RscpublicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
