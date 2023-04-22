import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { Tower } from './components/Tower';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';
import { CameraController } from './CameraController';
import { TowerLabels } from './TowerLabels';

export const Experience: FC = () => {
    const {
        movingBox,
        lastBox,
        boxes,
        movingBoxDimesions,
        movingBoxStartingPosition,
        towerGroupRef,
    } = useTowerGame();

    return (
        <>
            <CameraController height={boxes.length} towerGroupRef={towerGroupRef} />
            <Debugger />
            <Lights />
            <TowerLabels boxes={boxes} />
            <MovingBox
                position={movingBoxStartingPosition}
                ref={movingBox}
                deminsions={movingBoxDimesions}
                color={`hsl(${(boxes.length + 1) * 36}, 100%, 50%)`}
            />
            <Tower towerBoxes={boxes} ref={lastBox} groupRef={towerGroupRef} />
        </>
    );
};
