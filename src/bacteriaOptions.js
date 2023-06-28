import { round } from './bacteriumFns';

const _bacteriaOptions = {
  numberOfInitialBacteria: 150,
  refreshTimeout: 33, //ms --> 1000/33 = 30fps
  baseDimension: 7, // % !!

  movePerSecond: 8,
  inclinationPeriodMs: 500, // ms
  inclinationAngle: 1.2,
  casualChangeMaxAngle: 10,
  directionChangeInterval: 800, //ms
  clockwiseChangeInterval: 15000, //ms

  increase: 20, // add 20 more bacteria
  maxNumberOfBacteria: 400,
  increaseDirectionAngleChange: 30, // angle delta when bacterium is duplicated
  increasingDuration: 2200, // ms
  increasingSoundMsDelay: 300, // ms,
  dimensionBeforeDuplicating: 12, // %

  decrease: 20,
  explosionOptions: {
    force: 0.2,
    duration: 1700,
    particleCount: 5,
    width: 250,
  },
  dimensionBeforeExploding: 18, // %
  explosionDelay: 500, // ms
  explosionSoundMsDelay: 300, // ms

  explosionColors1: [
    '#FF7226',
    '#FF9E46',
    '#FFD15D',
    '#F56E92',
    '#F23E6D',
    '#BD0D38',
  ],
  explosionColors2: [
    '#039BE5',
    '#26C6DA',
    '#9CCC65',
    '#4CAF50',
    '#FFB300',
    '#1B5E20',
  ],
};

// Derived options
_bacteriaOptions.casualDirectionChangePeriod = Math.ceil(
  _bacteriaOptions.directionChangeInterval / _bacteriaOptions.refreshTimeout // cycles
);
_bacteriaOptions.clockwiseChangePeriod = Math.ceil(
  _bacteriaOptions.clockwiseChangeInterval / _bacteriaOptions.refreshTimeout // cycles,
);
_bacteriaOptions.movePerCycle =
  (_bacteriaOptions.movePerSecond * _bacteriaOptions.refreshTimeout) / 1000;
_bacteriaOptions.inclinationPeriod = Math.ceil(
  _bacteriaOptions.inclinationPeriodMs / _bacteriaOptions.refreshTimeout // in cycles
);
_bacteriaOptions.explosionDelayCycles = Math.ceil(
  _bacteriaOptions.explosionDelay / _bacteriaOptions.refreshTimeout // in cycles
);
_bacteriaOptions.explosionDurationCycles = Math.ceil(
  _bacteriaOptions.explosionOptions.duration / _bacteriaOptions.refreshTimeout // in cycles
);
_bacteriaOptions.explosionOverallDuration =
  _bacteriaOptions.explosionDelay + _bacteriaOptions.explosionOptions.duration;
_bacteriaOptions.explosionOverallDurationCycles = Math.ceil(
  _bacteriaOptions.explosionOverallDuration / _bacteriaOptions.refreshTimeout // in cycles
);
_bacteriaOptions.increasingDurationCycles = Math.ceil(
  _bacteriaOptions.increasingDuration / _bacteriaOptions.refreshTimeout // in cycles
);

_bacteriaOptions.increasingHighligthFadeInDuration = round(
  _bacteriaOptions.increasingDuration * 0.25,
  0
);

_bacteriaOptions.increasingHighligthFadeInDurationCycles = round(
  _bacteriaOptions.increasingDurationCycles * 0.25,
  0
);
_bacteriaOptions.increasingHighligthFadeOutDurationCycles = round(
  _bacteriaOptions.increasingDurationCycles * 0.25,
  0
);

_bacteriaOptions.duplicationDurationCycles =
  _bacteriaOptions.increasingDurationCycles -
  _bacteriaOptions.increasingHighligthFadeInDurationCycles -
  _bacteriaOptions.increasingHighligthFadeOutDurationCycles;

_bacteriaOptions.translationMovePerCycleDuringDuplication = round(
  _bacteriaOptions.baseDimension /
    2 /
    _bacteriaOptions.duplicationDurationCycles, // I added /2 supposing both parent and child move
  2
);

export const bacteriaOptions = _bacteriaOptions;
