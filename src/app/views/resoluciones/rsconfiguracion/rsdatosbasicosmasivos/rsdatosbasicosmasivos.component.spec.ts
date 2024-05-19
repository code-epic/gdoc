import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsdatosbasicosmasivosComponent } from './rsdatosbasicosmasivos.component';

describe('RsdatosbasicosmasivosComponent', () => {
  let component: RsdatosbasicosmasivosComponent;
  let fixture: ComponentFixture<RsdatosbasicosmasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsdatosbasicosmasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsdatosbasicosmasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
