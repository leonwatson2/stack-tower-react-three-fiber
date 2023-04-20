import { FC } from 'react';
import { Debugger } from './Debugger';
import { Lights } from './Lights';

export const Experience: FC = () => {
  return (
    <>
      <Debugger orbitControls />
      <Lights />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="darkcyan" />
      </mesh>
    </>
  );
};
