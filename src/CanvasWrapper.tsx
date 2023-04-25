import { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraConstants } from './constants';
import { useLocation } from 'react-router-dom';
import { Experience } from './Experience';
import { Leva } from 'leva';

export const CanvasWrapper: FC = () => {
    const location = useLocation();
    const anchor = location.hash.slice(1).split('?')[0];
    const debugMode = anchor === 'db'
    return (
        <>
            <Leva hidden={!debugMode} />
            <Canvas
                id={'game-canvas'}
                camera={{
                    zoom: CameraConstants.START_ZOOM,
                    near: -50,
                    rotation: [0, 0, 0],
                    position: CameraConstants.START_POSITION,
                }}
                orthographic
                shadows
            >
                <Experience debugMode={debugMode} />
            </Canvas>
        </>
    );
}