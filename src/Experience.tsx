import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { Tower } from './components/Tower';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';
import { CameraController } from './CameraController';
import { BOX_HEIGHT, START_LOCATION } from './constants';
import { Text3D } from '@react-three/drei';

export const Experience: FC = () => {
    const { movingBox, lastBox, boxes, movingBoxDimesions, movingBoxStartingPosition } =
    useTowerGame();

    return (
        <>
            <CameraController height={boxes.length} />
            <Debugger orbitControls />
            <Lights />
            <Text3D
                position={[START_LOCATION.x - 4, boxes.length * BOX_HEIGHT, START_LOCATION.x - 2]}
                font={'./helvetiker_regular.typeface.json'}
            >
                {boxes.length}
                <meshBasicMaterial attach="material" color="white" />
            </Text3D>
            <MovingBox
                position={movingBoxStartingPosition}
                ref={movingBox}
                deminsions={movingBoxDimesions}
            />
            <Tower towerBoxes={boxes} ref={lastBox} />
        </>
    );
};
