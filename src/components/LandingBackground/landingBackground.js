import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './scene';

const LandingBackground = () => {
    const [contextLost, setContextLost] = useState(false);
    const [webGLSupported, setWebGLSupported] = useState(true);

    useEffect(() => {
        const canvasElem = document.createElement('canvas');
        const gl = canvasElem.getContext('webgl') || canvasElem.getContext('experimental-webgl');
        
        if (!gl) {
            setWebGLSupported(false);
            console.log('WebGL is not supported by your browser or device.');
            return;
        }

        if (!gl.getExtension('WEBGL_lose_context')) {
            console.log('WEBGL_lose_context extension not supported. Fallback handling will be used.');
        }

        const handleContextLost = (event) => {
            event.preventDefault();
            setContextLost(true);
            console.log("WebGL context lost. Please refresh the page or try with a different browser/device.");
        };

        const handleContextRestored = () => {
            setContextLost(false);
            console.log("WebGL context restored. Reinitializing component...");
        };

        document.addEventListener('webglcontextlost', handleContextLost);
        document.addEventListener('webglcontextrestored', handleContextRestored);

        return () => {
            document.removeEventListener('webglcontextlost', handleContextLost);
            document.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, []);

    if (!webGLSupported) {
        return <div>Your browser or device does not support WebGL. Please try with a different browser or device.</div>;
    }

    return (
        contextLost ?
            <div>WebGL context lost. Please refresh the page or try with a different browser/device.</div> :
            <Canvas style={{ position: 'absolute', top: 0, left: 0, height: '100vh', zIndex: -1 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Scene />
            </Canvas>
    );
}

export default LandingBackground;
