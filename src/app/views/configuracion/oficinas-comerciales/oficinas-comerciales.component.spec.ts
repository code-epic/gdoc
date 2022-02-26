import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinasComercialesComponent } from './oficinas-comerciales.component';

describe('OficinasComercialesComponent', () => {
  let component: OficinasComercialesComponent;
  let fixture: ComponentFixture<OficinasComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficinasComercialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinasComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
