import { ILeagueSettings, IShotchartSettings } from './ngx-shot-chart-models';

function SHOTCHART_SETTINGS(
  _leagueSettings: ILeagueSettings
): IShotchartSettings {
  return {
    basketDiameter: 1.5,
    basketProtrusionLength: 4,
    basketWidth: 6,
    courtLength: 94,
    freeThrowLineLength: 19,
    freeThrowCircleRadius: 6,
    keyMarkWidth: 0.66,
    restrictedCircleRadius: 4,
    leagueSettings: _leagueSettings,
    width: '100%',
    leftBaselineMidrangeInside: {
      x: (145.99621 + 250) / 10,
      y: 81.94051 / 10,
    },
    rightBaselineMidrangeInside: {
      x: (-145.99621 + 250) / 10,
      y: 81.94051 / 10,
    },
    rightWingMidrangeInside: {
      x: (68.29851 + 250) / 10,
      y: 172.92448 / 10,
    },
    leftWingMidrangeInside: {
      x: (-68.29851 + 250) / 10,
      y: 172.92448 / 10,
    },
    rightFloaterInside: {
      x: (25.4622 + 250) / 10,
      y: 90.53112 / 10,
    },
    leftFloaterInside: {
      x: (-25.4622 + 250) / 10,
      y: 90.53112 / 10,
    },
    visibleCourtLength: _leagueSettings.threePointRadius + 10,
  };
}

// angle from the center of the hoop to the corner of the three point line, where the radius collapses into the corner
const FIBA_AngleHoopThree = 12.101492031823499;
const COLL_AngleHoopThree = 12.02699541075422;
const NBA_AngeHoopThree = 22.059310299049454;

const FIBA_SETTINGS: ILeagueSettings = {
  leagueId: 'FIBA',
  keyWidth: 16.08,
  courtWidth: 49.21,
  keyMarks: [5.74147, 9.350394, 12.7953, 15.58399],
  threePointCutOffLength: 9.47,
  threePointRadius: 22.14567,
  threePointSideDistance: 21.653544,
  leftThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
  rightThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
  threePointArcAngles: [FIBA_AngleHoopThree, 180 - FIBA_AngleHoopThree],
};

const COLL_SETTINGS: ILeagueSettings = {
  leagueId: 'COLL',
  keyWidth: 12,
  courtWidth: 50,
  keyMarks: [11, 14, 17],
  threePointCutOffLength: 9.865,
  threePointRadius: 22.146,
  threePointSideDistance: 21.55,
  leftThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
  rightThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
  threePointArcAngles: [COLL_AngleHoopThree, 180 - COLL_AngleHoopThree],
};

const NBA_SETTINGS: ILeagueSettings = {
  leagueId: 'NBA',
  keyWidth: 16,
  courtWidth: 50,
  keyMarks: [7, 8, 11, 14],
  threePointCutOffLength: 13.9,
  threePointRadius: 23.75,
  threePointSideDistance: 21.91,
  leftThreeInside: {
    x: (-120.94543 + 250) / 10,
    y: 251.89778 / 10,
  },
  rightThreeInside: {
    x: (-120.94543 + 250) / 10,
    y: 251.89778 / 10,
  },
  threePointArcAngles: [NBA_AngeHoopThree, 180 - NBA_AngeHoopThree],
};

/** Options to initialize the chart */
export const NgxShotchartSettings = {
  Fiba: SHOTCHART_SETTINGS(FIBA_SETTINGS),
  Coll: SHOTCHART_SETTINGS(COLL_SETTINGS),
  Nba: SHOTCHART_SETTINGS(NBA_SETTINGS),
};
