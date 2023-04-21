import { useCallback, useEffect, useRef, useState } from 'react';
import { Mesh, Box3 } from 'three';
import { useFrame } from '@react-three/fiber';

import {
    TOWER_BOUNDS,
    STARTING_SPEED,
    START_DIMENSIONS,
    BOX_HEIGHT,
    START_LOCATION,
} from './constants';
import { Controls, DIRECTION, StackingBox } from './Types';
import { useKeyboardControls } from '@react-three/drei';
import { TowerActionType, useTowerReducer } from './towerReducer';
import { boxIsOverLappingNeg, boxIsOverLappingPos } from './utils';

const initalBoxes: Array<StackingBox> = [
    {
        position: [START_LOCATION.x, 0, START_LOCATION.z],
        args: [START_DIMENSIONS.width, BOX_HEIGHT, START_DIMENSIONS.length],
        color: 'darkcyan',
    },
];

export const useTowerGame = () => {
    const lastBox = useRef<Mesh>();
    const movingBox = useRef<Mesh>();
    const [{ direction, movingBoxStartingPosition, boxes, movingBoxDimesions }, dispatch] =
    useTowerReducer();

    const [wasPressed, setWasPressed] = useState(false);
    const spacePressed = useKeyboardControls<Controls>((state) => state.hit);

    const stackNewBox = useCallback(() => {
        const lastBoxEdges = new Box3().setFromObject(lastBox.current);
        const movingBoxEdges = new Box3().setFromObject(movingBox.current);
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
        } else {
            console.log('missed');
        }

        const newBox: StackingBox = {
            position: [newStartX, boxes.length * BOX_HEIGHT, newStartZ],
            args: [newWidth, BOX_HEIGHT, newLength],
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        };

        dispatch({ type: 'STACK_NEW_BOX', payload: { newBox } });
    }, [boxes]);

    useEffect(() => {
        dispatch({ type: 'START_GAME', payload: { initialBoxes: initalBoxes } });
    }, []);

    useFrame(() => {
        if (spacePressed) {
            if (!wasPressed) {
                stackNewBox();
                setWasPressed(true);
            }
        } else {
            if (wasPressed) setWasPressed(false);
        }
        if (direction !== null) moveInDirection[direction](movingBox.current, dispatch);
    });

    return { movingBox, lastBox, boxes, movingBoxDimesions, direction, movingBoxStartingPosition };
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
};
