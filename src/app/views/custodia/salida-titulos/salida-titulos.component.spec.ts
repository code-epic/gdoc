import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaTitulosComponent } from './salida-titulos.component';

describe('SalidaTitulosComponent', () => {
  let component: SalidaTitulosComponent;
  let fixture: ComponentFixture<SalidaTitulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidaTitulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
