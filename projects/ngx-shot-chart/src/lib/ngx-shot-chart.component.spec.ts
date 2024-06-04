import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxShotChartComponent } from './ngx-shot-chart.component';

describe('NgxShotChartComponent', () => {
  let component: NgxShotChartComponent;
  let fixture: ComponentFixture<NgxShotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxShotChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxShotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
