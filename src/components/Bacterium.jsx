import BacteriumSVG1 from '../assets/img/bacterium.svg';
import BacteriumSVG2 from '../assets/img/bacterium2.svg';

import ConfettiExplosion from 'react-confetti-explosion';

const DIR_OFFSET = -45 + 180;

const Bacterium = ({ cycle, bacterium, options = {}, ...props }) => {
  const { explodesOn, explodedOn, duplicatedOn } = bacterium;

  if (!(cycle > explodesOn))
    return (
      <img
        src={bacterium?.source === 1 ? BacteriumSVG1 : BacteriumSVG2}
        alt=''
        style={{
          position: 'absolute',
          left: `${bacterium?.x}%`,
          top: `${bacterium?.y}%`,
          rotate: `${bacterium?.direction + DIR_OFFSET}deg`,
          width: `${bacterium?.dimension}%`,
          height: `${bacterium?.dimension}%`,
          maxWidth: `${bacterium?.dimension}%`,
          maxHeight: `${bacterium?.dimension}%`,
          overflow: 'hidden',
          zIndex: explodedOn || duplicatedOn ? 100 : undefined,
        }}
        className=' w-100 h-100'
      />
    );
  else if (!(cycle > explodedOn))
    return (
      <ConfettiExplosion
        {...(options.explosionOptions || {})}
        colors={
          bacterium?.source === 1
            ? options.explosionColors1
            : options.explosionColors2
        }
        style={{
          position: 'absolute',
          left: `${bacterium?.x}%`,
          top: `${bacterium?.y}%`,
          zIndex: 100,
        }}
      />
    );
  else return null;
};

export default Bacterium;
