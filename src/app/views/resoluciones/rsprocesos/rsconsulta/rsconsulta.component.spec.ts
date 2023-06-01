import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsconsultaComponent } from './rsconsulta.component';

describe('RsconsultaComponent', () => {
  let component: RsconsultaComponent;
  let fixture: ComponentFixture<RsconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsconsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
