import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaExternaComponent } from './salida-externa.component';

describe('SalidaExternaComponent', () => {
  let component: SalidaExternaComponent;
  let fixture: ComponentFixture<SalidaExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidaExternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
