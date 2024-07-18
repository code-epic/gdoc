import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGrallibroModalComponent } from './table-grallibro-modal.component';

describe('TableGrallibroModalComponent', () => {
  let component: TableGrallibroModalComponent;
  let fixture: ComponentFixture<TableGrallibroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableGrallibroModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableGrallibroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
