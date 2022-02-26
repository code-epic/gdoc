import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InversionwComponent } from './inversionw.component';

describe('InversionwComponent', () => {
  let component: InversionwComponent;
  let fixture: ComponentFixture<InversionwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InversionwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InversionwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
