import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovepointsComponent } from './approvepoints.component';

describe('ApprovepointsComponent', () => {
  let component: ApprovepointsComponent;
  let fixture: ComponentFixture<ApprovepointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovepointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovepointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
