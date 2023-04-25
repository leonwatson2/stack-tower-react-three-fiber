import { Box3 } from 'three';
import { Direction, OverlapDirections, StackingBox } from './Types';
import { TowerConstants } from './constants';

export const boxIsOverLappingPos = (axis: 'x' | 'z', lastBox: Box3, movingBox: Box3) =>
    lastBox.min[axis] < movingBox.min[axis] &&
    lastBox.max[axis] < movingBox.max[axis] &&
    lastBox.max[axis] > movingBox.min[axis];
export const boxIsOverLappingNeg = (axis: 'x' | 'z', lastBox: Box3, movingBox: Box3) =>
    lastBox.min[axis] > movingBox.min[axis] &&
    lastBox.max[axis] > movingBox.max[axis] &&
    lastBox.min[axis] < movingBox.max[axis];
export const boxIsOverLappingPerfectly = (lastBox: Box3, movingBox: Box3) =>
    lastBox.min.x === movingBox.min.x &&
    lastBox.max.x === movingBox.max.x &&
    lastBox.min.z === movingBox.min.z &&
    lastBox.max.z === movingBox.max.z;

export const wasPerfectHit = (direction: Direction) => direction === Direction.NONE;

export const directionBoxesOverlap = (lastBox: Box3, movingBox: Box3) => {
    if (boxIsOverLappingPos('x', lastBox, movingBox)) {
        console.log({ lastBox, movingBox })

        return Direction.POSITIVE_X;
    }
    if (boxIsOverLappingNeg('x', lastBox, movingBox)) {
        return Direction.NEGATIVE_X;
    }
    if (boxIsOverLappingPos('z', lastBox, movingBox)) {
        return Direction.POSITIVE_Z;
    }
    if (boxIsOverLappingNeg('z', lastBox, movingBox)) {
        return Direction.NEGATIVE_Z;
    }
    if (boxIsOverLappingPerfectly(lastBox, movingBox)) {
        return Direction.NONE;
    }
    return Direction.ALL;
};

export const roundBoxMinMaxToTwoDecimals = <T extends Box3[]>(
    ...args: T
): { [K in keyof T]: Box3 } => {
    const rV = args.map((box) => ({
        ...box,
        min: {
            x: +box.min.x.toFixed(2),
            y: +box.min.y.toFixed(2),
            z: +box.min.z.toFixed(2),
        },
        max: {
            x: +box.max.x.toFixed(2),
            y: +box.max.y.toFixed(2),
            z: +box.max.z.toFixed(2),
        },
    })) as { [K in keyof T]: Box3 };
    return rV;
};


export const getNewStackBoxValues: (overlappedDirection: OverlapDirections, previousBoxEdges: Box3, stackBoxEdges: Box3, numberOfBoxes: number
) => StackingBox = (
    overlappedDirection,
    previousBoxEdges,
    stackBoxEdges,
    numberOfBoxes
) => {
        const prevPrev = [previousBoxEdges, previousBoxEdges];
        const prevStack = [previousBoxEdges, stackBoxEdges];
        const stackPrev = [stackBoxEdges, previousBoxEdges];

        const directionVariableMap: {
            [key in OverlapDirections]: {
                lengthValues?: Box3[];
                widthValues?: Box3[];
                missedWidthValues?: Box3[];
                startValues?: Box3[];
            };
        } = {
            [Direction.POSITIVE_X]: {
                lengthValues: prevPrev,
                widthValues: prevStack,
                startValues: stackPrev,
                missedWidthValues: stackPrev,
            },
            [Direction.NEGATIVE_X]: {
                lengthValues: prevPrev,
                widthValues: stackPrev,
                startValues: prevPrev,
                missedWidthValues: prevStack,
            },
            [Direction.POSITIVE_Z]: {
                lengthValues: prevStack,
                widthValues: prevPrev,
                missedWidthValues: prevPrev,
                startValues: prevStack,
            },
            [Direction.NEGATIVE_Z]: {
                lengthValues: stackPrev,
                widthValues: prevStack,
                missedWidthValues: prevPrev,
                startValues: stackPrev,
            },
            [Direction.NONE]: {
                lengthValues: prevPrev,
                widthValues: prevPrev,
                startValues: prevPrev,
                missedWidthValues: prevPrev,
            }
        };

        const length =
            directionVariableMap[overlappedDirection].lengthValues[0].max.z -
            directionVariableMap[overlappedDirection].lengthValues[1].min.z;
        const width =
            directionVariableMap[overlappedDirection].widthValues[0].max.x -
            directionVariableMap[overlappedDirection].widthValues[1].min.x;
        const startX = directionVariableMap[overlappedDirection].startValues[0].min.x + width / 2
        const startZ = directionVariableMap[overlappedDirection].startValues[1].min.z + length / 2

        return {
            position: [startX, numberOfBoxes * TowerConstants.BOX_HEIGHT, startZ],
            args: [width, TowerConstants.BOX_HEIGHT, length],
            color: `hsl(${numberOfBoxes * 36}, 100%, 50%)`,
        };
    }

