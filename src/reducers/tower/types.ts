import { DIRECTION, MissedBox, StackingBox } from '../../Types';

interface StackNewBoxAction {
    type: 'STACK_NEW_BOX';
    payload: {
        newBox: StackingBox;
        missedBox: MissedBox;
    };
}

interface GoOppositeDirectionAction {
    type: 'GO_OPPOSITE_DIRECTION';
}

interface TogglePerfectHitAction {
    type: 'TOGGLE_PERFECT_HIT';
}

interface MainMenuAction {
    type: 'MAIN_MENU';
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
    | MainMenuAction
    | StackNewBoxAction
    | GoOppositeDirectionAction
    | TogglePerfectHitAction
    | StartGameAction
    | ResetGameAction
    | PauseGameAction
    | EndGameAction;

export type TowerStateType = {
    atStartMenu: boolean;
    direction: DIRECTION;
    movingBoxDimesions: { width: number; length: number };
    movingBoxStartingPosition: [x: number, y: number, z: number];
    boxes: Array<StackingBox>;
    missedBoxes: Array<StackingBox>;
    perfectHit: boolean;
};
