export interface ICourtLocation {
  x: number;
  y: number;
}

export interface ISymbolParameters {
  symbol: d3.SymbolType;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface IActiveSymbol extends ICourtLocation, ISymbolParameters {
  uuid: string;
}

export interface ILeagueSettings {
  leagueId: string;
  keyWidth: number;
  keyMarks: number[];
  courtWidth: number;
  threePointCutOffLength: number;
  threePointRadius: number;
  threePointSideDistance: number;
  leftThreeInside: ICourtLocation;
  rightThreeInside: ICourtLocation;
  threePointArcAngles: number[];
}

export interface IShotchartSettings {
  basketDiameter: number;
  basketProtrusionLength: number;
  basketWidth: number;
  courtLength: number;
  freeThrowLineLength: number;
  freeThrowCircleRadius: number;
  keyMarkWidth: number;
  restrictedCircleRadius: number;
  leagueSettings: ILeagueSettings;
  width: string;
  leftBaselineMidrangeInside: ICourtLocation;
  rightBaselineMidrangeInside: ICourtLocation;
  rightWingMidrangeInside: ICourtLocation;
  leftWingMidrangeInside: ICourtLocation;
  rightFloaterInside: ICourtLocation;
  leftFloaterInside: ICourtLocation;
  visibleCourtLength: number;
}

export interface IDrawCourt {
  baseElement: any;
  courtLines: ICourtLines;
}

export interface ICourtLines {
  [index: string]: ICourtLocation[];
}

export interface ISymbolClickEvent {
  event: MouseEvent;
  symbol: SVGPathElement;
  id: string;
}

export interface IChartClickedEvent {
  event: MouseEvent;
  shotInfo: IShotInfo;
}

export interface IShotInfo {
  x: number;
  y: number;
  distanceFeet: number;
  distanceMeters: number;
  angleDegrees: number;
  isThreePointer: boolean;
}

export type NgxShotChartLeague = 'nba' | 'fiba' | 'ncaa';
