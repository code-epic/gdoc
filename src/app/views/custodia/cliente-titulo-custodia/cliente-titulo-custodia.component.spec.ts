import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTituloCustodiaComponent } from './cliente-titulo-custodia.component';

describe('ClienteTituloCustodiaComponent', () => {
  let component: ClienteTituloCustodiaComponent;
  let fixture: ComponentFixture<ClienteTituloCustodiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteTituloCustodiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteTituloCustodiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
