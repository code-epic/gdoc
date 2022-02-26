import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoCobroComponent } from './aviso-cobro.component';

describe('AvisoCobroComponent', () => {
  let component: AvisoCobroComponent;
  let fixture: ComponentFixture<AvisoCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvisoCobroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
