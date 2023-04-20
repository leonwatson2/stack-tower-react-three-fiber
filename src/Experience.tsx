import { FC, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import { Debugger } from './Debugger';
import { Lights } from './Lights';
import { START_DIMENSIONS, BOX_HEIGHT, TOWER_BOUNDS, STARTING_SPEED } from './constants';
import { Tower } from './components/Tower';
import { DIRECTION, StackingBox } from './Types';
import { Mesh } from 'three';
import { MovingBox } from './MovingBox';

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

export const Experience: FC = () => {
  const { movingBox, lastBox } = useTowerGame();

  return (
    <>
      <Debugger orbitControls />
      <Lights />
      <MovingBox currentStackNumber={3} ref={movingBox} deminsions={{ ...START_DIMENSIONS }} />
      <Tower towerBoxes={boxes} ref={lastBox} />
    </>
  );
};

const chooseRandomDirection = (setDirection: React.Dispatch<React.SetStateAction<DIRECTION>>) => {
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

const moveInDirection: Record<
  DIRECTION,
  (movingBox: Mesh, setDirection: React.Dispatch<React.SetStateAction<DIRECTION>>) => void
> = {
  [DIRECTION.POSITIVE_X]: (movingBox, setDirection) => {
    const { max, min } = new THREE.Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.x - max.x < 0.01) {
      setDirection(DIRECTION.NEGATIVE_X);
    } else {
      movingBox.position.x += STARTING_SPEED;
    }
  },
  [DIRECTION.NEGATIVE_X]: (movingBox, setDirection) => {
    const { max, min } = new THREE.Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.x + min.x < 0.01) {
      setDirection(DIRECTION.POSITIVE_X);
    } else {
      movingBox.position.x -= STARTING_SPEED;
    }
  },
  [DIRECTION.POSITIVE_Z]: (movingBox, setDirection) => {
    const { max, min } = new THREE.Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.z - max.z < 0.01) {
      setDirection(DIRECTION.NEGATIVE_Z);
    } else {
      movingBox.position.z += STARTING_SPEED;
    }
  },
  [DIRECTION.NEGATIVE_Z]: (movingBox, setDirection) => {
    const { max, min } = new THREE.Box3().setFromObject(movingBox);
    if (TOWER_BOUNDS.z + min.z < 0.01) {
      setDirection(DIRECTION.POSITIVE_Z);
    } else {
      movingBox.position.z -= STARTING_SPEED;
    }
  },
};

function useTowerGame() {
  const lastBox = useRef<Mesh>();
  const movingBox = useRef<Mesh>();

  const [direction, setDirection] = useState<DIRECTION>();
  useEffect(() => {
    if (!direction) {
      chooseRandomDirection(setDirection);
    }
  }, []);

  useFrame(() => {
    if (direction) moveInDirection[direction](movingBox.current, setDirection);
  });
  return { movingBox, lastBox };
}
