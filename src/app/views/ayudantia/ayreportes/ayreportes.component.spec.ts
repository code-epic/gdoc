import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyreportesComponent } from './ayreportes.component';

describe('AyreportesComponent', () => {
  let component: AyreportesComponent;
  let fixture: ComponentFixture<AyreportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyreportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyreportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
