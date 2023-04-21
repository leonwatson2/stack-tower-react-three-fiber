import { FC, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { BOX_HEIGHT } from './constants';

export const CameraController: FC<{ height: number }> = ({ height }) => {
    const cameraControlsRef = useRef<CameraControls>();

    const { camera } = useThree();

    useEffect(() => {
        if (height < 23) cameraControlsRef.current?.zoom((-camera.zoom / 68) * BOX_HEIGHT, true);
        if (height > 23) cameraControlsRef.current?.zoom((-camera.zoom / 87.5) * BOX_HEIGHT, true);
        () => cameraControlsRef.current?.dolly(1, true);
    }, [height]);

    return (
        <>
            <CameraControls ref={cameraControlsRef} minDistance={0} enabled={true} />
        </>
    );
};
