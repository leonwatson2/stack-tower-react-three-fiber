import { FC } from 'react';
import { StackingBox } from './Types';
import { Text3D } from '@react-three/drei';
import { TowerConstants } from './constants';
import { useControls } from 'leva';
import { useSpring, animated } from '@react-spring/three';

export const TowerLabels: FC<{ boxes: Array<StackingBox>; atStartMenu: boolean }> = ({
    boxes,
    atStartMenu,
}) => {
    const { position, rotation } = useControls(
        'Tower Labels',
        {
            position: {
                value: { x: 1.8, y: 0, z: 1.4 },
                step: 0.2,
            },
            rotation: {
                value: { x: -1, y: 0.66, z: -5.53 },
                step: Math.PI * 0.01,
            },
        },
        { collapsed: true },
    );
    const [{ scale }] = useSpring(
        () => ({
            scale: atStartMenu || boxes.length < 1 ? 0 : 1,
            delay: atStartMenu || boxes.length < 1 ? 0 : 300,
        }),
        [atStartMenu, boxes],
    );
    return (
        <animated.mesh scale={scale}>
            <Text3D
                position={[
                    TowerConstants.START_LOCATION.x - position.x,
                    boxes.length * TowerConstants.BOX_HEIGHT + 1,
                    TowerConstants.START_LOCATION.z - position.z,
                ]}
                rotation={[rotation.x, rotation.y, rotation.z]}
                font={TowerConstants.FONT_FACE}
            >
                {boxes.length}
                <meshBasicMaterial attach="material" color="white" />
            </Text3D>
        </animated.mesh>
    );
};
