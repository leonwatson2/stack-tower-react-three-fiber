/**
 * Box that can be stacked in a tower
 */
export type StackingBox = {
    position: [x: number, y: number, z: number];
    args: [width: number, height: number, depth: number];
    color: string;
};

/**
 * Box section that is missed by the player
 * and falls to the ground
 */
export type MissedBox = (StackingBox & { directionOverlapped: Direction });

export enum Direction {
    POSITIVE_X,
    NEGATIVE_X,
    POSITIVE_Z,
    NEGATIVE_Z,
    NONE,
    ALL,
}

/**
 * Phases of the game
 */
export enum Phase {
    START_MENU,
    PLAYING,
    PAUSED,
    END_GAME,
}

export type OverlapDirections = Exclude<Direction, Direction.ALL>;

export enum Controls {
    reset = 'reset',
    hit = 'hit',
    menu = 'menu',
}
