import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { Tower } from './components/Tower';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';
import { CameraController } from './CameraController';
import { TowerLabels } from './TowerLabels';
import StartMenu from './components/StartMenu';

export const Experience: FC = () => {
    const {
        movingBox,
        lastBox,
        boxes,
        movingBoxDimesions,
        movingBoxStartingPosition,
        towerGroupRef,
        atStartMenu,
        startGame,
    } = useTowerGame();

    return (
        <>
            <CameraController
                atStartMenu={atStartMenu}
                height={boxes.length}
                towerGroupRef={towerGroupRef}
            />
            <Debugger />
            <Lights />
            <TowerLabels atStartMenu={atStartMenu} boxes={boxes} />
            <StartMenu
                onStart={startGame}
                atStartMenu={atStartMenu}
            />
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
