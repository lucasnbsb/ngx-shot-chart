# NgxShotChart 🏀

A simple way to create shotcharts in real time with Angular and d3.js.

## Basic functionality
This lib exposes a `ShotChartComponent` that renders a shot chart and a `ShotChartService` with primitives to manipulate symbols in the chart.


## The component
- Only emmits the mutually esclusive  `ChartClicked` and `SymbolClicked` events 
- Symbols can be any [d3.symbolType](https://d3js.org/d3-shape/symbol#symbolsFill)
- Court and symbols default fill collor is the current text color
- ⛹️ Pre-configured with NBA, FIBA and NCAA court sizes

## The service

Exposes a crud interface for shots, methods to draw and clear the court and symbols, and utilities.

### Usage:

```typescript
import { ShotChartService } from 'ngx-shot-chart';

constructor(private shotChartService: ShotChartService) {}

// Add a shot to the chart whenever it is clicked 🪣
handleChartClick(event: ChartClickedEvent) {
  this.chart.AddShot(event, d3.symbolCircle);
}

// Remove a shot from the chart whenever the symbol is clicked 🗑️
handleSymbolClick(event: SymbolClickEvent) {
  this.chart.RemoveShot(event.id);
}
```