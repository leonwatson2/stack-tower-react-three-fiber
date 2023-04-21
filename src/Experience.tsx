import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { START_DIMENSIONS } from './constants';
import { Tower } from './components/Tower';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';

export const Experience: FC = () => {
  const { movingBox, lastBox, boxes } = useTowerGame();

  return (
    <>
      <Debugger orbitControls />
      <Lights />
      <MovingBox currentStackNumber={3} ref={movingBox} deminsions={{ ...START_DIMENSIONS }} />
      <Tower towerBoxes={boxes} ref={lastBox} />
    </>
  );
};
