import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosespecialesComponent } from './usuariosespeciales.component';

describe('UsuariosespecialesComponent', () => {
  let component: UsuariosespecialesComponent;
  let fixture: ComponentFixture<UsuariosespecialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosespecialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosespecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
