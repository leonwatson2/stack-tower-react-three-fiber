import { useMemo, useEffect } from 'react';


type PropTypes = { isEndGame: boolean, atStartMenu: boolean, startGame: () => void, stackNewBox: () => void };

export const MouseControls: (props: PropTypes) => null = ({
    isEndGame,
    atStartMenu,
    startGame,
    stackNewBox,
}) => {
    const mouseEventCallback = useMemo(() => {
        return isEndGame || atStartMenu ?
            startGame :
            stackNewBox
    }, [startGame, stackNewBox, isEndGame, atStartMenu])

    useEffect(() => {
        const mouseEvent: keyof DocumentEventMap = isEndGame || atStartMenu ? 'dblclick' : 'mousedown';

        setTimeout(() => {
            document.addEventListener(mouseEvent, mouseEventCallback)

        }, 300)

        return () => {
            document.removeEventListener(mouseEvent, mouseEventCallback)
        }
    }, [isEndGame, atStartMenu, mouseEventCallback])
    return null;
}