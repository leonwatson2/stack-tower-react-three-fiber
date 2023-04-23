import { Reducer, useReducer } from 'react';
import { DIRECTION, StackingBox } from '../../Types';
import { TowerConstants } from '../../constants';
import { chooseRandomDirection } from '../../useTowerGame';
import { TowerActionType, TowerStateType } from './types';

export const initialBoxes: Array<StackingBox> = [
    {
        position: [TowerConstants.START_LOCATION.x, 0, TowerConstants.START_LOCATION.z],
        args: [
            TowerConstants.START_DIMENSIONS.width,
            TowerConstants.BOX_HEIGHT,
            TowerConstants.START_DIMENSIONS.length,
        ],
        color: 'darkcyan',
    },
];

export const towerReducer: Reducer<TowerStateType, TowerActionType> = (state, action) => {
    let newDirection: DIRECTION;

    switch (action.type) {
    case 'START_GAME':
        return {
            ...state,
            atStartMenu: false,
            direction: chooseRandomDirection(),
            boxes: action.payload.initialBoxes,
            movingBoxStartingPosition: [
                action.payload.initialBoxes.slice(-1)[0].position[0],
                action.payload.initialBoxes.length * TowerConstants.BOX_HEIGHT,
                action.payload.initialBoxes.slice(-1)[0].position[2],
            ],

            movingBoxDimesions: {
                width: action.payload.initialBoxes.slice(-1)[0].args[0],
                length: action.payload.initialBoxes.slice(-1)[0].args[2],
            },
        };

    case 'STACK_NEW_BOX':
        newDirection = chooseRandomDirection();
        return {
            ...state,
            direction: newDirection,
            boxes: [...state.boxes, action.payload.newBox],
            movingBoxStartingPosition: [
                action.payload.newBox.position[0] +
                        (newDirection === DIRECTION.POSITIVE_X &&
                            -1.5 * TowerConstants.START_DIMENSIONS.width) +
                        (newDirection === DIRECTION.NEGATIVE_X &&
                            1.5 * TowerConstants.START_DIMENSIONS.width),
                (state.boxes.length + 1) * TowerConstants.BOX_HEIGHT,
                action.payload.newBox.position[2] +
                        (newDirection === DIRECTION.POSITIVE_Z &&
                            -1.5 * TowerConstants.START_DIMENSIONS.length) +
                        (newDirection === DIRECTION.NEGATIVE_Z &&
                            1.5 * TowerConstants.START_DIMENSIONS.length),
            ],
            movingBoxDimesions: {
                width: action.payload.newBox.args[0],
                length: action.payload.newBox.args[2],
            },
        };
    case 'TOGGLE_PERFECT_HIT':
        return {
            ...state,
            perfectHit: !state.perfectHit,
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
                TowerConstants.START_LOCATION.x,
                (state.boxes.length + 1) * TowerConstants.BOX_HEIGHT,
                TowerConstants.START_LOCATION.z,
            ],
        };
    case 'MAIN_MENU':
        return {
            ...state,
            atStartMenu: true,
            boxes: [],
            movingBoxStartingPosition: [0, 0, 0],
        };
    case 'RESET_GAME':
        return {
            ...state,
            direction: chooseRandomDirection(),
            boxes: initialBoxes,
            movingBoxDimesions: TowerConstants.START_DIMENSIONS,
            movingBoxStartingPosition: [
                TowerConstants.START_LOCATION.x,
                initialBoxes.length - 1 * TowerConstants.BOX_HEIGHT,
                TowerConstants.START_LOCATION.z,
            ],
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
    atStartMenu: true,
    direction: DIRECTION.NONE,
    movingBoxDimesions: TowerConstants.START_DIMENSIONS,
    boxes: initialBoxes,
    movingBoxStartingPosition: [
        TowerConstants.START_LOCATION.x,
        2 * TowerConstants.BOX_HEIGHT,
        TowerConstants.START_LOCATION.z,
    ],
    perfectHit: false,
};

export const useTowerReducer = (middleware?: (state: TowerStateType) => void) => {
    const reducer = useReducer(towerReducer, initialValues);
    middleware && middleware(reducer[0]);
    return reducer;
};
