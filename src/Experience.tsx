import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { Tower } from './components/Tower';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';

export const Experience: FC = () => {
  const { movingBox, lastBox, boxes, movingBoxDimesions } = useTowerGame();

  return (
    <>
      <Debugger orbitControls />
      <Lights />
      <MovingBox currentStackNumber={3} ref={movingBox} deminsions={movingBoxDimesions} />
      <Tower towerBoxes={boxes} ref={lastBox} />
    </>
  );
};
