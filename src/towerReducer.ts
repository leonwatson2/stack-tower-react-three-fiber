import { Reducer, useReducer } from 'react';
import { DIRECTION, StackingBox } from './Types';
import { BOX_HEIGHT, START_DIMENSIONS, START_LOCATION } from './constants';
import { chooseRandomDirection } from './useTowerGame';

export const initialBoxes: Array<StackingBox> = [
    {
        position: [START_LOCATION.x, 0, START_LOCATION.z],
        args: [START_DIMENSIONS.width, BOX_HEIGHT, START_DIMENSIONS.length],
        color: 'darkcyan',
    },
];

type TowerStateType = {
  direction: DIRECTION;
  movingBoxDimesions: { width: number; length: number };
  boxes: Array<StackingBox>;
  movingBoxStartingPosition: [x: number, y: number, z: number];
};

export type TowerActionType =
  | {
      type: 'STACK_NEW_BOX';
      payload: {
        newBox: StackingBox;
      };
    }
  | {
      type: 'GO_OPPOSITE_DIRECTION';
    }
  | {
      type: 'START_GAME';
      payload: { initialBoxes: Array<StackingBox> };
    }
  | {
      type: 'RESET_GAME';
    }
  | {
      type: 'PAUSE_GAME';
    }
  | { type: 'END_GAME' };

export const towerReducer: Reducer<TowerStateType, TowerActionType> = (state, action) => {
    let newDirection: DIRECTION;

    switch (action.type) {
    case 'START_GAME':
        return {
            ...state,
            direction: chooseRandomDirection(),
            movingBoxDimesions: START_DIMENSIONS,
            boxes: action.payload.initialBoxes,
            movingBoxStartingPosition: [START_LOCATION.x, 1 * BOX_HEIGHT, START_LOCATION.z],
        };

    case 'STACK_NEW_BOX':
        newDirection = chooseRandomDirection();
        return {
            ...state,
            direction: newDirection,
            boxes: [...state.boxes, action.payload.newBox],
            movingBoxStartingPosition: [
                action.payload.newBox.position[0] +
            (newDirection === DIRECTION.POSITIVE_X && -1.5 * START_DIMENSIONS.width) +
            (newDirection === DIRECTION.NEGATIVE_X && 1.5 * START_DIMENSIONS.width),
                (state.boxes.length + 1) * BOX_HEIGHT,
                action.payload.newBox.position[2] +
            (newDirection === DIRECTION.POSITIVE_Z && -1.5 * START_DIMENSIONS.length) +
            (newDirection === DIRECTION.NEGATIVE_Z && 1.5 * START_DIMENSIONS.length),
            ],
            movingBoxDimesions: {
                width: action.payload.newBox.args[0],
                length: action.payload.newBox.args[2],
            },
        };
    case 'GO_OPPOSITE_DIRECTION':
        return {
            ...state,
            direction: getOppositeDirection(state.direction),
        };
    case 'END_GAME':
        return {
            ...state,
            direction: DIRECTION.NONE,
            movingBoxStartingPosition: [
                START_LOCATION.x,
                (state.boxes.length + 1) * BOX_HEIGHT,
                START_LOCATION.z,
            ],
        };

    case 'RESET_GAME':
        return {
            ...state,
            direction: chooseRandomDirection(),
            boxes: initialBoxes,
            movingBoxDimesions: START_DIMENSIONS,
            movingBoxStartingPosition: [START_LOCATION.x, 1 * BOX_HEIGHT, START_LOCATION.z],
        };
    default:
        return state;
    }
};

function getOppositeDirection(direction: DIRECTION) {
    switch (direction) {
    case DIRECTION.NEGATIVE_X:
        return DIRECTION.POSITIVE_X;
    case DIRECTION.POSITIVE_X:
        return DIRECTION.NEGATIVE_X;
    case DIRECTION.POSITIVE_Z:
        return DIRECTION.NEGATIVE_Z;
    case DIRECTION.NEGATIVE_Z:
        return DIRECTION.POSITIVE_Z;
    default:
        DIRECTION.POSITIVE_X;
    }
}

const initialValues: TowerStateType = {
    direction: null,
    movingBoxDimesions: START_DIMENSIONS,
    boxes: initialBoxes,
    movingBoxStartingPosition: [START_LOCATION.x, 2 * BOX_HEIGHT, START_LOCATION.z],
};

export const useTowerReducer = (middleware?: (state: TowerStateType) => void) => {
    const reducer = useReducer(towerReducer, initialValues);
    middleware && middleware(reducer[0]);
    return reducer;
};
