import React, { ForwardRefRenderFunction } from 'react';
import { MissedBox, StackingBox } from '../Types';
import { Group, Mesh } from 'three';

type TowerProps = {
    towerBoxes: Array<StackingBox>;
    missedBoxes: Array<MissedBox>;
    groupRef: React.MutableRefObject<Group>;
};

const TowerComponent: ForwardRefRenderFunction<Mesh, TowerProps> = (
    { towerBoxes, groupRef, missedBoxes },
    ref,
) => {
    return (
        <>
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

            {missedBoxes.map((box, i) =>
                box !== null ? (
                    <mesh
                        key={i}
                        position={box.position}
                        ref={i === towerBoxes.length - 1 ? ref : undefined}
                    >
                        <boxGeometry args={box.args} />
                        <meshStandardMaterial color={box.color} />
                    </mesh>
                ) : null,
            )}
        </>
    );
};

export const Tower = React.forwardRef(TowerComponent);
