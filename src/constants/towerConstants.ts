export const BOX_HEIGHT = 1;
export const START_DIMENSIONS = { width: 3, length: 7 };
export const START_LOCATION = { x: 3, z: 3 };
export const TOWER_BOUNDS = {
    positiveX: START_LOCATION.x + START_DIMENSIONS.width * 2,
    positiveZ: START_LOCATION.z + START_DIMENSIONS.length * 2,
    negativeX: START_LOCATION.x - START_DIMENSIONS.width * 2,
    negativeZ: START_LOCATION.z - START_DIMENSIONS.length * 2,
};
export const STARTING_SPEED = 0.05;
export const FONT_FACE = './helvetiker_regular.typeface.json';
