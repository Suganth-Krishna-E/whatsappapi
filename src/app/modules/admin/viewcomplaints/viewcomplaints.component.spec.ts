import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcomplaintsComponent } from './viewcomplaints.component';

describe('ViewcomplaintsComponent', () => {
  let component: ViewcomplaintsComponent;
  let fixture: ComponentFixture<ViewcomplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewcomplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewcomplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
