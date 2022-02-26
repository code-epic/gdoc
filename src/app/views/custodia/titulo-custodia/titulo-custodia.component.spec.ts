import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloCustodiaComponent } from './titulo-custodia.component';

describe('TituloCustodiaComponent', () => {
  let component: TituloCustodiaComponent;
  let fixture: ComponentFixture<TituloCustodiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TituloCustodiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TituloCustodiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
