import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpresidencialComponent } from './spresidencial.component';

describe('SpresidencialComponent', () => {
  let component: SpresidencialComponent;
  let fixture: ComponentFixture<SpresidencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpresidencialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpresidencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
