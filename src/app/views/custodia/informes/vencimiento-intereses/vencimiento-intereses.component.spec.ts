import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VencimientoInteresesComponent } from './vencimiento-intereses.component';

describe('VencimientoInteresesComponent', () => {
  let component: VencimientoInteresesComponent;
  let fixture: ComponentFixture<VencimientoInteresesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VencimientoInteresesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VencimientoInteresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
