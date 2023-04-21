import React, { ForwardRefRenderFunction } from 'react';
import { Mesh } from 'three';
import { BOX_HEIGHT } from './constants';

type MovingBoxProps = {
  position: [x: number, y: number, z: number];
  deminsions: {
    width: number;
    length: number;
  };
};

const MovingBoxComponent: ForwardRefRenderFunction<Mesh, MovingBoxProps> = (
    { position, deminsions: { width, length: height } },
    boxRef,
) => {
    return (
        <mesh position={position} ref={boxRef}>
            <boxBufferGeometry args={[width, BOX_HEIGHT, height]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

export const MovingBox = React.forwardRef(MovingBoxComponent);
