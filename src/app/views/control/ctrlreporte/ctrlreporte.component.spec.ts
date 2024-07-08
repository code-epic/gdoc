import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtrlreporteComponent } from './ctrlreporte.component';

describe('CtrlreporteComponent', () => {
  let component: CtrlreporteComponent;
  let fixture: ComponentFixture<CtrlreporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtrlreporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtrlreporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
