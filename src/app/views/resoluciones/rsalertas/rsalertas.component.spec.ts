import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsalertasComponent } from './rsalertas.component';

describe('RsalertasComponent', () => {
  let component: RsalertasComponent;
  let fixture: ComponentFixture<RsalertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsalertasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsalertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
