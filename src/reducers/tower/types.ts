import { Direction, MissedBox, Phase, StackingBox } from '../../Types';

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
        boxes: Array<StackingBox>;
        missedBoxes: Array<MissedBox>;
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
    phase: Phase;
    atStartMenu: boolean;
    isEndGame: boolean,
    direction: Direction;
    movingBoxDimesions: { width: number; length: number };
    movingBoxStartingPosition: [x: number, y: number, z: number];
    boxes: Array<StackingBox>;
    missedBoxes: Array<MissedBox>;
    perfectHit: boolean;
};
