import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsgeneralesComponent } from './rsgenerales.component';

describe('RsgeneralesComponent', () => {
  let component: RsgeneralesComponent;
  let fixture: ComponentFixture<RsgeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsgeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsgeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
