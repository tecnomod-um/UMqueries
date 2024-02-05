import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './scene';

const LandingBackground = () => {
    return (
        <Canvas style={{ position: 'absolute', top: 0, left: 0, height: '100vh', zIndex: -1 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Scene />
        </Canvas>
    );
}

export default LandingBackground;
