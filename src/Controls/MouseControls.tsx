import { FC, useMemo } from 'react';
import { Phase } from '../Types';
import { TowerConstants } from '../constants';


type PropTypes = { startGame: () => void, stackNewBox: () => void, phase: Phase };

export const MouseControls: FC<PropTypes> = ({
    startGame,
    stackNewBox,
    phase,
}) => {
    const mouseEventArgs: Record<string, () => void> = useMemo(() => {
        return phase === Phase.PLAYING ?
            { 'onPointerDown': stackNewBox } :
            { 'onDoubleClick': startGame }
    }, [startGame, stackNewBox, phase])

    return <mesh
        {...mouseEventArgs}
        position-z={phase === Phase.END_GAME ? 0 : -TowerConstants.START_DIMENSIONS.length}

        rotation-x={phase === Phase.END_GAME ? 0 : Math.PI * .5}
        scale-x={phase === Phase.END_GAME ? 1 : 20}
        position-y={-TowerConstants.BOX_HEIGHT}>
        <boxGeometry args={[3000, .2, 3000]} />
        <meshStandardMaterial color={'#000000'} transparent opacity={0} />
    </mesh>;
}