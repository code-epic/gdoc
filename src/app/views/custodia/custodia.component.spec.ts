import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodiaComponent } from './custodia.component';

describe('CustodiaComponent', () => {
  let component: CustodiaComponent;
  let fixture: ComponentFixture<CustodiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustodiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
