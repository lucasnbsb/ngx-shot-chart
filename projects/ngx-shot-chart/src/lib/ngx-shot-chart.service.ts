import { Injectable, Inject } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import {
  SymbolClickEvent,
  IActiveSymbol,
  IShotchartSettings,
  ShotInfo,
  ICourtLocation,
  IDrawCourt,
  ILeagueSettings,
  ICourtLines,
} from './ngx-shot-chart-models';
import { NgxShotchartSettings } from './ngx-shot-chart.constants';

@Injectable()
export class NgxShotChartService {
  /** Observable for all click events in symbols added to the chart*/
  private symbolClicked$: Subject<SymbolClickEvent> = new Subject();
  public activeSymbols: Map<string, IActiveSymbol> = new Map();

  readonly chartSelector = '#ngx-shotchart-svg';
  readonly threePointLineClass = 'ngx-shot-chart-court-3pt-line';

  // private activeSymbols:

  /**  The calculation for the shot being a 3 pointer needs data from the settings*/
  lastRenderedSettings: IShotchartSettings = NgxShotchartSettings.Nba;

  constructor() {}

  /** Observable for all click events in symbols added to the chart*/
  getSymbolClickedObservable() {
    return this.symbolClicked$.asObservable();
  }

  /**
   * Draws a symbol on the chart. Uses the last rendered settings
   *
   * @param symbolType The type of symbol to draw.
   * @param x The x-coordinate of the symbol.
   * @param y The y-coordinate of the symbol.
   * @param size The size of the symbol.
   * @param stroke The color of the symbol's stroke.
   * @param strokeWidth The width of the symbol's stroke.
   * @param fill css color for the fill of the symbol
   * @returns The uuid generated for the symbol
   */
  drawSymbol(
    id: string,
    symbolType: d3.SymbolType,
    x: number,
    y: number,
    size: number,
    stroke: string,
    strokeWidth: number,
    fill?: string
  ): string {
    const subject = this.symbolClicked$;
    function onClickHandler(this: SVGPathElement, event: MouseEvent) {
      subject.next({ event: event, symbol: this, id: this.id });
      event.stopImmediatePropagation();
    }

    if (!fill) {
      fill = 'currentColor';
    }
    const symbol = d3.symbol().type(symbolType).size(size);
    const newSymbol = d3
      .select(this.chartSelector)
      .append('path')
      .attr('d', symbol)
      .attr('id', id)
      .attr('class', 'ngx-shot-chart-symbol')
      .style('fill', fill)
      .style('stroke', stroke)
      .style('stroke-width', strokeWidth)
      .style('z-index', 1000)
      .attr('transform', 'translate(' + x + ',' + y + ')');

    newSymbol.on('click', onClickHandler);
    return id;
  }

  /**
   * Calculates distance, angle and if the shot is a 3 pointer, based on the center of the hoop and the last rendered settings
   *
   * @param x The x-coordinate of the shot.
   * @param y The y-coordinate of the shot.
   * @returns {ShotInfo} The shot information object containing the distance, angle, and other details.
   */
  calculateShotInfo(x: number, y: number): ShotInfo {
    const hoopCenter = d3.select('#ngx-shot-chart-court-hoop-center');
    const hoopCenterX = parseFloat(hoopCenter.attr('cx'));
    const hoopCenterY = parseFloat(hoopCenter.attr('cy'));
    const distance = this.euclidianDistance(x, y, hoopCenterX, hoopCenterY);
    const angleDegrees = this.angleBetweenPoints(
      hoopCenterX,
      hoopCenterY,
      x,
      y
    );

    const result: ShotInfo = {
      distanceFeet: distance,
      distanceMeters: distance * 0.3048,
      angleDegrees: angleDegrees,
      isThreePointer: this.isThreePointer(
        distance,
        angleDegrees,
        this.lastRenderedSettings.leagueSettings
      ),
      x: x,
      y: y,
    };
    return result;
  }

  /**
   * Redraws the shot chart and all active activeSymbols
   * @throws {Error} If no chart settings are injected
   */
  redrawChart(settings: IShotchartSettings) {
    if (settings) {
      this.drawCourt(settings);
    } else {
      throw new Error(
        'No chart settings found injected. Please provide a chart settings object thorugh the NGX_SHOT_CHART_SETTINGS token'
      );
    }

    d3.selectAll('.ngx-shot-chart-symbol').remove();
    if (this.activeSymbols.size) {
      this.activeSymbols.forEach((symbol) => {
        this.drawSymbol(
          symbol.uuid,
          symbol.symbol,
          symbol.x,
          symbol.y,
          0.2,
          'black',
          0.1
        );
      });
    }
  }

