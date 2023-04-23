import { useCallback, useEffect, useRef } from 'react';
import { Mesh, Box3, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

import { TOWER_BOUNDS, STARTING_SPEED, BOX_HEIGHT } from './constants/towerConstants';
import { Controls, DIRECTION, StackingBox } from './Types';
import { useTowerReducer, initialBoxes } from './reducers/tower/towerReducer';
import {
    boxIsOverLappingNeg,
    boxIsOverLappingPerfectly,
    boxIsOverLappingPos,
    roundBoxMinMaxToTwoDecimals,
} from './utils';
import { TowerActionType } from './reducers/tower';

export const useTowerGame = () => {
    const lastBox = useRef<Mesh>();
    const movingBox = useRef<Mesh>();
    const towerGroupRef = useRef<Group>();

    const [
        { atStartMenu, direction, movingBoxStartingPosition, boxes, movingBoxDimesions },
        dispatch,
    ] = useTowerReducer();

    const startGame = () => {
        dispatch({ type: 'START_GAME', payload: { initialBoxes } });
    };
    const [sub] = useKeyboardControls<Controls>();

    const stackNewBox = useCallback(() => {
        const box1 = new Box3().setFromObject(lastBox.current);
        const box2 = new Box3().setFromObject(movingBox.current);
        const [lastBoxEdges, movingBoxEdges] = roundBoxMinMaxToTwoDecimals(box1, box2);

        let newWidth = lastBoxEdges.max.x - lastBoxEdges.min.x;
        let newLength = lastBoxEdges.max.z - lastBoxEdges.min.z;
        let newStartX = lastBoxEdges.min.x + newWidth / 2;
        let newStartZ = lastBoxEdges.min.z + newLength / 2;

        if (boxIsOverLappingPos('x', lastBoxEdges, movingBoxEdges)) {
            newWidth = lastBoxEdges.max.x - movingBoxEdges.min.x;
            newStartX = movingBoxEdges.min.x + newWidth / 2;
        } else if (boxIsOverLappingNeg('x', lastBoxEdges, movingBoxEdges)) {
            newWidth = movingBoxEdges.max.x - lastBoxEdges.min.x;
            newStartX = lastBoxEdges.min.x + newWidth / 2;
        } else if (boxIsOverLappingPos('z', lastBoxEdges, movingBoxEdges)) {
            newLength = lastBoxEdges.max.z - movingBoxEdges.min.z;
            newStartZ = movingBoxEdges.min.z + newLength / 2;
        } else if (boxIsOverLappingNeg('z', lastBoxEdges, movingBoxEdges)) {
            newLength = movingBoxEdges.max.z - lastBoxEdges.min.z;
            newStartZ = lastBoxEdges.min.z + newLength / 2;
        } else if (boxIsOverLappingPerfectly(lastBoxEdges, movingBoxEdges)) {
            dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            }, 15000);
        } else {
            dispatch({ type: 'END_GAME' });
            return;
        }
        const newBox: StackingBox = {
            position: [newStartX, boxes.length * BOX_HEIGHT, newStartZ],
            args: [newWidth, BOX_HEIGHT, newLength],
            color: `hsl(${boxes.length * 36}, 100%, 50%)`,
        };

        dispatch({ type: 'STACK_NEW_BOX', payload: { newBox } });
    }, [boxes]);

    useEffect(() => {
        dispatch({ type: 'MAIN_MENU' });
    }, []);

    useEffect(() => {
        const unsub = sub(
            (state) => state.hit,
            (hit) => {
                if (hit) {
                    if (direction === DIRECTION.NONE || atStartMenu) {
                        dispatch({ type: 'START_GAME', payload: { initialBoxes: initialBoxes } });
                    } else {
                        stackNewBox();
                    }
                }
            },
        );
        return unsub;
    }, [direction, stackNewBox, atStartMenu]);
    useEffect(() => {
        const unsub = sub(
            (state) => state.menu,
            (menu) => {
                if (menu) dispatch({ type: 'MAIN_MENU' });
            },
        );
        return unsub;
    }, []);
    useFrame(() => {
        if (direction !== DIRECTION.NONE && !atStartMenu)
            moveInDirection[direction](movingBox.current, dispatch);
    });

    return {
        atStartMenu,
        movingBox,
        lastBox,
        boxes,
        movingBoxDimesions,
        direction,
        movingBoxStartingPosition,
        towerGroupRef,
        startGame,
    };
};

export const chooseRandomDirection: () => DIRECTION = () => {
    const randomDirection = Math.floor(Math.random() * 4);
    const map = {
        0: DIRECTION.POSITIVE_X,
        1: DIRECTION.NEGATIVE_X,
        2: DIRECTION.POSITIVE_Z,
        3: DIRECTION.NEGATIVE_Z,
    };

    return map[randomDirection];
};

export const moveInDirection: Record<
    DIRECTION,
    (movingBox: Mesh, setDirection: React.Dispatch<TowerActionType>) => void
> = {
    [DIRECTION.POSITIVE_X]: (movingBox, setDirection) => {
        const { max } = new Box3().setFromObject(movingBox);
        if (TOWER_BOUNDS.positiveX < max.x) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.x += STARTING_SPEED;
        }
    },
    [DIRECTION.NEGATIVE_X]: (movingBox, setDirection) => {
        const { min } = new Box3().setFromObject(movingBox);
        if (TOWER_BOUNDS.negativeX > min.x) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.x -= STARTING_SPEED;
        }
    },
    [DIRECTION.POSITIVE_Z]: (movingBox, setDirection) => {
        const { max } = new Box3().setFromObject(movingBox);
        if (TOWER_BOUNDS.positiveZ < max.z) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.z += STARTING_SPEED;
        }
    },
    [DIRECTION.NEGATIVE_Z]: (movingBox, setDirection) => {
        const { min } = new Box3().setFromObject(movingBox);
        if (TOWER_BOUNDS.negativeZ > min.z) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.z -= STARTING_SPEED;
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    [DIRECTION.NONE]: () => { },
};
