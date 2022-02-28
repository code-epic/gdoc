import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimonelComponent } from './timonel.component';

describe('TimonelComponent', () => {
  let component: TimonelComponent;
  let fixture: ComponentFixture<TimonelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimonelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimonelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
