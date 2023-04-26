import { FC, useEffect, MutableRefObject } from 'react';
import { useControls } from 'leva';

import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { MovingBox } from './MovingBox';
import { useTowerGame } from './useTowerGame';
import { CameraController } from './CameraController';
import { TowerLabels } from './TowerLabels';
import { Tower } from './components/Tower';
import { StartMenu } from './components/StartMenu';
import { MouseControls } from './Controls/MouseControls';
import { SoundTypes } from './SoundsHub';


export const Experience: FC<{ debugMode: boolean, sounds: MutableRefObject<(sound: SoundTypes) => void> }> = ({ debugMode, sounds }) => {
    const {
        movingBox,
        lastBox,
        boxes,
        missedBoxes,
        movingBoxDimesions,
        movingBoxStartingPosition,
        towerGroupRef,
        atStartMenu,
        isEndGame,
        phase,
        startGame,
        stackNewBox,
    } = useTowerGame();
    const { enabled } = useControls('Mouse Controls', {
        enabled: {
            value: true
        }
    }, { collapsed: false });

    useEffect(() => {
        if (boxes.length > 1) {
            sounds.current(SoundTypes.BLOCK_STACK);
        }
    }, [boxes])
    return (
        <>
            <CameraController
                height={boxes.length}
                towerGroupRef={towerGroupRef}
                phase={phase}
            />
            <Debugger />
            <Lights />
            <TowerLabels phase={phase} boxes={boxes} />
            <StartMenu onStart={startGame} atStartMenu={atStartMenu} />
            <MovingBox
                position={movingBoxStartingPosition}
                ref={movingBox}
                deminsions={movingBoxDimesions}
                color={`hsl(${(boxes.length + 1) * 36}, 100%, 50%)`}
            />
            {enabled && <MouseControls startGame={startGame} phase={phase} stackNewBox={stackNewBox} />}
            <Tower
                towerBoxes={boxes}
                ref={lastBox}
                groupRef={towerGroupRef}
                missedBoxes={missedBoxes}
                positiveGravity
            />
        </>
    );
};
