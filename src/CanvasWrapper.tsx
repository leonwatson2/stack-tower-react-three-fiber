import { FC, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraConstants } from './constants';
import { useLocation } from 'react-router-dom';
import { Experience } from './Experience';
import { Leva } from 'leva';
import { SoundTypes, SoundsHub } from './SoundsHub';

export const CanvasWrapper: FC = () => {
    const location = useLocation();
    const anchor = location.hash.slice(1).split('?')[0];
    const debugMode = anchor === 'db'
    const soundRef = useRef<(sounds: SoundTypes) => void>();
    return (
        <>
            <SoundsHub soundRef={soundRef} />
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
                <Experience debugMode={debugMode} sounds={soundRef} />
            </Canvas>
        </>
    );
}