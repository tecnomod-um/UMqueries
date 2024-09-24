import React, { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './landingSlide.module.css';

const LandingSlide = ({ images, steps }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const changeSlide = (index) => {
        setCurrentStep(index);
    }

    const nextSlide = () => {
        setCurrentStep((current) => (current + 1) % images.length);
    }

    const prevSlide = () => {
        setCurrentStep((current) => (current - 1 + images.length) % images.length);
    }

    const iconStyle = { fontSize: '4rem' }

    return (
        <div className={styles.slideContainer}>
            <div className={styles.imageContainer}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className={`${styles.slideImage} ${index === currentStep ? styles.active : ''}`}
                    />
                ))}
                <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
                    <ChevronLeftIcon style={iconStyle} />
                </button>
                <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
                    <ChevronRightIcon style={iconStyle} />
                </button>
            </div>
            <div className={styles.slideTextContainer}>
                <p className={styles.slideText}>{steps[currentStep]}</p>
            </div>
            <div className={styles.controls}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.controlButton} ${index === currentStep ? styles.activeControl : ''}`}
                        onClick={() => changeSlide(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default LandingSlide;
