import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterwhatsappComponent } from './registerwhatsapp.component';

describe('RegisterwhatsappComponent', () => {
  let component: RegisterwhatsappComponent;
  let fixture: ComponentFixture<RegisterwhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterwhatsappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterwhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
