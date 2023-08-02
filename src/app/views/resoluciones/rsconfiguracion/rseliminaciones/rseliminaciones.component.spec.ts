import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RseliminacionesComponent } from './rseliminaciones.component';

describe('RseliminacionesComponent', () => {
  let component: RseliminacionesComponent;
  let fixture: ComponentFixture<RseliminacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RseliminacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RseliminacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
