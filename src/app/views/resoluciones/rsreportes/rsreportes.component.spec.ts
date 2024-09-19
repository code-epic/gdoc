import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsreportesComponent } from './rsreportes.component';

describe('RsreportesComponent', () => {
  let component: RsreportesComponent;
  let fixture: ComponentFixture<RsreportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsreportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsreportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
