import { TestBed } from '@angular/core/testing';

import { NgxShotChartService } from './ngx-shot-chart.service';

describe('NgxShotChartService', () => {
  let service: NgxShotChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxShotChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
