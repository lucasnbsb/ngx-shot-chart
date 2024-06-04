import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import * as d3 from 'd3';
import {
  ChartClickedEvent,
  SymbolClickEvent,
  IShotchartSettings,
  IActiveSymbol,
} from './ngx-shot-chart-models';
import { NgxShotChartService } from './ngx-shot-chart.service';
import { NgxShotchartSettings } from './ngx-shot-chart.constants';

@Component({
  selector: 'ngx-shot-chart',
  standalone: true,
  imports: [],
  template: `<svg
    id="ngx-shotchart-svg"
    (click)="handleChartClicked($event)"
  ></svg>`,
  styleUrl: './ngx-shot-chart.component.css',
})
export class NgxShotChartComponent implements AfterViewInit {
  @Input() league: 'nba' | 'fiba' | 'ncaa' = 'nba';
  @Input() settings?: IShotchartSettings;

  @Output() ChartClicked: EventEmitter<ChartClickedEvent> =
    new EventEmitter<ChartClickedEvent>();
  @Output() SymbolClicked: EventEmitter<SymbolClickEvent> =
    new EventEmitter<SymbolClickEvent>();

  activeSymbols: Map<string, IActiveSymbol> = new Map();
  chartSettings: IShotchartSettings = NgxShotchartSettings.Nba;
  symbolClicked$ = this.chart.getSymbolClickedObservable();

  constructor(private chart: NgxShotChartService) {
    this.symbolClicked$.subscribe((event: SymbolClickEvent) => {
      this.SymbolClicked.emit(event);
    });
  }

  ngOnInit(): void {
    switch (this.league) {
      case 'nba':
        this.chartSettings = NgxShotchartSettings.Nba;
        break;
      case 'fiba':
        this.chartSettings = NgxShotchartSettings.Fiba;
        break;
      case 'ncaa':
        this.chartSettings = NgxShotchartSettings.Coll;
        break;
    }

    if (this.settings) {
      this.chartSettings = this.settings;
    }
  }

  ngAfterViewInit(): void {
    this.chart.drawCourt(this.chartSettings);
  }

  /**
   * Handles the click event on the shot chart.
   *
   * @param {MouseEvent} event - The click event.
   */
  handleChartClicked(event: MouseEvent): void {
    const coords = d3.pointer(event);
    const shotInfo = this.chart.calculateShotInfo(coords[0], coords[1]);
    this.ChartClicked.emit({ event: event, shotInfo: shotInfo });
  }
}
