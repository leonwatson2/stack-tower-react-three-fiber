import React, { ForwardRefRenderFunction } from 'react';
import { Mesh } from 'three';
import { BOX_HEIGHT } from './constants';

type MovingBoxProps = {
  currentStackNumber: number;
  deminsions: {
    width: number;
    length: number;
  };
};

const MovingBoxComponent: ForwardRefRenderFunction<Mesh, MovingBoxProps> = (
  { currentStackNumber, deminsions: { width, length: height } },
  boxRef,
) => {
  return (
    <mesh position-y={currentStackNumber * BOX_HEIGHT} ref={boxRef}>
      <boxBufferGeometry args={[width, BOX_HEIGHT, height]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export const MovingBox = React.forwardRef(MovingBoxComponent);
