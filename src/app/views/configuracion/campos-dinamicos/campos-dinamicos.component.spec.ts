import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamposDinamicosComponent } from './campos-dinamicos.component';

describe('CamposDinamicosComponent', () => {
  let component: CamposDinamicosComponent;
  let fixture: ComponentFixture<CamposDinamicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamposDinamicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamposDinamicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
