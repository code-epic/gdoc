import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompraComponent } from './recompra.component';

describe('RecompraComponent', () => {
  let component: RecompraComponent;
  let fixture: ComponentFixture<RecompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
