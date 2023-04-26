import { Reducer, useReducer } from 'react';
import { Direction, MissedBox, Phase, StackingBox } from '../../Types';
import { TowerConstants } from '../../constants';
import { TowerActionType, TowerStateType } from './types';
import { chooseRandomDirection } from '../../__tests__/utils';

export const initialBoxes: { boxes: Array<StackingBox>, missedBoxes: Array<MissedBox> } =
{
    boxes: [
        {
            position: [TowerConstants.START_LOCATION.x, 0, TowerConstants.START_LOCATION.z],
            args: [
                TowerConstants.START_DIMENSIONS.width,
                TowerConstants.BOX_HEIGHT,
                TowerConstants.START_DIMENSIONS.length,
            ],
            color: 'darkcyan',
        }
    ],
    missedBoxes: []

}



export const towerReducer: Reducer<TowerStateType, TowerActionType> = (state, action) => {
    let newDirection = chooseRandomDirection();
    switch (action.type) {
        case 'START_GAME':
            return {
                ...state,
                phase: Phase.PLAYING,
                atStartMenu: false,
                isEndGame: false,
                direction: newDirection,
                boxes: action.payload.boxes,
                missedBoxes: action.payload.missedBoxes,
                movingBoxStartingPosition: [
                    action.payload.boxes.slice(-1)[0].position[0],
                    action.payload.boxes.length * TowerConstants.BOX_HEIGHT,
                    action.payload.boxes.slice(-1)[0].position[2],
                ],
                movingBoxDimesions: {
                    width: action.payload.boxes.slice(-1)[0].args[0],
                    length: action.payload.boxes.slice(-1)[0].args[2],
                },
            };

        case 'STACK_NEW_BOX':
            return {
                ...state,
                direction: newDirection,
                boxes: [...state.boxes, action.payload.newBox],
                movingBoxStartingPosition: [
                    action.payload.newBox.position[0] +
                    (newDirection === Direction.POSITIVE_X &&
                        -1.5 * TowerConstants.START_DIMENSIONS.width) +
                    (newDirection === Direction.NEGATIVE_X &&
                        1.5 * TowerConstants.START_DIMENSIONS.width),
                    (state.boxes.length + 1) * TowerConstants.BOX_HEIGHT,
                    action.payload.newBox.position[2] +
                    (newDirection === Direction.POSITIVE_Z &&
                        -1.5 * TowerConstants.START_DIMENSIONS.length) +
                    (newDirection === Direction.NEGATIVE_Z &&
                        1.5 * TowerConstants.START_DIMENSIONS.length),
                ],
                movingBoxDimesions: {
                    width: action.payload.newBox.args[0],
                    length: action.payload.newBox.args[2],
                },
                missedBoxes: [...state.missedBoxes, action.payload.missedBox],
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
                phase: Phase.END_GAME,
                isEndGame: true,
                direction: Direction.ALL,
                movingBoxStartingPosition: [
                    TowerConstants.START_LOCATION.x,
                    (state.boxes.length + 1) * TowerConstants.BOX_HEIGHT,
                    TowerConstants.START_LOCATION.z,
                ],
            };
        case 'MAIN_MENU':
            return {
                ...state,
                phase: Phase.START_MENU,
                atStartMenu: true,
                boxes: [],
                movingBoxStartingPosition: [0, 0, 0],
            };
        case 'RESET_GAME':
            return {
                ...state,
                direction: chooseRandomDirection(),
                isEndGame: false,
                boxes: initialBoxes.boxes,
                missedBoxes: initialBoxes.missedBoxes,
                movingBoxDimesions: TowerConstants.START_DIMENSIONS,
                movingBoxStartingPosition: [
                    TowerConstants.START_LOCATION.x,
                    initialBoxes.boxes.length - 1 * TowerConstants.BOX_HEIGHT,
                    TowerConstants.START_LOCATION.z,
                ],
            };
        default:
            return state;
    }
};

function getOppositeDirection(direction: Direction) {
    switch (direction) {
        case Direction.NEGATIVE_X:
            return Direction.POSITIVE_X;
        case Direction.POSITIVE_X:
            return Direction.NEGATIVE_X;
        case Direction.POSITIVE_Z:
            return Direction.NEGATIVE_Z;
        case Direction.NEGATIVE_Z:
            return Direction.POSITIVE_Z;
        default:
            Direction.POSITIVE_X;
    }
}

const initialValues: TowerStateType = {
    phase: Phase.START_MENU,
    atStartMenu: true,
    isEndGame: false,
    direction: Direction.NONE,
    movingBoxDimesions: TowerConstants.START_DIMENSIONS,
    boxes: initialBoxes.boxes,
    movingBoxStartingPosition: [
        TowerConstants.START_LOCATION.x,
        2 * TowerConstants.BOX_HEIGHT,
        TowerConstants.START_LOCATION.z,
    ],
    perfectHit: false,
    missedBoxes: initialBoxes.missedBoxes,
};

export const useTowerReducer = (middleware?: (state: TowerStateType) => void) => {
    const reducer = useReducer(towerReducer, initialValues);
    middleware && middleware(reducer[0]);
    return reducer;
};
