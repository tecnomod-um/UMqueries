import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import RotatingBox from './rotatingBox';
import Particle from './particle';

const Scene = () => {
    const { viewport } = useThree();
    const mouse = useRef([0, 0]);
    const numParticles = 50; // Adjust the number of particles here

    const handleMouseMove = (event) => {
        mouse.current = [event.clientX / viewport.width * 2 - 1, -event.clientY / viewport.height * 2 + 1];
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [viewport]);

    return (
        <>
            {
            /*
            Array.from({ length: numParticles }, (_, i) => (
                <Particle key={i} mouse={mouse} />
            ))
            */
            }
            <group>
            <RotatingBox position={[-3, 0, 0]} rotationSpeed={0.01} size={[1.5, 1.5, 1.5]} />
            <RotatingBox position={[-1.5, 0, 0]} rotationSpeed={0.015} size={[1.75, 1.75, 1.75]} />
            <RotatingBox position={[0, 0, 0]} rotationSpeed={0.02} />
            <RotatingBox position={[1.5, 0, 0]} rotationSpeed={0.015} size={[1.75, 1.75, 1.75]} />
            <RotatingBox position={[3, 0, 0]} rotationSpeed={0.01} size={[1.5, 1.5, 1.5]} />
            </group>
        </>
    );
}

export default Scene;
