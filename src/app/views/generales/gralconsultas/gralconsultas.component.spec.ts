import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GralconsultasComponent } from './gralconsultas.component';

describe('GralconsultasComponent', () => {
  let component: GralconsultasComponent;
  let fixture: ComponentFixture<GralconsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GralconsultasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GralconsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
