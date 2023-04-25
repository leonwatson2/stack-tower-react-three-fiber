import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Controls } from './Types';
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';
import { CanvasWrapper } from './CanvasWrapper';

import './style.css';
const root = ReactDOM.createRoot(document.querySelector('#root'));

const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.hit, keys: ['Space'] },
    { name: Controls.reset, keys: ['r'] },
    { name: Controls.menu, keys: ['KeyM'] },
];



root.render(
    <KeyboardControls map={map}>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<CanvasWrapper />} />
            </Routes>
        </BrowserRouter>
    </KeyboardControls>
);
