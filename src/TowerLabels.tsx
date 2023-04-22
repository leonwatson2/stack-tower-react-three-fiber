import { FC } from 'react';
import { StackingBox } from './Types';
import { Text3D } from '@react-three/drei';
import { TowerConstants } from './constants';
import { useControls } from 'leva';

export const TowerLabels: FC<{ boxes: Array<StackingBox> }> = ({ boxes }) => {
    const { position, rotation } = useControls(
        'Tower Labels',
        {
            position: {
                value: { x: 1.8, z: 1.4 },
                step: 0.2,
            },
            rotation: {
                value: { x: -1, y: 0.66, z: -5.53 },
                step: Math.PI * 0.01,
            },
        },
        { collapsed: true },
    );
    return (
        <>
            <Text3D
                position={[
                    TowerConstants.START_LOCATION.x - position.x,
                    boxes.length * TowerConstants.BOX_HEIGHT,
                    TowerConstants.START_LOCATION.z - position.z,
                ]}
                rotation={[rotation.x, rotation.y, rotation.z]}
                font={TowerConstants.FONT_FACE}
            >
                {boxes.length}
                <meshBasicMaterial attach="material" color="white" />
            </Text3D>
        </>
    );
};
