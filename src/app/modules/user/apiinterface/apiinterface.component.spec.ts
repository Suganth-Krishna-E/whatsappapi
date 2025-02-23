import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiinterfaceComponent } from './apiinterface.component';

describe('ApiinterfaceComponent', () => {
  let component: ApiinterfaceComponent;
  let fixture: ComponentFixture<ApiinterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiinterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiinterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
