import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinaDetallesComponent } from './oficina-detalles.component';

describe('OficinaDetallesComponent', () => {
  let component: OficinaDetallesComponent;
  let fixture: ComponentFixture<OficinaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficinaDetallesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
