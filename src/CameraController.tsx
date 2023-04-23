import { FC, useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { TowerConstants, CameraConstants } from './constants';
import { button, useControls } from 'leva';
import { Group } from 'three';

export const CameraController: FC<{
    height: number;
    towerGroupRef: React.MutableRefObject<Group>;
    atStartMenu: boolean;
}> = ({ height, towerGroupRef, atStartMenu }) => {
    const cameraControlsRef = useRef<CameraControls>();

    const { position, enable } = useControls(
        'camera',
        {
            enable: {
                value: false,
                label: 'Enable Camera Controls',
            },
            position: {
                value: [20, 20, 14],
            },
            getCurrentPosition: button(() => {
                console.log({
                    position: cameraControlsRef.current?.camera.position,
                    zoom: cameraControlsRef.current?.camera.zoom,
                });
            }),
            saveState: button(() => {
                cameraControlsRef.current.saveState();
            }),
        },
        { collapsed: true },
    );
    useEffect(() => {
        const newCameraPosition = [
            CameraConstants.START_POSITION[0],
            CameraConstants.START_POSITION[1] + (2 * TowerConstants.BOX_HEIGHT * height) / 4,
            CameraConstants.START_POSITION[2],
        ] as [number, number, number];
        const debugCameraPosition = [
            position[0],
            position[1] + TowerConstants.BOX_HEIGHT * height,
            position[2],
        ] as [number, number, number];
        const currentCameraPosition = enable ? newCameraPosition : debugCameraPosition;
        if (atStartMenu) {
            cameraControlsRef.current?.setLookAt(13, 20, 45, 0, 10, 15, true);
        } else {
            cameraControlsRef.current?.setLookAt(
                ...currentCameraPosition,
                towerGroupRef.current.position.x,
                (3 * TowerConstants.BOX_HEIGHT * height) / 4,
                towerGroupRef.current.position.z,
                true,
            );
        }
        towerGroupRef.current.position;
    }, [height, cameraControlsRef, atStartMenu]);

    return (
        <>
            <CameraControls ref={cameraControlsRef} enabled={true} />
        </>
    );
};
