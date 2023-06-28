import { shuffleArray } from './shuffle';

export const round = (number, decimals = 4) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

let bacteriaLatestID = 1;

export const generateBacteria = (
  { numberOfInitialBacteria, baseDimension, ...options },
  caller = undefined
) => {
  const bacteria = [];

  for (let i = 0; i < numberOfInitialBacteria; i++) {
    const initialDirection = round(Math.random() * 360);
    bacteria.push({
      id: bacteriaLatestID++,
      source: bacteriaLatestID % 2,
      x: round(Math.random() * (100 - 0) + 0),
      y: round(Math.random() * (100 - 0) + 0),
      initialDirection,
      direction: initialDirection,
      dimension: baseDimension,
    });
  }

  return { bacteria, cycle: 1 };
};

const generateChange = (casualChangeMaxAngle, clockwise) =>
  round(
    Math.random() * (casualChangeMaxAngle - 0) -
      (clockwise ? casualChangeMaxAngle : 0)
  );

const ensurePositionIsOk = ({ x: _x, y: _y }) => {
  let x = _x;
  let y = _y;

  if (x < -10) {
    x = 100;
  } else if (x > 100) {
    x = -10;
  }
  if (y < -10) {
    y = 100;
  } else if (y > 100) {
    y = -10;
  }

  return { x, y };
};

const calculateNewPosition = (
  cycle,
  { x, y, initialDirection, ...bacterium },
  { movePerCycle, inclinationPeriod, inclinationAngle, ...options }
) => ({
  correction: round(
    Math.cos((cycle / inclinationPeriod) * Math.PI * 2) * inclinationAngle
  ),
  deltaX: round(
    Math.cos((initialDirection + 90) * (Math.PI / 180)) * movePerCycle
  ),
  deltaY: round(
    Math.sin((initialDirection + 90) * (Math.PI / 180)) * movePerCycle
  ),
});

export const calculateBacteriaPositionForCycle = (
  cycle,
  bacteria,
  {
    casualChangeMaxAngle,
    casualDirectionChangePeriod,
    clockwiseChangePeriod,
    baseDimension,
    dimensionBeforeExploding,
    explosionDelayCycles,
    dimensionBeforeDuplicating,
    increasingHighligthFadeInDurationCycles,
    translationMovePerCycleDuringDuplication,
    increasingHighligthFadeOutDurationCycles,
    ...options
  }
) => {
  let clockwise = round(cycle / clockwiseChangePeriod, 0) % 2 === 0;
  const toPush = [];
  const updatedBacteria = bacteria
    .filter(({ explodedOn }) => !(cycle >= explodedOn))
    .map((bacterium) => {
      let {
        direction,
        initialDirection,
        explodesOn,
        explodedOn,
        duplicatesOn,
        duplicatedOn,
        startsMovingOn,
      } = bacterium;

      // explosion
      if (explodesOn || explodedOn) {
        // explosion is about to start
        if (cycle < explodesOn) {
          let t =
            (explosionDelayCycles - (explodesOn - cycle)) /
            explosionDelayCycles;
          if (t > 1) {
            t = 1;
          }
          const alpha = round(t * t);
          const newDimension = round(
            (dimensionBeforeExploding - baseDimension) * alpha + baseDimension
          );
          return {
            ...bacterium,
            dimension: newDimension,
          };
        } else if (cycle < explodedOn) {
          // explosion already started do nothing
          return { ...bacterium };
        } else {
          throw new Error('Exploded bacterium should have been filtered out.');
        }
      }

      // duplication
      if (duplicatesOn || duplicatedOn || startsMovingOn) {
        // highlight the bacterium that is about to be duplicated
        if (cycle < duplicatesOn) {
          let t =
            (increasingHighligthFadeInDurationCycles - (duplicatesOn - cycle)) /
            increasingHighligthFadeInDurationCycles;
          if (t > 1) {
            t = 1;
          }
          const alpha = round(t * t);
          const newDimension = round(
            (dimensionBeforeDuplicating - baseDimension) * alpha + baseDimension
          );

          const {
            // x: newX,
            // y: newY,
            correction,
          } = calculateNewPosition(
            cycle,
            { initialDirection, ...bacterium },
            { ...options }
          );
          return {
            ...bacterium,
            // x: newX,
            // y: newY,
            direction: direction + correction,
            dimension: newDimension,
          };
        } else if (cycle === duplicatesOn) {
          // create the copy in those exact frame. Copies will have the same position and direction as originals. Also they will have the same value for duplicatedOn etc
          bacterium.dimension = dimensionBeforeDuplicating; // this is needed because the dimension is not updated in the previous if
          bacterium.duplicatesOn = undefined;
          toPush.push({
            ...bacterium,
            id: bacteriaLatestID++,
            isCopy: !bacterium.isCopy,
          });
          return { ...bacterium };
        } else if (cycle < duplicatedOn) {
          // use duplicatedOn to calculate clockwise so that will be consistent during the whole duplication
          clockwise = round(cycle / duplicatedOn, 0) % 2 === 0;
          // The actual duplication
          const traslation =
            direction + (clockwise ? 90 : -90) + (bacterium.isCopy ? 180 : 0);
          const { deltaX, deltaY } = calculateNewPosition(
            // correction will be NaN because in options there is only movePerCycle
            cycle,
            { ...bacterium, initialDirection: traslation },
            { movePerCycle: translationMovePerCycleDuringDuplication * 1.41 } //because the move is diagonal
          );
          return {
            ...bacterium,
            ...ensurePositionIsOk({
              x: bacterium.x + deltaX,
              y: bacterium.y + deltaY,
            }),
          };
        } else if (cycle === duplicatedOn) {
          // simply reset the duplicatedOn value
          return { ...bacterium, duplicatedOn: undefined };
        } else if (cycle < startsMovingOn) {
          // back to normal dimensions
          let t =
            (increasingHighligthFadeOutDurationCycles -
              (startsMovingOn - cycle)) /
            increasingHighligthFadeOutDurationCycles;
          if (t > 1) {
            t = 1;
          }
          const alpha = 1 - round(t * t);
          const newDimension = round(
            (dimensionBeforeDuplicating - baseDimension) * alpha + baseDimension
          );
          const {
            // x: newX,
            // y: newY,
            correction,
          } = calculateNewPosition(
            cycle,
            { initialDirection, ...bacterium },
            { ...options }
          );
          return {
            ...bacterium,
            // x: newX,
            // y: newY,
            direction: direction + correction,
            dimension: newDimension,
          };
        } else if (cycle === startsMovingOn) {
          bacterium.dimension = baseDimension; // this is needed because the dimension is not updated in the previous if
          bacterium.startsMovingOn = undefined;
        }
      }

      // basic casual direction change
      if (cycle % casualDirectionChangePeriod === 0) {
        const change = generateChange(casualChangeMaxAngle, clockwise);
        initialDirection = initialDirection + change;
        direction = direction + change;
      }

      const { deltaX, deltaY, correction } = calculateNewPosition(
        cycle,
        { initialDirection, ...bacterium },
        options
      );
      return {
        ...bacterium,
        ...ensurePositionIsOk({
          x: bacterium.x + deltaX,
          y: bacterium.y + deltaY,
        }),
        direction: direction + correction,
        initialDirection,
      };
    });

  updatedBacteria.push(...toPush);
  return { cycle, bacteria: updatedBacteria };
};

