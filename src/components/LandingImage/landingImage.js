import React, { useEffect, useRef, useState } from "react";
import LandingImageStyles from "./landingImage.module.css";

// Image component used in the landing page
const LandingImage = ({ imageSrc, width, height }) => {
    const [animationOffset, setAnimationOffset] = useState(1);
    const imageRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const imageElement = imageRef.current;
            if (imageElement) {
                const { innerHeight } = window;
                const { top, height } = imageElement.getBoundingClientRect();
                const offset = innerHeight - top;

                if (offset > 0 && offset < innerHeight + height) {
                    setAnimationOffset(Math.min(offset / (innerHeight / 3), 1));
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={LandingImageStyles.image} style={{ opacity: animationOffset }}>
            <img ref={imageRef} src={imageSrc} alt="Sample" width={width} height={height} />
        </div>
    );
};

export default React.memo(LandingImage);
