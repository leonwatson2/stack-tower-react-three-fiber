import { Box3 } from 'three';
import { DIRECTION } from './Types';

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

export const directionBoxesOverlap = (lastBox: Box3, movingBox: Box3) => {
    if (boxIsOverLappingPos('x', lastBox, movingBox)) {
        return DIRECTION.POSITIVE_X;
    }
    if (boxIsOverLappingNeg('x', lastBox, movingBox)) {
        return DIRECTION.NEGATIVE_X;
    }
    if (boxIsOverLappingPos('z', lastBox, movingBox)) {
        return DIRECTION.POSITIVE_Z;
    }
    if (boxIsOverLappingNeg('z', lastBox, movingBox)) {
        return DIRECTION.NEGATIVE_Z;
    }
    if (boxIsOverLappingPerfectly(lastBox, movingBox)) {
        return DIRECTION.ALL;
    }
    return DIRECTION.NONE;
};

export const roundBoxMinMaxToTwoDecimals = <T extends Box3[]>(
    ...args: T
): { [K in keyof T]: Box3 } => {
    const rV = args.map((box) => ({
        ...box,
        min: {
            x: +box.min.x.toFixed(4),
            y: +box.min.y.toFixed(4),
            z: +box.min.z.toFixed(4),
        },
        max: {
            x: +box.max.x.toFixed(4),
            y: +box.max.y.toFixed(4),
            z: +box.max.z.toFixed(4),
        },
    })) as { [K in keyof T]: Box3 };
    return rV;
};
