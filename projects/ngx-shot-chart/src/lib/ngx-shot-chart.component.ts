import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import {
  IChartClickedEvent,
  ISymbolClickEvent,
  IShotchartSettings,
  IActiveSymbol,
  NgxShotChartLeague,
} from './ngx-shot-chart-models';
import { NgxShotChartService } from './ngx-shot-chart.service';
import { NgxShotchartSettings } from './ngx-shot-chart.constants';

@Component({
  selector: 'ngx-shot-chart',
  standalone: true,
  imports: [],
  template: `<svg id="ngx-shotchart-svg" (click)="handleChartClicked($event)"></svg>`,
  styleUrl: './ngx-shot-chart.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NgxShotChartComponent implements AfterViewInit, OnChanges {
  @Input() league: NgxShotChartLeague = 'nba';
  @Input() settings?: IShotchartSettings;

  @Output() ChartClicked: EventEmitter<IChartClickedEvent> = new EventEmitter<IChartClickedEvent>();
  @Output() SymbolClicked: EventEmitter<ISymbolClickEvent> = new EventEmitter<ISymbolClickEvent>();

  activeSymbols: Map<string, IActiveSymbol> = new Map();
  chartSettings: IShotchartSettings = NgxShotchartSettings.Nba;
  symbolClicked$ = this.chart.getSymbolClickedObservable();

  constructor(private chart: NgxShotChartService) {
    this.symbolClicked$.subscribe((event: ISymbolClickEvent) => {
      this.SymbolClicked.emit(event);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['league']) {
      this.updateLeagueSettings(changes['league'].currentValue);
      this.chart.drawCourt(this.chartSettings);
    }
  }

  ngOnInit(): void {
    this.updateLeagueSettings(this.league);

    if (this.settings) {
      this.chartSettings = this.settings;
    }
  }

  updateLeagueSettings(league: NgxShotChartLeague) {
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
