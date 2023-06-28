import { useEffect, useState } from 'react';

import Bacterium from './components/Bacterium';

import {
  calculateBacteriaPositionForCycle,
  generateBacteria,
  increaseBacteria,
  decreaseBacteria,
  round,
} from './bacteriumFns';

import './App.css';

import { bacteriaOptions } from './bacteriaOptions';

const initialSetOfBacteria = generateBacteria(bacteriaOptions);

const increaseDecreaseBacteriaTimeoutMs = 7000;

const increaseDecreaseBacteriaTimeoutCycles = round(
  increaseDecreaseBacteriaTimeoutMs / bacteriaOptions.refreshTimeout,
  0
);

// App Fn
function App() {
  // Bacteria
  const [bacteria, setBacteria] = useState(initialSetOfBacteria);

  useEffect(() => {
    const timeoutReference = setTimeout(() => {
      if (bacteria.cycle % increaseDecreaseBacteriaTimeoutCycles === 0) {
        if (
          bacteria.cycle % (2 * increaseDecreaseBacteriaTimeoutCycles) ===
          0
        ) {
          // increase bacteria
          setBacteria({
            bacteria: increaseBacteria(
              bacteria.cycle,
              bacteria.bacteria,
              bacteriaOptions
            ),
            cycle: bacteria.cycle + 1,
          });
        } else {
          // decrease bacteria
          setBacteria({
            bacteria: decreaseBacteria(
              bacteria.cycle,
              bacteria.bacteria,
              bacteriaOptions
            ),
            cycle: bacteria.cycle + 1,
          });
        }
      } else {
        setBacteria(
          calculateBacteriaPositionForCycle(
            bacteria.cycle + 1,
            bacteria.bacteria,
            bacteriaOptions
          )
        );
      }
    }, bacteriaOptions.refreshTimeout);
    return () => {
      clearTimeout(timeoutReference);
    };
  }, [bacteria]);

  return (
    <section
      className='bg-dark text-light w-100 h-100'
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      {bacteria.bacteria?.map(({ ...bacterium }) => (
        <Bacterium
          key={`bacterium_${bacterium.id}`}
          cycle={bacteria.cycle}
          bacterium={bacterium}
          options={bacteriaOptions}
        />
      ))}
    </section>
  );
}

export default App;
