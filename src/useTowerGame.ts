import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

import { BOX_HEIGHT } from './constants/towerConstants';
import { Controls, Direction, MissedBox } from './Types';
import { initialBoxes, useTowerReducer } from './reducers/tower/towerReducer';
import {
    directionBoxesOverlap,
    getNewStackBoxValues,
    roundBoxMinMaxToTwoDecimals,
    wasPerfectHit,
} from './utils';
import { TowerActionType } from './reducers/tower';
import { TowerConstants } from './constants';

export const useTowerGame = () => {
    const lastBox = useRef<THREE.Mesh>();
    const movingBox = useRef<THREE.Mesh>();
    const towerGroupRef = useRef<THREE.Group>();
    const [
        {
            atStartMenu,
            direction,
            movingBoxStartingPosition,
            boxes,
            movingBoxDimesions,
            missedBoxes,
            isEndGame,
            phase,
        },
        dispatch,
    ] = useTowerReducer();

    const startGame = useCallback(() => {
        dispatch({ type: 'START_GAME', payload: initialBoxes });
    }, [dispatch]);
    const [sub] = useKeyboardControls<Controls>();

    const stackNewBox = useCallback(() => {

        const box1 = new THREE.Box3().setFromObject(lastBox.current);
        const box2 = new THREE.Box3().setFromObject(movingBox.current);
        const [lastBoxEdges, movingBoxEdges] = roundBoxMinMaxToTwoDecimals(box1, box2);

        let missedWidth = lastBoxEdges.max.x - lastBoxEdges.min.x;
        let missedLength = lastBoxEdges.max.z - lastBoxEdges.min.z;
        let missedStartX = lastBoxEdges.min.x + missedWidth / 2;
        let missedStartZ = lastBoxEdges.min.z + missedLength / 2;
        const directionOverlapped = directionBoxesOverlap(lastBoxEdges, movingBoxEdges);

        if (directionOverlapped === Direction.POSITIVE_X) {
            missedWidth = movingBoxEdges.max.x - lastBoxEdges.max.x;
            missedStartX = lastBoxEdges.max.x + missedWidth / 2;
            missedLength = movingBoxEdges.max.z - movingBoxEdges.min.z;
            missedStartZ = lastBoxEdges.min.z + missedLength / 2;
        } else if (directionOverlapped === Direction.NEGATIVE_X) {
            missedWidth = lastBoxEdges.min.x - movingBoxEdges.min.x;
            missedStartX = movingBoxEdges.min.x + missedWidth / 2;
            missedLength = movingBoxEdges.max.z - movingBoxEdges.min.z;
            missedStartZ = lastBoxEdges.min.z + missedLength / 2;
        } else if (directionOverlapped === Direction.POSITIVE_Z) {
            missedWidth = movingBoxEdges.max.x - movingBoxEdges.min.x;
            missedStartX = lastBoxEdges.min.x + missedWidth / 2;
            missedLength = movingBoxEdges.max.z - lastBoxEdges.max.z;
            missedStartZ = lastBoxEdges.max.z + missedLength / 2;
        } else if (directionOverlapped === Direction.NEGATIVE_Z) {
            missedWidth = movingBoxEdges.max.x - movingBoxEdges.min.x;
            missedStartX = lastBoxEdges.min.x + missedWidth / 2;
            missedLength = lastBoxEdges.min.z - movingBoxEdges.min.z;
            missedStartZ = movingBoxEdges.min.z + missedLength / 2;
        } else if (wasPerfectHit(directionOverlapped)) {
            dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_PERFECT_HIT' });
            }, 15000);
        } else {
            dispatch({ type: 'END_GAME' });
            return;
        }
        if (directionOverlapped !== Direction.ALL) {
            const newBox = getNewStackBoxValues(
                directionOverlapped,
                lastBoxEdges,
                movingBoxEdges,
                boxes.length
            );

            const missedBox: MissedBox = {
                position: [missedStartX, boxes.length * BOX_HEIGHT, missedStartZ],
                args: [missedWidth, BOX_HEIGHT, missedLength],
                color: `hsl(${boxes.length * 36}, 100%, 50%)`,
                directionOverlapped,
            };

            dispatch({ type: 'STACK_NEW_BOX', payload: { newBox, missedBox } });
        }
    }, [boxes, dispatch, lastBox,
        movingBox]);

    useEffect(() => {
        dispatch({ type: 'MAIN_MENU' });
    }, []);

    useEffect(() => {
        const unsub = sub(
            (state) => state.hit,
            (hit) => {
                if (hit) {
                    if (isEndGame || atStartMenu) {
                        startGame()
                    } else {
                        stackNewBox();
                    }
                }
            },
        );
        return unsub;
    }, [startGame, stackNewBox, atStartMenu, isEndGame]);
    useEffect(() => {
        const unsub = sub(
            (state) => state.menu,
            (menu) => {
                if (menu) dispatch({ type: 'MAIN_MENU' });
            },
        );
        return unsub;
    }, []);

    const newSpeed = useMemo(() => {
        return TowerConstants.STARTING_SPEED + Math.floor(boxes.length / 10) * 5;
    }, [boxes])
    useFrame((_, delta) => {
        if (direction !== Direction.NONE && !atStartMenu) {
            moveInDirection[direction](movingBox.current, lastBox.current, dispatch, +(newSpeed * delta).toFixed(1));
        }
    });

    return {
        atStartMenu,
        movingBox,
        lastBox,
        boxes,
        missedBoxes,
        movingBoxDimesions,
        movingBoxStartingPosition,
        towerGroupRef,
        isEndGame,
        startGame,
        stackNewBox,
        phase
    };
};


