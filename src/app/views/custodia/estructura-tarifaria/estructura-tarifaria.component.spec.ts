import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraTarifariaComponent } from './estructura-tarifaria.component';

describe('EstructuraTarifariaComponent', () => {
  let component: EstructuraTarifariaComponent;
  let fixture: ComponentFixture<EstructuraTarifariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstructuraTarifariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstructuraTarifariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
