import { TestBed } from '@angular/core/testing';

import { ApiAddressHolderService } from './api-address-holder.service';

describe('ApiAddressHolderService', () => {
  let service: ApiAddressHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAddressHolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
