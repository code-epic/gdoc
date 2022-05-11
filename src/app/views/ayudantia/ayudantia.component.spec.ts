import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudantiaComponent } from './ayudantia.component';

describe('AyudantiaComponent', () => {
  let component: AyudantiaComponent;
  let fixture: ComponentFixture<AyudantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudantiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