  /**
   * Adds a shot to the shot chart.
   *
   * @param {MouseEvent | ICourtLocation} coordinates The coordinates of the shot. It can be either a MouseEvent or an object with `x` and `y` properties.
   * @param {d3.SymbolType} symbol The symbol type for the shot.
   * @param {string} [id] The id of the shot. If not provided, a random uuid will be generated.
   * @returns {string} The id of the added shot.
   */
  AddShot(
    coordinates: MouseEvent | ICourtLocation,
    symbol: d3.SymbolType,
    id?: string
  ): string {
    if (!id) {
      id = crypto.randomUUID();
    }
    const coords =
      coordinates instanceof MouseEvent
        ? d3.pointer(coordinates)
        : [coordinates.x, coordinates.y];
    this.activeSymbols.set(id, {
      uuid: id,
      x: coords[0],
      y: coords[1],
      symbol: symbol,
    });
    this.redrawChart(this.lastRenderedSettings);
    return id;
  }

  /**
   * Adds multiple shots to the shot chart. Redraws the chart after adding all shots.
   * Charts with the same Id will overwrite the previous shot
   *
   * @param {IActiveSymbol[]} shots The shots to add.
   */
  bulkAddShots(shots: IActiveSymbol[]): void {
    shots.forEach((shot) => {
      this.activeSymbols.set(shot.uuid, shot);
    });
    this.redrawChart(this.lastRenderedSettings);
  }

  /** Removes a shot from the chart by IDrawCourt
   * @param {string} uuid - The id of the shot to remove.
   */
  removeShot(uuid: string): void {
    this.activeSymbols.delete(uuid);
    this.redrawChart(this.lastRenderedSettings);
  }

  /**
   * Updates the position and symbol of a shot on the shot chart.
   *
   * @param {string} uuid - The id of the shot to update.
   * @param {ICourtLocation} coordinates - The new coordinates of the shot.
   * @param {d3.SymbolType} symbol - The new symbol type for the shot.
   */
  updateShot(
    uuid: string,
    coordinates: ICourtLocation,
    symbol: d3.SymbolType
  ): void {
    this.activeSymbols.set(uuid, {
      uuid: uuid,
      x: coordinates.x,
      y: coordinates.y,
      symbol: symbol,
    });
    this.redrawChart(this.lastRenderedSettings);
  }

  /**
   * Clears all shots from the shot chart.
   */
  clearChart(): void {
    this.activeSymbols.clear();
    this.redrawChart(this.lastRenderedSettings);
  }

