import { FC, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';

export const CameraController: FC<{ height: number }> = ({ height }) => {
    const cameraControlsRef = useRef<CameraControls>();

    const { camera } = useThree();

    useEffect(() => {
        if (height < 23) cameraControlsRef.current?.zoom(-camera.zoom / 27, true);
        if (height > 23) cameraControlsRef.current?.zoom(-camera.zoom / 35, true);
        () => cameraControlsRef.current?.dolly(1, true);
    }, [height]);

    return (
        <>
            <CameraControls ref={cameraControlsRef} minDistance={0} enabled={true} />
        </>
    );
};
