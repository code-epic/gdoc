import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsrevisionComponent } from './rsrevision.component';

describe('RsrevisionComponent', () => {
  let component: RsrevisionComponent;
  let fixture: ComponentFixture<RsrevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsrevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsrevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
