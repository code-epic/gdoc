import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechavalorComponent } from './fechavalor.component';

describe('FechavalorComponent', () => {
  let component: FechavalorComponent;
  let fixture: ComponentFixture<FechavalorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FechavalorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FechavalorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
