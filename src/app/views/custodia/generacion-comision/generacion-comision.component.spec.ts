import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionComisionComponent } from './generacion-comision.component';

describe('GeneracionComisionComponent', () => {
  let component: GeneracionComisionComponent;
  let fixture: ComponentFixture<GeneracionComisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionComisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
