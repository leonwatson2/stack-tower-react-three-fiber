import { Box3 } from 'three';

export const boxIsOverLappingPos = (axis: 'x' | 'z', lastBox: Box3, movingBox: Box3) =>
    lastBox.min[axis] < movingBox.min[axis] &&
  lastBox.max[axis] < movingBox.max[axis] &&
  lastBox.max[axis] > movingBox.min[axis];
export const boxIsOverLappingNeg = (axis: 'x' | 'z', lastBox: Box3, movingBox: Box3) =>
    lastBox.min[axis] > movingBox.min[axis] &&
  lastBox.max[axis] > movingBox.max[axis] &&
  lastBox.min[axis] < movingBox.max[axis];
