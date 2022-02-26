import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionesfijasComponent } from './transaccionesfijas.component';

describe('TransaccionesfijasComponent', () => {
  let component: TransaccionesfijasComponent;
  let fixture: ComponentFixture<TransaccionesfijasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaccionesfijasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaccionesfijasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
