import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTituloComponent } from './detalle-titulo.component';

describe('DetalleTituloComponent', () => {
  let component: DetalleTituloComponent;
  let fixture: ComponentFixture<DetalleTituloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTituloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
