import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainStyles from "./main.module.css";
import LandingImage from "../components/LandingImage/landingImage";

import image from "../resources/images/image.jpg";

// Brief introduction to the tool
function Main() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScrollIndicator = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setShowScrollIndicator(scrollOffset < documentHeight - windowHeight);
    };

    window.addEventListener("scroll", handleScrollIndicator);
    handleScrollIndicator();

    return () => {
      window.removeEventListener("scroll", handleScrollIndicator);
    };
  }, [scrollOffset]);

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={MainStyles.pageContainer}>
      <div className={MainStyles.mainContainer}>
        <h1 className={MainStyles.mainHeader}>UM queries</h1>
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac justo rhoncus, aliquam magna eu,
                pulvinar nisi. Suspendisse sit amet sagittis dolor, sed fringilla dui. In sit amet eros et ligula
                placerat vestibulum. Curabitur lobortis consectetur ipsum, eget tincidunt tellus ultricies a.
              </p>
            </div>
            <div className={MainStyles.imageWrapper}>
              <LandingImage imageSrc={image} width={500} height={350} />
            </div>
          </div>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.imageWrapper}>
              <LandingImage imageSrc={image} width={500} height={350} />
            </div>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac justo rhoncus, aliquam magna eu,
                pulvinar nisi. Suspendisse sit amet sagittis dolor, sed fringilla dui. In sit amet eros et ligula
                placerat vestibulum. Curabitur lobortis consectetur ipsum, eget tincidunt tellus ultricies a.
              </p>
            </div>
          </div>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac justo rhoncus, aliquam magna eu,
                pulvinar nisi. Suspendisse sit amet sagittis dolor, sed fringilla dui. In sit amet eros et ligula
                placerat vestibulum. Curabitur lobortis consectetur ipsum, eget tincidunt tellus ultricies a.
              </p>
            </div>
            <div className={MainStyles.imageWrapper}>
              <LandingImage imageSrc={image} width={500} height={350} />
            </div>
          </div>
        </div>
        <div className={MainStyles.buttonContainer}>
          <Link to={"/queries"}>
            <button className={MainStyles.big_button}>Get started</button>
          </Link>
        </div>
        {showScrollIndicator && (
          <div className={MainStyles.scrollIndicator} onClick={handleScrollToBottom}>
            <div className={MainStyles.arrow} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
