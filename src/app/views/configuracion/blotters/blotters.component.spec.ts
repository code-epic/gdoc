import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlottersComponent } from './blotters.component';

describe('BlottersComponent', () => {
  let component: BlottersComponent;
  let fixture: ComponentFixture<BlottersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlottersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlottersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