export const moveInDirection: Record<
    Direction,
    (movingBox: THREE.Mesh, lastBox: THREE.Mesh, setDirection: React.Dispatch<TowerActionType>, speedAddition: number) => void
> = {
    [Direction.POSITIVE_X]: (movingBox, lastBox, setDirection, newSpeed) => {
        const { max: movingBoxMax } = new THREE.Box3().setFromObject(movingBox);
        const { max: lastBoxMax } = new THREE.Box3().setFromObject(lastBox);
        if (lastBoxMax.x + TowerConstants.BOX_TRAVEL_DISTANCE < movingBoxMax.x) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.x += newSpeed;
        }
    },
    [Direction.NEGATIVE_X]: (movingBox, lastBox, setDirection, newSpeed) => {
        const { min: movingBoxMin } = new THREE.Box3().setFromObject(movingBox);
        const { min: lastBoxMin } = new THREE.Box3().setFromObject(lastBox);
        if (lastBoxMin.x - TowerConstants.BOX_TRAVEL_DISTANCE > movingBoxMin.x) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.x -= newSpeed;
        }
    },
    [Direction.POSITIVE_Z]: (movingBox, lastBox, setDirection, newSpeed) => {
        const { max: movingBoxMax } = new THREE.Box3().setFromObject(movingBox);
        const { max: lastBoxMax } = new THREE.Box3().setFromObject(lastBox);
        if (lastBoxMax.z + TowerConstants.BOX_TRAVEL_DISTANCE < movingBoxMax.z) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.z += newSpeed;
        }
    },
    [Direction.NEGATIVE_Z]: (movingBox, lastBox, setDirection, newSpeed) => {
        const { min: movingBoxMin } = new THREE.Box3().setFromObject(movingBox);
        const { min: lastBoxMin } = new THREE.Box3().setFromObject(lastBox);
        if (lastBoxMin.z - TowerConstants.BOX_TRAVEL_DISTANCE > movingBoxMin.z) {
            setDirection({ type: 'GO_OPPOSITE_DIRECTION' });
        } else {
            movingBox.position.z -= newSpeed;
        }
    },
    [Direction.NONE]: () => {

    },
    [Direction.ALL]: () => { },
};
