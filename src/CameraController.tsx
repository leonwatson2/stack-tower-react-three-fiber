import * as THREE from 'three';
import { FC, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useControls, button, buttonGroup, folder } from 'leva';

const { DEG2RAD } = THREE.MathUtils;

export const CameraController: FC<{ height: number }> = ({ height }) => {
  const meshRef = useRef();
  const cameraControlsRef = useRef<CameraControls>();

  const { camera } = useThree();

  useEffect(() => {
    if (height < 23) cameraControlsRef.current?.zoom(-camera.zoom / 27, true);
    if (height > 23) cameraControlsRef.current?.zoom(-camera.zoom / 35, true);
    () => cameraControlsRef.current?.dolly(1, true);
  }, [height]);
  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html

  return (
    <>
      <CameraControls ref={cameraControlsRef} minDistance={0} enabled={true} />
    </>
  );
};
