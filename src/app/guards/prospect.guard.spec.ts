import { TestBed } from '@angular/core/testing';

import { ProspectGuard } from './prospect.guard';

describe('ProspectGuard', () => {
  let guard: ProspectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProspectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
