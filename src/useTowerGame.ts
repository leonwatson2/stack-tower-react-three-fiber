import { useEffect, useRef, useState } from 'react';
import { Mesh, Box3 } from 'three';
import { useFrame } from '@react-three/fiber';

import { TOWER_BOUNDS, STARTING_SPEED, START_DIMENSIONS, BOX_HEIGHT } from './constants';
import { DIRECTION, StackingBox } from './Types';

export const useTowerGame = () => {
  const lastBox = useRef<Mesh>();
  const movingBox = useRef<Mesh>();
  const [movingBoxDimesions] = useState(START_DIMENSIONS);
  const [direction, setDirection] = useState<DIRECTION>();

  const boxes: Array<StackingBox> = [
    {
      position: [0, 0, 0],
      args: [START_DIMENSIONS.width, BOX_HEIGHT, START_DIMENSIONS.length],
      color: 'darkcyan',
    },
    {
      position: [0, 1 * BOX_HEIGHT, 0],
      args: [START_DIMENSIONS.width, BOX_HEIGHT, START_DIMENSIONS.length],
      color: 'cyan',
    },
    {
      position: [0, 2 * BOX_HEIGHT, 0],
      args: [START_DIMENSIONS.width, BOX_HEIGHT, START_DIMENSIONS.length],
      color: 'DarkGreen',
    },
  ];

  useEffect(() => {
    if (!direction) {
      chooseRandomDirection(setDirection);
    }
  }, []);

  useFrame(() => {
    if (direction) moveInDirection[direction](movingBox.current, setDirection);
  });
  return { movingBox, lastBox, boxes, movingBoxDimesions };
};

export const chooseRandomDirection = (
  setDirection: React.Dispatch<React.SetStateAction<DIRECTION>>,
) => {
  const randomDirection = Math.floor(Math.random() * 4);
  switch (randomDirection) {
    case 0:
      setDirection(DIRECTION.POSITIVE_X);
      break;
    case 1:
      setDirection(DIRECTION.NEGATIVE_X);
      break;
    case 2:
      setDirection(DIRECTION.POSITIVE_Z);
      break;
    case 3:
      setDirection(DIRECTION.NEGATIVE_Z);
      break;
    default:
      setDirection(DIRECTION.POSITIVE_X);
      break;
  }
};

export const moveInDirection: Record<
  DIRECTION,
  (movingBox: Mesh, setDirection: React.Dispatch<React.SetStateAction<DIRECTION>>) => void
> = {
  [DIRECTION.POSITIVE_X]: (movingBox, setDirection) => {
    const { max } = new Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.x - max.x < 0.01) {
      setDirection(DIRECTION.NEGATIVE_X);
    } else {
      movingBox.position.x += STARTING_SPEED;
    }
  },
  [DIRECTION.NEGATIVE_X]: (movingBox, setDirection) => {
    const { min } = new Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.x + min.x < 0.01) {
      setDirection(DIRECTION.POSITIVE_X);
    } else {
      movingBox.position.x -= STARTING_SPEED;
    }
  },
  [DIRECTION.POSITIVE_Z]: (movingBox, setDirection) => {
    const { max } = new Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.z - max.z < 0.01) {
      setDirection(DIRECTION.NEGATIVE_Z);
    } else {
      movingBox.position.z += STARTING_SPEED;
    }
  },
  [DIRECTION.NEGATIVE_Z]: (movingBox, setDirection) => {
    const { min } = new Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.z + min.z < 0.01) {
      setDirection(DIRECTION.POSITIVE_Z);
    } else {
      movingBox.position.z -= STARTING_SPEED;
    }
  },
};
