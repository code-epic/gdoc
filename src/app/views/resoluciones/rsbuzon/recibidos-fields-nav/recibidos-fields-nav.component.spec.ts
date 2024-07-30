import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibidosFieldsNavComponent } from './recibidos-fields-nav.component';

describe('RecibidosFieldsNavComponent', () => {
  let component: RecibidosFieldsNavComponent;
  let fixture: ComponentFixture<RecibidosFieldsNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecibidosFieldsNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibidosFieldsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
