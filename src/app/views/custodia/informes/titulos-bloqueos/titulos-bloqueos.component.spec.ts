import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitulosBloqueosComponent } from './titulos-bloqueos.component';

describe('TitulosBloqueosComponent', () => {
  let component: TitulosBloqueosComponent;
  let fixture: ComponentFixture<TitulosBloqueosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitulosBloqueosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitulosBloqueosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
