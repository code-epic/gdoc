import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsconfiguracionComponent } from './rsconfiguracion.component';

describe('RsconfiguracionComponent', () => {
  let component: RsconfiguracionComponent;
  let fixture: ComponentFixture<RsconfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsconfiguracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsconfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
