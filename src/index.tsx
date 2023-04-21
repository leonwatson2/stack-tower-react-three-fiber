import React from 'react';
import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { Leva } from 'leva';
import { Controls } from './Types';

// eslint-disable-next-line import/named
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const map: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.hit, keys: ['Space'] },
  { name: Controls.reset, keys: ['r'] },
];

root.render(
  <KeyboardControls map={map}>
    <Leva />
    <Canvas
      id={'game-canvas'}
      camera={{
        zoom: 150,
        near: -50,
        rotation: [0, 0, 0],
        position: [1, 1, 1],
      }}
      orthographic
    >
      <Experience />
    </Canvas>
    ,
  </KeyboardControls>,
);
