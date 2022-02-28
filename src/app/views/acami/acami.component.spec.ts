import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcamiComponent } from './acami.component';

describe('AcamiComponent', () => {
  let component: AcamiComponent;
  let fixture: ComponentFixture<AcamiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcamiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
