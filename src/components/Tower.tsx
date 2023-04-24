import React, { ForwardRefRenderFunction } from 'react';
import { DIRECTION, MissedBox, StackingBox } from '../Types';
import { Group, Mesh } from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import { TowerConstants } from '../constants';
type TowerProps = {
    towerBoxes: Array<StackingBox>;
    missedBoxes: Array<MissedBox>;
    groupRef: React.MutableRefObject<Group>;
    positiveGravity?: boolean;
};

const TowerComponent: ForwardRefRenderFunction<Mesh, TowerProps> = (
    { towerBoxes, groupRef, missedBoxes, positiveGravity = false },
    ref,
) => {
    return (
        <Physics gravity={[0, positiveGravity ? 12 : -12, 0]}>
            <group castShadow receiveShadow ref={groupRef}>
                {towerBoxes.map((box, i) => (
                    <RigidBody key={i} type={'fixed'}>
                        <mesh
                            position={box.position}
                            ref={i === towerBoxes.length - 1 ? ref : undefined}
                        >
                            <boxGeometry args={box.args} />
                            <meshStandardMaterial color={box.color} />
                        </mesh>
                    </RigidBody>
                ))}
            </group>

            {missedBoxes.map((box, i) => {
                if (box === null) return null;
                const rotationZ =
                    box.args[0] > TowerConstants.START_DIMENSIONS.length / 2
                        ? 0
                        : box.directionOverlapped === DIRECTION.POSITIVE_X
                            ? Math.PI * -0.2
                            : box.directionOverlapped === DIRECTION.NEGATIVE_X
                                ? Math.PI * 0.2
                                : 0;
                const rotationX =
                    box.args[2] > TowerConstants.START_DIMENSIONS.width / 2
                        ? 0
                        : box.directionOverlapped === DIRECTION.POSITIVE_Z
                            ? Math.PI * 0.2
                            : box.directionOverlapped === DIRECTION.NEGATIVE_Z
                                ? Math.PI * -0.2
                                : 0;
                const chipRotation: [number, number, number] = [rotationX, 0, rotationZ];
                return (
                    <RigidBody key={i}>
                        <mesh
                            castShadow
                            position={box.position}
                            ref={i === towerBoxes.length - 1 ? ref : undefined}
                            rotation={chipRotation}
                        >
                            <boxGeometry args={box.args} />
                            <meshStandardMaterial color={box.color} />
                        </mesh>
                    </RigidBody>
                );
            })}
        </Physics>
    );
};

export const Tower = React.forwardRef(TowerComponent);
