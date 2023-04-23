import { useCallback, useEffect, useRef } from 'react';
import { Mesh, Box3, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

import { TOWER_BOUNDS, STARTING_SPEED, BOX_HEIGHT } from './constants/towerConstants';
import { Controls, DIRECTION, MissedBox, StackingBox } from './Types';
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
        {
            atStartMenu,
            direction,
            movingBoxStartingPosition,
            boxes,
            movingBoxDimesions,
            missedBoxes,
        },
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
        function getNewBoxesStackBox(
            overlappedDirection: DIRECTION,
            previousBoxEdges: Box3,
            stackBoxEdges: Box3,
        ) {
            const prevPrev = [previousBoxEdges, previousBoxEdges];
            const prevStack = [previousBoxEdges, stackBoxEdges];
            const stackPrev = [stackBoxEdges, previousBoxEdges];

            const directionVariableMap: {
                [key in DIRECTION]: {
                    lengthValues: Box3[];
                    widthValues: Box3[];
                    missedWidthValues: Box3[];
                    startValues: Box3[];
                };
            } = {
                [DIRECTION.POSITIVE_X]: {
                    lengthValues: prevPrev,
                    widthValues: prevStack,
                    startValues: stackPrev,
                    missedWidthValues: stackPrev,
                },
                [DIRECTION.NEGATIVE_X]: {
                    lengthValues: prevPrev,
                    widthValues: stackPrev,
                    startValues: prevPrev,
                    missedWidthValues: prevStack,
                },
                [DIRECTION.POSITIVE_Z]: {
                    lengthValues: prevStack,
                    widthValues: prevPrev,
                    missedWidthValues: prevPrev,
                    startValues: prevStack,
                },
                [DIRECTION.NEGATIVE_Z]: {
                    lengthValues: stackPrev,
                    widthValues: prevStack,
                    missedWidthValues: prevPrev,
                    startValues: stackPrev,
                },
                [DIRECTION.NONE]: {
                    lengthValues: prevPrev,
                    widthValues: prevPrev,
                    startValues: prevPrev,
                    missedWidthValues: prevPrev,
                },
            };

            const length =
                directionVariableMap[overlappedDirection].lengthValues[0].max.z -
                directionVariableMap[overlappedDirection].lengthValues[1].min.z;

            const width =
                directionVariableMap[overlappedDirection].widthValues[0].max.x -
                directionVariableMap[overlappedDirection].widthValues[1].min.x;

            const startX =
                directionVariableMap[overlappedDirection].startValues[0].min.x + width / 2;

            const startZ =
                directionVariableMap[overlappedDirection].startValues[1].min.z + length / 2;

            const missedWidth = stackBoxEdges.max.x - previousBoxEdges.max.x;
            const missedlength = stackBoxEdges.max.z - stackBoxEdges.min.z;
            const missedStartZ = previousBoxEdges.min.z + missedlength / 2;
            const missedStartX = previousBoxEdges.max.x + missedWidth / 2;

            return {
                width,
                length,
                startX,
                startZ,
                missedWidth,
            };
        }
        const newWidth = lastBoxEdges.max.x - lastBoxEdges.min.x;

        let missedStartX = lastBoxEdges.min.x + newWidth / 2;
        let missedStartZ = 0;
        let missedWidth = 0;
        let missedlength = 0;
        let directionOverlapped = DIRECTION.NONE;
        if (boxIsOverLappingPos('x', lastBoxEdges, movingBoxEdges)) {
            directionOverlapped = DIRECTION.POSITIVE_X;
            missedlength = movingBoxEdges.max.z - movingBoxEdges.min.z;
            missedStartZ = lastBoxEdges.min.z + missedlength / 2;
            missedWidth = movingBoxEdges.max.x - lastBoxEdges.max.x;
            missedStartX = lastBoxEdges.max.x + missedWidth / 2;
        } else if (boxIsOverLappingNeg('x', lastBoxEdges, movingBoxEdges)) {
            directionOverlapped = DIRECTION.NEGATIVE_X;

            missedlength = movingBoxEdges.max.z - movingBoxEdges.min.z;
            missedStartZ = lastBoxEdges.min.z + missedlength / 2;
            missedWidth = lastBoxEdges.min.x - movingBoxEdges.min.x;
            missedStartX = movingBoxEdges.min.x + missedWidth / 2;
        } else if (boxIsOverLappingPos('z', lastBoxEdges, movingBoxEdges)) {
            directionOverlapped = DIRECTION.POSITIVE_Z;
            missedWidth = movingBoxEdges.max.x - movingBoxEdges.min.x;
            missedStartX = lastBoxEdges.min.x + missedWidth / 2;
            missedlength = movingBoxEdges.max.z - lastBoxEdges.max.z;
            missedStartZ = lastBoxEdges.max.z + missedlength / 2;
        } else if (boxIsOverLappingNeg('z', lastBoxEdges, movingBoxEdges)) {
            directionOverlapped = DIRECTION.NEGATIVE_Z;

            missedWidth = movingBoxEdges.max.x - movingBoxEdges.min.x;
            missedStartX = lastBoxEdges.min.x + missedWidth / 2;
            missedlength = lastBoxEdges.min.z - movingBoxEdges.min.z;
            missedStartZ = movingBoxEdges.min.z + missedlength / 2;
        } else if (boxIsOverLappingPerfectly(lastBoxEdges, movingBoxEdges)) {
            dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            }, 15000);
        } else {
            dispatch({ type: 'END_GAME' });
            return;
        }
        const { width, length, startX, startZ } = getNewBoxesStackBox(
            directionOverlapped,
            lastBoxEdges,
            movingBoxEdges,
        );

        const newBox: StackingBox = {
            position: [startX, boxes.length * BOX_HEIGHT, startZ],
            args: [width, BOX_HEIGHT, length],
            color: `hsl(${boxes.length * 36}, 100%, 50%)`,
        };

        const missedBox: MissedBox =
            directionOverlapped === DIRECTION.NONE
                ? null
                : {
                    position: [missedStartX, boxes.length * BOX_HEIGHT, missedStartZ],
                    args: [missedWidth, BOX_HEIGHT, missedlength],
                    color: `hsl(${boxes.length * 36}, 100%, 50%)`,
                    directionOverlapped,
                };

        dispatch({ type: 'STACK_NEW_BOX', payload: { newBox, missedBox } });
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
        missedBoxes,
        movingBoxDimesions,
        direction,
        movingBoxStartingPosition,
        towerGroupRef,
        startGame,
    };
};

export const chooseRandomDirection: (chosenDirection?: DIRECTION) => DIRECTION = (
    chosenDirection,
) => {
    const map = {
        0: DIRECTION.POSITIVE_X,
        1: DIRECTION.NEGATIVE_X,
        2: DIRECTION.POSITIVE_Z,
        3: DIRECTION.NEGATIVE_Z,
    };
    if (chosenDirection !== undefined) return map[chosenDirection];
    const randomDirection = Math.floor(Math.random() * 4);
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
    [DIRECTION.NONE]: () => {},
};
