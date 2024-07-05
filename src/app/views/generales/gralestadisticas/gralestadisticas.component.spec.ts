import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GralestadisticasComponent } from './gralestadisticas.component';

describe('GralestadisticasComponent', () => {
  let component: GralestadisticasComponent;
  let fixture: ComponentFixture<GralestadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GralestadisticasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GralestadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
