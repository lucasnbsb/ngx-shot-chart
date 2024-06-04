export interface ICourtLocation {
  x: number;
  y: number;
}

export interface IActiveSymbol extends ICourtLocation {
  uuid: string;
  symbol: d3.SymbolType;
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

export interface SymbolClickEvent {
  event: MouseEvent;
  symbol: SVGPathElement;
  id: string;
}

export interface ChartClickedEvent {
  event: MouseEvent;
  shotInfo: ShotInfo;
}

export interface ShotInfo {
  x: number;
  y: number;
  distanceFeet: number;
  distanceMeters: number;
  angleDegrees: number;
  isThreePointer: boolean;
}