export const increaseBacteria = (
  cycle,
  bacteria,
  {
    casualChangeMaxAngle,
    clockwiseChangePeriod,
    increase,
    increaseDirectionAngleChange,
    increasingHighligthFadeInDurationCycles,
    duplicationDurationCycles,
    increasingHighligthFadeOutDurationCycles,
    ...options
  }
) => {
  if (!bacteria.length) {
    console.warn("bacteria's length may not be zero.");
    return bacteria;
  }

  if (bacteria.length >= options.maxNumberOfBacteria) {
    console.warn("bacteria's length already reached upper limit");
    return bacteria;
  }

  const shuffledBacteria = shuffleArray(bacteria);

  const updatedBacteria = shuffledBacteria.map((bacterium, index) => {
    if (index >= increase) return bacterium;
    return {
      ...bacterium,
      duplicatesOn: cycle + increasingHighligthFadeInDurationCycles,
      duplicatedOn:
        cycle +
        increasingHighligthFadeInDurationCycles +
        duplicationDurationCycles,
      startsMovingOn:
        cycle +
        increasingHighligthFadeInDurationCycles +
        duplicationDurationCycles +
        increasingHighligthFadeOutDurationCycles,
    };
  });
  return updatedBacteria;
};

export const decreaseBacteria = (
  cycle,
  bacteria,
  { decrease, explosionDelayCycles, explosionOverallDurationCycles, ...options }
) => {
  if (!bacteria.length) {
    console.warn("bacteria's length may not be zero.");
    return bacteria;
  }

  const filteredBacteria = bacteria.filter(
    ({ explodesOn, explodedOn }) => !(explodedOn || explodesOn)
  );

  return shuffleArray(filteredBacteria).map((b, id) =>
    id < decrease
      ? {
          ...b,
          explodesOn: cycle + explosionDelayCycles,
          explodedOn: cycle + explosionOverallDurationCycles,
        }
      : b
  );
};
