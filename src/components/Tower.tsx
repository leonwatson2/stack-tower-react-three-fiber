import React, { ForwardRefRenderFunction } from 'react';
import { StackingBox } from '../Types';
import { Group, Mesh } from 'three';

type TowerProps = {
    towerBoxes: Array<StackingBox>;
    groupRef: React.MutableRefObject<Group>;
};

const TowerComponent: ForwardRefRenderFunction<Mesh, TowerProps> = (
    { towerBoxes, groupRef },
    ref,
) => {
    return (
        <group ref={groupRef}>
            {towerBoxes.map((box, i) => (
                <mesh
                    key={i}
                    position={box.position}
                    ref={i === towerBoxes.length - 1 ? ref : undefined}
                >
                    <boxGeometry args={box.args} />
                    <meshStandardMaterial color={box.color} />
                </mesh>
            ))}
        </group>
    );
};

export const Tower = React.forwardRef(TowerComponent);
