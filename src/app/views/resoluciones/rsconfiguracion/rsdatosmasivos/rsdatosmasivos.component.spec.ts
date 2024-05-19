import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsdatosmasivosComponent } from './rsdatosmasivos.component';

describe('RsdatosmasivosComponent', () => {
  let component: RsdatosmasivosComponent;
  let fixture: ComponentFixture<RsdatosmasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsdatosmasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsdatosmasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
