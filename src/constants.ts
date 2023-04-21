export const BOX_HEIGHT = 0.4;
export const START_DIMENSIONS = { width: 1, length: 1 };
export const START_LOCATION = { x: 3, z: 3 };
export const TOWER_BOUNDS = {
    positiveX: START_LOCATION.x + START_DIMENSIONS.width * 2,
    positiveZ: START_LOCATION.z + START_DIMENSIONS.length * 2,
    negativeX: START_LOCATION.x - START_DIMENSIONS.width * 2,
    negativeZ: START_LOCATION.z - START_DIMENSIONS.length * 2,
};
export const STARTING_SPEED = 0.02;
