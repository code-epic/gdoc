import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScuadroDecisorioComponent } from './scuadro-decisorio.component';

describe('ScuadroDecisorioComponent', () => {
  let component: ScuadroDecisorioComponent;
  let fixture: ComponentFixture<ScuadroDecisorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScuadroDecisorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScuadroDecisorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
