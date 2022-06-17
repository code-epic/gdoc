import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsccargamasivaComponent } from './rsccargamasiva.component';

describe('RsccargamasivaComponent', () => {
  let component: RsccargamasivaComponent;
  let fixture: ComponentFixture<RsccargamasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsccargamasivaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsccargamasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
