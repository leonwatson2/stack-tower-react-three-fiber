/**
 * Box that can be stacked in a tower
 */
export type StackingBox = {
  position: [x: number, y: number, z: number];
  args: [width: number, height: number, depth: number];
  color: string;
};

export enum DIRECTION {
  POSITIVE_X,
  NEGATIVE_X,
  POSITIVE_Z,
  NEGATIVE_Z,
}

export enum Controls {
  reset = 'forward',
  hit = 'hit',
}
