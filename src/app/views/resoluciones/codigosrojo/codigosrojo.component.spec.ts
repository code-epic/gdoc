import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigosrojoComponent } from './codigosrojo.component';

describe('CodigosrojoComponent', () => {
  let component: CodigosrojoComponent;
  let fixture: ComponentFixture<CodigosrojoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodigosrojoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigosrojoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
