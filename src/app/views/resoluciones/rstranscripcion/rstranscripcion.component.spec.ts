import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RstranscripcionComponent } from './rstranscripcion.component';

describe('RstranscripcionComponent', () => {
  let component: RstranscripcionComponent;
  let fixture: ComponentFixture<RstranscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RstranscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RstranscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
