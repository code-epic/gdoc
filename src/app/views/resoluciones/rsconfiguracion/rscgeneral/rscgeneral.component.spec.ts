import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscgeneralComponent } from './rscgeneral.component';

describe('RscgeneralComponent', () => {
  let component: RscgeneralComponent;
  let fixture: ComponentFixture<RscgeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscgeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RscgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