  /** Draws the court with the specified settings, use alongside NgxShotchartSettings for pre-configured leagues*/
  drawCourt(settings: IShotchartSettings): IDrawCourt {
    if (!settings) {
      throw new Error(
        'No chart settings found injected. Please provide a chart settings object thorugh the NGX_SHOT_CHART_SETTINGS token'
      );
    }
    this.lastRenderedSettings = settings;
    const courtLines = {
      threePointLineXY: [],
      restrictedAreaXY: [],
      ftOutXY: [],
      floaterXY: [],
      rimXY: [],
    };

    // Set the viewbox for the chart.
    const baseElement = d3
      .select(this.chartSelector)
      .attr('width', settings.width)
      // min-x min-y width height
      .attr(
        'viewBox',
        `0 0 ${settings.leagueSettings.courtWidth} ${settings.visibleCourtLength}`
      )
      .append('g')
      .attr('class', 'ngx-shot-chart-court');

    // Key
    baseElement
      .append('rect')
      .attr('class', 'ngx-shot-chart-court-key')
      .attr(
        'x',
        settings.leagueSettings.courtWidth / 2 -
          settings.leagueSettings.keyWidth / 2
      )
      .attr('y', settings.visibleCourtLength - settings.freeThrowLineLength)
      .attr('width', settings.leagueSettings.keyWidth)
      .attr('height', settings.freeThrowLineLength);

    // Baseline
    baseElement
      .append('line')
      .attr('class', 'ngx-shot-chart-court-baseline')
      .attr('x1', 0)
      .attr('y1', settings.visibleCourtLength)
      .attr('x2', settings.leagueSettings.courtWidth)
      .attr('y2', settings.visibleCourtLength);

    // bet you though you would never use arctan for anything
    const tpAngle = Math.atan(
      settings.leagueSettings.threePointSideDistance /
        (settings.leagueSettings.threePointCutOffLength -
          settings.basketProtrusionLength -
          settings.basketDiameter / 2)
    );

    // Three point arc.
    this.appendArcPath(
      baseElement,
      settings.leagueSettings.threePointRadius,
      -1 * tpAngle,
      tpAngle,
      settings.leagueSettings.courtWidth / 2,
      settings.visibleCourtLength -
        settings.basketProtrusionLength -
        settings.basketDiameter / 2,
      'threePointLineXY',
      courtLines
    )
      .attr('class', this.threePointLineClass)
      .attr(
        'transform',
        'translate(' +
          settings.leagueSettings.courtWidth / 2 +
          ', ' +
          (settings.visibleCourtLength -
            settings.basketProtrusionLength -
            settings.basketDiameter / 2) +
          ')'
      );

    // Corners of the three point line
    [1, -1].forEach(function (n) {
      baseElement
        .append('line')
        .attr('class', 'ngx-shot-chart-court-3pt-line')
        .attr(
          'x1',
          settings.leagueSettings.courtWidth / 2 +
            settings.leagueSettings.threePointSideDistance * n
        )
        .attr(
          'y1',
          settings.visibleCourtLength -
            settings.leagueSettings.threePointCutOffLength
        )
        .attr(
          'x2',
          settings.leagueSettings.courtWidth / 2 +
            settings.leagueSettings.threePointSideDistance * n
        )
        .attr('y2', settings.visibleCourtLength);
    });

    // Restricted area
    this.appendArcPath(
      baseElement,
      settings.restrictedCircleRadius,
      (-1 * Math.PI) / 2,
      Math.PI / 2,
      settings.leagueSettings.courtWidth / 2,
      settings.visibleCourtLength -
        settings.basketProtrusionLength -
        settings.basketDiameter / 2,
      'restrictedAreaXY',
      courtLines
    )
      .attr('class', 'ngx-shot-chart-court-restricted-area')
      .attr(
        'transform',
        'translate(' +
          settings.leagueSettings.courtWidth / 2 +
          ', ' +
          (settings.visibleCourtLength -
            settings.basketProtrusionLength -
            settings.basketDiameter / 2) +
          ')'
      );

    // Free throw circle
    this.appendArcPath(
      baseElement,
      settings.freeThrowCircleRadius,
      (-1 * Math.PI) / 2,
      Math.PI / 2,
      settings.leagueSettings.courtWidth / 2,
      settings.visibleCourtLength - settings.freeThrowLineLength,
      'ftOutXY',
      courtLines
    )
      .attr('class', 'ngx-shot-chart-court-ft-circle-top')
      .attr(
        'transform',
        'translate(' +
          settings.leagueSettings.courtWidth / 2 +
          ', ' +
          (settings.visibleCourtLength - settings.freeThrowLineLength) +
          ')'
      );

    if (settings.leagueSettings.leagueId == 'nba') {
      this.appendArcPath(
        baseElement,
        settings.freeThrowCircleRadius,
        Math.PI / 2,
        1.5 * Math.PI
      )
        .attr('class', 'ngx-shot-chart-court-ft-circle-bottom')
        .attr(
          'transform',
          'translate(' +
            settings.leagueSettings.courtWidth / 2 +
            ', ' +
            (settings.visibleCourtLength - settings.freeThrowLineLength) +
            ')'
        );
    } else if (settings.leagueSettings.leagueId == 'coll') {
      // Draw the paint area for college ball
      baseElement
        .append('rect')
        .attr('class', 'ngx-shot-chart-court-key-block')
        .attr(
          'x',
          settings.leagueSettings.courtWidth / 2 -
            settings.leagueSettings.keyWidth / 2 -
            0.66
        )
        .attr('y', settings.visibleCourtLength - 7)
        .attr('width', 0.66)
        .attr('height', 1)
        .style('fill', 'black');

      baseElement
        .append('rect')
        .attr('class', 'ngx-shot-chart-court-key-block')
        .attr(
          'x',
          settings.leagueSettings.courtWidth / 2 +
            settings.leagueSettings.keyWidth / 2
        )
        .attr('y', settings.visibleCourtLength - 7)
        .attr('width', 0.66)
        .attr('height', 1)
        .style('fill', 'black');
    }

    // Key marks for free throw rebound positioning
    settings.leagueSettings.keyMarks.forEach(function (mark: number) {
      [1, -1].forEach(function (n) {
        baseElement
          .append('line')
          .attr('class', 'ngx-shot-chart-court-key-mark')
          .attr(
            'x1',
            settings.leagueSettings.courtWidth / 2 +
              (settings.leagueSettings.keyWidth / 2) * n +
              settings.keyMarkWidth * n
          )
          .attr('y1', settings.visibleCourtLength - mark)
          .attr(
            'x2',
            settings.leagueSettings.courtWidth / 2 +
              (settings.leagueSettings.keyWidth / 2) * n
          )
          .attr('y2', settings.visibleCourtLength - mark);
      });
    });

    // Backboard
    baseElement
      .append('line')
      .attr('class', 'ngx-shot-chart-court-backboard')
      .attr(
        'x1',
        settings.leagueSettings.courtWidth / 2 - settings.basketWidth / 2
      )
      .attr('y1', settings.visibleCourtLength - settings.basketProtrusionLength)
      .attr(
        'x2',
        settings.leagueSettings.courtWidth / 2 + settings.basketWidth / 2
      )
      .attr(
        'y2',
        settings.visibleCourtLength - settings.basketProtrusionLength
      );

    // Hoop
    baseElement
      .append('circle')
      .attr('class', 'ngx-shot-chart-court-hoop')
      .attr('cx', settings.leagueSettings.courtWidth / 2)
      .attr(
        'cy',
        settings.visibleCourtLength -
          settings.basketProtrusionLength -
          settings.basketDiameter / 2
      )
      .attr('r', settings.basketDiameter / 2);

    // invisible point at the center of the hoop for calculating distances
    baseElement
      .append('circle')
      .attr('id', 'ngx-shot-chart-court-hoop-center')
      .attr('cx', settings.leagueSettings.courtWidth / 2)
      .attr(
        'cy',
        settings.visibleCourtLength -
          settings.basketProtrusionLength -
          settings.basketDiameter / 2
      )
      .attr('r', 0);

    return { baseElement: baseElement, courtLines };
  }

