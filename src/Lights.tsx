import { FC } from 'react';

export const Lights: FC = () => {
  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
    </>
  );
};
