import React from 'react';
import LandingIntroductionStyles from "./landingIntroduction.module.css";
import LandingBackground from '../LandingBackground/landingBackground';

const IntroductionSection = () => {
    return (
        <>
            <LandingBackground />
            <div className={LandingIntroductionStyles.introSection}>
                <h1 className={LandingIntroductionStyles.fadeIn}>Intuition - Explore RDFs with Ease</h1>
                <p className={LandingIntroductionStyles.fadeIn}>Intuition is your gateway to build and run queries about the biology of gene regulation in BioGateay through small graphs (subgraphs).</p>
            </div>
        </>
    );
};

export default IntroductionSection;
