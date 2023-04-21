import React, { ForwardRefRenderFunction } from 'react';
import { StackingBox } from '../Types';
import { Mesh } from 'three';

type TowerProps = {
  towerBoxes: Array<StackingBox>;
};

const TowerComponent: ForwardRefRenderFunction<Mesh, TowerProps> = ({ towerBoxes }, ref) => {
  return (
    <>
      {towerBoxes.map((box, i) => (
        <mesh key={i} position={box.position} ref={i === towerBoxes.length - 1 ? ref : undefined}>
          <boxGeometry args={box.args} />
          <meshStandardMaterial color={box.color} />
        </mesh>
      ))}
    </>
  );
};

export const Tower = React.forwardRef(TowerComponent);
