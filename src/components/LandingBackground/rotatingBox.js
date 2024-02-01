import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const RotatingBox = () => {
    const mesh = useRef();

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <Box ref={mesh} args={[2, 2, 2]}>
            <meshStandardMaterial attach="material" color="royalblue" />
        </Box>
    );
};

export default RotatingBox;
