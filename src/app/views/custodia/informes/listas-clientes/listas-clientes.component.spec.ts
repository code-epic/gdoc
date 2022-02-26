import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasClientesComponent } from './listas-clientes.component';

describe('ListasClientesComponent', () => {
  let component: ListasClientesComponent;
  let fixture: ComponentFixture<ListasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
