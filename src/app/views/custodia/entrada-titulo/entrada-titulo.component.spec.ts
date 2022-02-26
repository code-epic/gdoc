import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaTituloComponent } from './entrada-titulo.component';

describe('EntradaTituloComponent', () => {
  let component: EntradaTituloComponent;
  let fixture: ComponentFixture<EntradaTituloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntradaTituloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
