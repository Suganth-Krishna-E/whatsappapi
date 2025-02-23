import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetpointsComponent } from './getpoints.component';

describe('GetpointsComponent', () => {
  let component: GetpointsComponent;
  let fixture: ComponentFixture<GetpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetpointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
