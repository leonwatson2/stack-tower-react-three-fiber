import { DIRECTION, StackingBox } from '../../Types';

interface StackNewBoxAction {
    type: 'STACK_NEW_BOX';
    payload: {
        newBox: StackingBox;
    };
}

interface GoOppositeDirectionAction {
    type: 'GO_OPPOSITE_DIRECTION';
}

interface TogglePerfectHitAction {
    type: 'TOGGLE_PERFECT_HIT';
}

interface StartGameAction {
    type: 'START_GAME';
    payload: {
        initialBoxes: StackingBox[];
    };
}

interface ResetGameAction {
    type: 'RESET_GAME';
}

interface PauseGameAction {
    type: 'PAUSE_GAME';
}

interface EndGameAction {
    type: 'END_GAME';
}

export type TowerActionType =
    | StackNewBoxAction
    | GoOppositeDirectionAction
    | TogglePerfectHitAction
    | StartGameAction
    | ResetGameAction
    | PauseGameAction
    | EndGameAction;

export type TowerStateType = {
    direction: DIRECTION;
    movingBoxDimesions: { width: number; length: number };
    movingBoxStartingPosition: [x: number, y: number, z: number];
    boxes: Array<StackingBox>;
    perfectHit: boolean;
};
