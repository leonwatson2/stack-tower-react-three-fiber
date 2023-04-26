import { FC, useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { TowerConstants, CameraConstants } from './constants';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { Phase } from './Types';
export const CameraController: FC<{
    height: number;
    towerGroupRef: React.MutableRefObject<THREE.Group>;
    phase: Phase;
}> = ({ height, towerGroupRef, phase }) => {
    const cameraControlsRef = useRef<CameraControls>();

    const lookAtWholeTower = () => {

        cameraControlsRef.current?.setLookAt(
            CameraConstants.START_POSITION[0] + 100,
            CameraConstants.START_POSITION[1] + (3 * TowerConstants.BOX_HEIGHT * height) / 5,
            CameraConstants.START_POSITION[2] + 100,
            towerGroupRef.current.position.x,
            TowerConstants.BOX_HEIGHT * height / 2,
            towerGroupRef.current.position.z,
            true
        )
        cameraControlsRef.current?.zoomTo(1.4, true);

    }

    useControls(
        'camera',
        {
            enable: {
                value: false,
                label: 'Enable Camera Controls',
            },
            position: {
                value: [20, 20, 11],
                onChange: (value) => {
                    cameraControlsRef.current?.setPosition(...value as [number, number, number], true);
                }
            },
            zoomValue: {
                min: 0, max: 100, step: 1, value: CameraConstants.START_ZOOM,
                onChange: (value) => {
                    cameraControlsRef.current?.zoomTo(value, true);
                },
            },
            lookAtTower: button(() => {
                lookAtWholeTower()
            }),
            saveState: button(() => {
                cameraControlsRef.current.saveState();
            }),
        },
        { collapsed: false },
    );

    useEffect(() => {
        const newCameraPosition = [
            CameraConstants.START_POSITION[0],
            CameraConstants.START_POSITION[1] + TowerConstants.BOX_HEIGHT * height,
            CameraConstants.START_POSITION[2],
        ] as [number, number, number];


        if (phase === Phase.START_MENU) {
            cameraControlsRef.current?.setLookAt(CameraConstants.MENU_POSITION[0], 100, CameraConstants.MENU_POSITION[2] + 250, ...CameraConstants.MENU_POSITION, true);
            cameraControlsRef.current?.zoomTo(3.5, true);

        } else if (phase === Phase.END_GAME) {
            lookAtWholeTower();
        } else if (phase === Phase.PLAYING) {
            cameraControlsRef.current?.setLookAt(
                ...newCameraPosition,
                towerGroupRef.current.position.x,
                (4 * TowerConstants.BOX_HEIGHT * height) / 4,
                towerGroupRef.current.position.z,
                true,
            );
            cameraControlsRef.current?.zoomTo(CameraConstants.START_ZOOM, true);

        }
    }, [height, cameraControlsRef, phase]);

    useEffect(() => {
        const oldControls = { ...cameraControlsRef.current?.mouseButtons };
        if (cameraControlsRef.current && phase === Phase.PLAYING) {
            cameraControlsRef.current.mouseButtons.left = 0;
            cameraControlsRef.current.mouseButtons.middle = 0;
            cameraControlsRef.current.mouseButtons.right = 0;
            cameraControlsRef.current.mouseButtons.wheel = 0;

        }
        return () => {
            if (cameraControlsRef.current) {
                cameraControlsRef.current.mouseButtons = oldControls;
            }
        }
    }, [phase])
    return (
        <>
            <CameraControls ref={cameraControlsRef} enabled={true} />
        </>
    );
};
