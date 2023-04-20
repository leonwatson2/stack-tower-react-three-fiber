import { FC } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';

export const Debugger: FC<{ perf?: boolean; orbitControls?: boolean }> = ({
  perf = false,
  orbitControls = false,
}) => {
  return (
    <>
      {perf && <Perf />}
      {orbitControls && <OrbitControls />}
    </>
  );
};
