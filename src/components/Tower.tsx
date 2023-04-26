import React, { ForwardRefRenderFunction, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';


import { Direction, MissedBox, StackingBox } from '../Types';
import { TowerConstants } from '../constants';
import { wasPerfectHit } from '../utils';

type TowerProps = {
    towerBoxes: Array<StackingBox>;
    missedBoxes: Array<MissedBox>;
    groupRef: React.MutableRefObject<THREE.Group>;
    positiveGravity?: boolean;
};

const TowerComponent: ForwardRefRenderFunction<THREE.Mesh, TowerProps> = (
    { towerBoxes, groupRef, missedBoxes, positiveGravity = false },
    ref,
) => {

    const boxGeometry = useMemo(() => {
        return new THREE.BoxGeometry(1, 1, 1)
    }, [])
    return (
        <Physics gravity={[0, positiveGravity ? 120 : -120, 0]}>
            <group castShadow receiveShadow ref={groupRef}>
                {towerBoxes.map((box, i) => (
                    <group key={i}>
                        <RigidBody key={i} type={'fixed'}>
                            <mesh
                                position={box.position}
                                ref={i === towerBoxes.length - 1 ? ref : undefined}
                                scale={box.args}
                                geometry={boxGeometry}
                            >
                                <meshStandardMaterial roughness={.91} flatShading color={box.color} />
                            </mesh>
                        </RigidBody>
                    </group>
                ))}
            </group>

            {missedBoxes.map((box, i) => {
                if (wasPerfectHit(box.directionOverlapped)) return <PerfectHitRing key={i} box={box} level={i} />;
                const rotationZ =
                    box.args[0] > TowerConstants.START_DIMENSIONS.length / 2
                        ? 0
                        : box.directionOverlapped === Direction.POSITIVE_X
                            ? Math.PI * -0.2
                            : box.directionOverlapped === Direction.NEGATIVE_X
                                ? Math.PI * 0.2
                                : 0;
                const rotationX =
                    box.args[2] > TowerConstants.START_DIMENSIONS.width / 2
                        ? 0
                        : box.directionOverlapped === Direction.POSITIVE_Z
                            ? Math.PI * 0.2
                            : box.directionOverlapped === Direction.NEGATIVE_Z
                                ? Math.PI * -0.2
                                : 0;
                const chipRotation: [number, number, number] = [rotationX, 0, rotationZ];
                return (
                    <RigidBody key={i} >
                        <mesh
                            castShadow
                            position={box.position}
                            ref={i === towerBoxes.length - 1 ? ref : undefined}
                            rotation={chipRotation}
                            scale={box.args}
                            geometry={boxGeometry}
                        >
                            <meshStandardMaterial flatShading color={box.color} />
                        </mesh>
                    </RigidBody>
                );
            })}

        </Physics>
    );
};

import { useControls } from 'leva';
import { useSpring, animated } from '@react-spring/three';
export const Tower = React.forwardRef(TowerComponent);

function PerfectHitRing({ box, level }: { box: StackingBox, level: number }) {
    // lines for every edge of the box drawn
    const { scale } = useControls('box', {
        position: [0, 0, 0],
        scale: { value: 1, step: 1, min: 0, max: 300 },

    });
    const { opacity } = useSpring({
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: { duration: .403, },
        loop: true,

    },)
    const positionOut = 1.5


    return (
        <group >

            <animated.mesh position={new THREE.Vector3(...box.position).sub(new THREE.Vector3(...[0, TowerConstants.BOX_HEIGHT / 2, 0]))}>

                <boxGeometry args={[box.args[0] + positionOut, .01, box.args[2] + positionOut]} />
                <animated.meshStandardMaterial color={box.color} transparent opacity={opacity} />


            </animated.mesh>
        </group>
    )
}
