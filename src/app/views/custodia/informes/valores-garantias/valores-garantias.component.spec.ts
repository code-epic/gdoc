import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresGarantiasComponent } from './valores-garantias.component';

describe('ValoresGarantiasComponent', () => {
  let component: ValoresGarantiasComponent;
  let fixture: ComponentFixture<ValoresGarantiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoresGarantiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresGarantiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
