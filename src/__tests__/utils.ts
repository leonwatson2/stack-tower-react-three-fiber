import { Direction, MissedBox, StackingBox } from "../Types";
import { TowerConstants } from "../constants";

export const chooseRandomDirection: (chosenDirections?: Array<Direction>) => Direction = (
    chosenDirections,
) => {
    const map = {
        0: Direction.POSITIVE_X,
        1: Direction.POSITIVE_Z,
        2: Direction.NEGATIVE_X,
        3: Direction.NEGATIVE_Z,
        4: Direction.NONE,
    };
    const randomDirection = Math.floor(Math.random() * (chosenDirections ? chosenDirections.length - 1 : 4));
    if (chosenDirections !== undefined) return chosenDirections[randomDirection % chosenDirections.length + 1];
    return map[randomDirection];
};

export const createFakeTowerBoxes:
    (count: number, directionOptions?: Array<Direction>) => { boxes: Array<StackingBox>, missedBoxes: Array<MissedBox> } =
    (count, directionOptions = [
        Direction.POSITIVE_X,
        Direction.POSITIVE_X,
        Direction.POSITIVE_Z,
        Direction.NEGATIVE_X,
        Direction.NEGATIVE_Z,
        Direction.NONE,
    ]
    ) => {
        const firstBox = {
            position: [TowerConstants.START_LOCATION.x, 0, TowerConstants.START_LOCATION.z],
            args: [
                TowerConstants.START_DIMENSIONS.width,
                TowerConstants.BOX_HEIGHT,
                TowerConstants.START_DIMENSIONS.length,
            ],
            color: 'darkcyan',
        }
        return new Array(count).fill(0).reduce((acc, _, i) => {
            if (i === 0) return acc
            const { box, missedBox } = createBoxPairOverlappingDirection(chooseRandomDirection(directionOptions), acc.boxes[i - 1], i)
            return {
                boxes: [...acc.boxes, box],
                missedBoxes: [...acc.missedBoxes, missedBox]
            }
        }, { boxes: [firstBox], missedBoxes: [] })
    }

export const createBoxPairOverlappingDirection = (direction: Direction, prevBox: StackingBox, level: number): { box: StackingBox, missedBox: MissedBox } => {

    const offset = .05
    switch (direction) {
        case Direction.NONE:
            return {
                box: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [prevBox.args[0], prevBox.args[1], prevBox.args[2]],
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                },
                missedBox: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [prevBox.args[0], prevBox.args[1], prevBox.args[2]],
                    color: prevBox.color,
                    directionOverlapped: direction,
                }
            }
        case Direction.POSITIVE_X:
            return {
                box: {
                    position: [prevBox.position[0] + offset, level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [prevBox.args[0] - offset * 2, prevBox.args[1], prevBox.args[2]],
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                },
                missedBox: {
                    position: [prevBox.position[0] + offset / 2 + (prevBox.args[0]) / 2, level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [offset, prevBox.args[1], prevBox.args[2]],
                    color: 'red',
                    directionOverlapped: direction,
                }
            }
        case Direction.POSITIVE_Z:
            return {
                box: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2] + offset],
                    args: [prevBox.args[0], prevBox.args[1], prevBox.args[2] - offset * 2],
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                },
                missedBox: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2] + offset / 2 + (prevBox.args[2]) / 2],
                    args: [prevBox.args[0], prevBox.args[1], offset],
                    color: 'red',
                    directionOverlapped: direction,
                }
            }
        case Direction.NEGATIVE_X:
            return {
                box: {
                    position: [prevBox.position[0] - offset, level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [prevBox.args[0] - offset * 2, prevBox.args[1], prevBox.args[2]],
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                },
                missedBox: {
                    position: [prevBox.position[0] - offset / 2 - (prevBox.args[0]) / 2, level * TowerConstants.BOX_HEIGHT, prevBox.position[2]],
                    args: [offset, prevBox.args[1], prevBox.args[2]],
                    color: 'red',
                    directionOverlapped: direction,

                }
            }
        case Direction.NEGATIVE_Z:
            return {
                box: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2] - offset],
                    args: [prevBox.args[0], prevBox.args[1], prevBox.args[2] - offset * 2],
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                },
                missedBox: {
                    position: [prevBox.position[0], level * TowerConstants.BOX_HEIGHT, prevBox.position[2] - offset / 2 - (prevBox.args[2]) / 2],
                    args: [prevBox.args[0], prevBox.args[1], offset],
                    color: 'red',
                    directionOverlapped: direction,
                }
            }
    }
}

