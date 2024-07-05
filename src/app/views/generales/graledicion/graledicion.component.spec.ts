import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraledicionComponent } from './graledicion.component';

describe('GraledicionComponent', () => {
  let component: GraledicionComponent;
  let fixture: ComponentFixture<GraledicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraledicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraledicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
