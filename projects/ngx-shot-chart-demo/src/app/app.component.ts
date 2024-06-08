import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as d3 from 'd3';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import {
  IChartClickedEvent,
  IShotInfo,
  ISymbolParameters,
  NgxShotChartComponent,
  NgxShotChartLeague,
  NgxShotChartService,
} from 'ngx-shot-chart';

interface SymbolForm extends ISymbolParameters {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxShotChartComponent, ReactiveFormsModule, Highlight, HighlightLineNumbers],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [NgxShotChartService],
})
export class AppComponent {
  title = 'ngx-shot-chart-demo';
  lastCode = signal('');
  lastShotInfo = signal<any>(undefined);

  symbolForm = this.fb.group<SymbolForm>({
    symbol: d3.symbolCircle,
    size: 0.2,
    stroke: '#000000',
    strokeWidth: 0.1,
    fill: '#ffffff',
  });

  leagueForm = this.fb.nonNullable.group<{ league: NgxShotChartLeague }>({
    league: 'nba',
  });

  d3Symbols = [
    { name: 'Circle', value: d3.symbolCircle, code: 'd3.symbolCircle' },
    { name: 'X', value: d3.symbolX, code: 'd3.symbolX' },
    { name: 'Cross', value: d3.symbolCross, code: 'd3.symbolCross' },
    { name: 'Diamond', value: d3.symbolDiamond, code: 'd3.symbolDiamond' },
    { name: 'Square', value: d3.symbolSquare, code: 'd3.symbolSquare' },
    { name: 'Star', value: d3.symbolStar, code: 'd3.symbolStar' },
    { name: 'Triangle', value: d3.symbolTriangle, code: 'd3.symbolTriangle' },
    { name: 'Wye', value: d3.symbolWye, code: 'd3.symbolWye' },
    { name: 'Asterisk', value: d3.symbolAsterisk, code: 'd3.symbolAsterisk' },
  ];

  constructor(
    private shotChart: NgxShotChartService,
    private fb: FormBuilder,
  ) {}

  addShot(chartClick: IChartClickedEvent) {
    const sybolParams = this.symbolForm.value as ISymbolParameters;

    const selectedSymbol = this.d3Symbols.find((s) => s.value === sybolParams.symbol)?.code;

    let lastCode = `this.shotChart.AddShot(click.event,\n\t undefined, \n\t{symbol: ${selectedSymbol},\n\t size: ${sybolParams.size},\n\t fill: '${sybolParams.fill}',\n\t stroke: '${sybolParams.stroke}',\n\t stroleWidth: ${sybolParams.strokeWidth}});`;
    this.lastCode.set(lastCode);
    this.lastShotInfo.set(chartClick.shotInfo);
    this.shotChart.AddShot(chartClick.event, undefined, sybolParams);
  }

  clearShots() {
    this.lastCode.set(`this.shotChart.clearChart();`);
    this.shotChart.clearChart();
  }
}
