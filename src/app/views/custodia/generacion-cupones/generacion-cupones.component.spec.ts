import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionCuponesComponent } from './generacion-cupones.component';

describe('GeneracionCuponesComponent', () => {
  let component: GeneracionCuponesComponent;
  let fixture: ComponentFixture<GeneracionCuponesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionCuponesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
