import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalertaComponent } from './salerta.component';

describe('SalertaComponent', () => {
  let component: SalertaComponent;
  let fixture: ComponentFixture<SalertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
