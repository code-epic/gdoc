import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtrlestadisticasComponent } from './ctrlestadisticas.component';

describe('CtrlestadisticasComponent', () => {
  let component: CtrlestadisticasComponent;
  let fixture: ComponentFixture<CtrlestadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtrlestadisticasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtrlestadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
