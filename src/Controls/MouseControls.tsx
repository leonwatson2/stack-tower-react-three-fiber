import { useMemo, useEffect } from 'react';
import { Phase } from '../Types';


type PropTypes = { startGame: () => void, stackNewBox: () => void, phase: Phase };

export const MouseControls: (props: PropTypes) => null = ({
    startGame,
    stackNewBox,
    phase,
}) => {
    const mouseEventArgs: [keyof DocumentEventMap, () => void] = useMemo(() => {
        return phase === Phase.PLAYING ?
            ['mousedown', stackNewBox] :
            ['dblclick', startGame]
    }, [startGame, stackNewBox, phase])

    useEffect(() => {

        setTimeout(() => {
            document.addEventListener(...mouseEventArgs)
        }, 300)
        return () => {
            document.removeEventListener(...mouseEventArgs)
        }
    }, [mouseEventArgs])
    return null;
}