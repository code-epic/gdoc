import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicionGlobalComponent } from './posicion-global.component';

describe('PosicionGlobalComponent', () => {
  let component: PosicionGlobalComponent;
  let fixture: ComponentFixture<PosicionGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosicionGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicionGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
