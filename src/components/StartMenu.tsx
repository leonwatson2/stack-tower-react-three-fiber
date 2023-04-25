import { FC, useRef } from 'react';
import { Text3D } from '@react-three/drei';
import { folder, useControls } from 'leva';
import { TowerConstants } from '../constants';
import { useSprings, animated } from '@react-spring/three';

export const StartMenu: FC<{
    onStart: () => void;
    onAbout?: () => void;
    onContinue?: () => void;
    atStartMenu: boolean;
}> = ({ onStart, onAbout, onContinue, atStartMenu }) => {
    const groupRef = useRef();
    const [springs] = useSprings(
        3,
        (springIndex) => ({
            scale: atStartMenu ? ([1, 1, 1] as const) : ([0, 0, 0] as const),
            position: atStartMenu
                ? ([-6, 15.1 - (springIndex + 1) * 1.75, 14.7] as const)
                : ([0, 15.1 - (springIndex + 1) * 1.75, 0] as const),
        }),
        [atStartMenu],
    );
    const { position } = useControls(
        'Start Menu',
        {
            position: { value: [0, 5, 15], step: 0.1 },
            animation: folder({
                scaleFactor: { value: 1, step: 0.1 },
            }),
        },
        { collapsed: true },
    );

    const buttonProps = [
        {
            text: 'Start',
            action: onStart,
        },
        {
            text: 'About',
            action: onAbout,
        },
        {
            text: 'Continue',
            action: onContinue,
        },
    ];
    return (
        <group ref={groupRef}>
            <Text3D position={[0, 1, -5]} font={TowerConstants.FONT_FACE}>
                Tower of Dat Boi
                <color attach="material" args={['red']} />
            </Text3D>
            {buttonProps.map(({ text, action }, index) => (
                <animated.mesh
                    key={index}
                    scale={springs[index].scale}
                    position={springs[index].position}
                >
                    <group onPointerUp={action}>
                        <mesh rotation-y={Math.PI * 2} position={[2, 0.1, -0.2]}>
                            <boxGeometry attach="geometry" args={[5, 1.5, 0.5]} />
                            <meshBasicMaterial
                                attach="material"
                                color={`hsl(${(index + 1) * 40}, 100%, 50%)`}
                            />
                        </mesh>
                        <Text3D font={TowerConstants.FONT_FACE} scale={[0.75, 0.75, 0.75]}>
                            {text}
                            <meshBasicMaterial attach="material" color="white" />
                        </Text3D>
                    </group>
                </animated.mesh>
            ))}
        </group>
    );
};

