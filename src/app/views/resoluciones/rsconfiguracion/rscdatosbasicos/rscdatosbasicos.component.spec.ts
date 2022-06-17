import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscdatosbasicosComponent } from './rscdatosbasicos.component';

describe('RscdatosbasicosComponent', () => {
  let component: RscdatosbasicosComponent;
  let fixture: ComponentFixture<RscdatosbasicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscdatosbasicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RscdatosbasicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
