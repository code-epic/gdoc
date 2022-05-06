import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsentradasComponent } from './rsentradas.component';

describe('RsentradasComponent', () => {
  let component: RsentradasComponent;
  let fixture: ComponentFixture<RsentradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsentradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsentradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