  /** Calculates if a shot is worth 3 points or 2*/
  // heavy elementary school math ahead
  private isThreePointer(
    distance: number,
    angle: number,
    leagueSettings: ILeagueSettings
  ) {
    const threePointArcAngles = leagueSettings.threePointArcAngles;
    const threePointArcDistance = leagueSettings.threePointRadius;
    const isInTheArc =
      angle > threePointArcAngles[0] && angle < threePointArcAngles[1];

    if (isInTheArc) {
      return Math.abs(distance) > Math.abs(threePointArcDistance);
    } else {
      // calculate the hypotenuse of the shot to the hoop
      const cos = Math.cos(this.degreesToRadians(angle));
      const hipotenuse = leagueSettings.threePointSideDistance / cos;
      return Math.abs(distance) > Math.abs(hipotenuse);
    }
  }

  // Angle between two points assuming a line paralel to y on the first point
  private angleBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    const dy = y1 - y2;
    const dx = x1 - x2;
    const radians = Math.atan2(dy, dx); // range (-PI, PI]
    const degrees = this.radiansToDegrees(radians); // rads to degs, range (-180, 180]
    return degrees;
  }

  // more elementary school math
  private euclidianDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Appends an arc path to the base element.
   *
   * @param {any} baseElement - The element receiving the chart.
   * @param {number} radius - The radius of the arc.
   * @param {number} startAngle - The starting angle of the arc in radians.
   * @param {number} endAngle - The ending angle of the arc in radians.
   * @param {number} [translateX] - The translation along the x-axis.
   * @param {number} [translateY] - The translation along the y-axis.
   * @param {string} [xyState] - The state of the XY coordinates.
   * @param {ICourtLines} [courtLines] - The court lines object.
   * @returns {any} The appended path element.
   */
  private appendArcPath(
    baseElement: any,
    radius: number,
    startAngle: number,
    endAngle: number,
    translateX?: number,
    translateY?: number,
    xyState?: string,
    courtLines?: ICourtLines
  ): any {
    // amount of line segments for the arc
    const points = 1500;

    const a = d3
      .scaleLinear()
      .domain([0, points - 1])
      .range([startAngle, endAngle]);

    const temp: ICourtLocation[] = [];
    const line = d3
      .lineRadial()
      .radius(radius)
      .angle(function (d: [number, number], i: number) {
        temp.push({
          x:
            (translateX === undefined ? 0 : translateX) +
            radius * Math.cos(a(i) - Math.PI / 2),
          y:
            (translateY === undefined ? 0 : translateY) +
            radius * Math.sin(a(i) - Math.PI / 2),
        });
        return a(i);
      });

    if (xyState !== undefined && courtLines !== undefined) {
      courtLines[xyState] = temp;
    }
    return baseElement.append('path').datum(d3.range(points)).attr('d', line);
  }
}
