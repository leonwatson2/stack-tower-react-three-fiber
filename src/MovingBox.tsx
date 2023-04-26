import React, { ForwardRefRenderFunction } from 'react';
import * as THREE from 'three';

import { TowerConstants } from './constants';

type MovingBoxProps = {
    position: [x: number, y: number, z: number];
    deminsions: {
        width: number;
        length: number;
    };
    color: string;
};

const MovingBoxComponent: ForwardRefRenderFunction<THREE.Mesh, MovingBoxProps> = (
    { position, deminsions: { width, length: height }, color },
    boxRef,
) => {
    return (
        <mesh position={position} ref={boxRef}>
            <boxGeometry args={[width, TowerConstants.BOX_HEIGHT, height]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export const MovingBox = React.forwardRef(MovingBoxComponent);
