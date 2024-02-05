import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainStyles from "./main.module.css";
import LandingImage from "../components/LandingImage/landingImage";
import LandingIntroduction from "../components/LandingIntroduction/landingIntroduction";
import LandingDownloadLink from "../components/LandingDownloadLink/landingDownloadLink";
import LandingSlide from '../components/LandingSlide/landingSlide';

// Landing page for the app
function Main() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [images, setImages] = useState([]);
  const [slides, setSlides] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const importImages = async () => {
      const imageArray = [];
      for (let i = 1; i <= 9; i++) {
        const image = await import(`../resources/images/tutorial/Figure${i}.png`);
        imageArray.push(image.default);
      }
      setImages(imageArray);
    }
    importImages();
  }, []);

  useEffect(() => {
    const slideImages = [];
    for (let i = 1; i <= 7; i++) {
      const image = require(`../resources/images/tutorial/Slide${i}.png`);
      slideImages.push(image);
    }
    setSlides(slideImages);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollOffset(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScrollIndicator = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      setShowScrollIndicator(scrollOffset + windowHeight < documentHeight - 1);
    };

    window.addEventListener("scroll", handleScrollIndicator);
    handleScrollIndicator();
    return () => {
      window.removeEventListener("scroll", handleScrollIndicator);
    };
  }, [scrollOffset]);

  const handleScrollClick = () => {
    const viewportHeight = window.innerHeight;

    if (scrollOffset < viewportHeight)
      window.scrollTo({
        top: viewportHeight,
        behavior: "smooth",
      });
    else
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
  }

  let hoverTimeout = null;

  const handleMouseEnter = (item, widthPercent, heightPercent) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    setHoveredItem({ ...item, widthPercent, heightPercent });
    setIsHovering(true);
  }

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsHovering(false);
      setHoveredItem(null);
    }, 300);
  }

  const tutorialSteps = [
    'No need to know querying languages to explore the RDF.',
    'Select the first node or subject, in this case, Gene, in the variables section.',
    'Select the second node or object, in this case, Protein, in the variables section.',
    'Select the object property that relates both entities, in this case, "encodes".',
    'Select in "Nodes shown" the data we want to show in the output.',
    'Click on "Query" to launch the query.',
    'Click on "Export as" to download the data. Click on "Export query" to save the query.'
  ];

  return (
    <div className={MainStyles.pageContainer}>
      <LandingIntroduction />
      <div className={MainStyles.mainContainer}>
        <h1 className={MainStyles.mainHeader}> </h1>
        {/* Introduction Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Introduction</h2>
              <p className={MainStyles.introText}>
                INTUITION is a web application for user-friendly SPARQL query building. It analyses an accessible endpoint, BioGateway, and allows building queries graphically by representing nodes (entities) and edges (properties).
              </p>
              <span className={MainStyles.lesserText}>
                RDF knowledge graphs represent entities through uniform resource identifiers (URIs), and information through triples or statements that represent a directional relationship between two entities, similar to a sentence: {"<"}subject{">"} {"<"}predicate{">"} {"<"}object{">"}. For example: {"<"}Gene{">"} {"<"}encodes{">"} {"<"}Protein{">"}. The SPARQL query language also uses this pattern to build queries. These queries can be complex by linking multiple triples and including operations. A tutorial for building SPARQL queries in BioGateway (BGW) is available in this repository (https://github.com/juan-mulero/cisreg).
              </span>
            </div>
          </div>
        </div>
        {/* Design Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Design</h2>
              <span className={MainStyles.introText}>
                The INTUITION interface is composed of the following sections:
              </span>
              <div className={MainStyles.designSection}>
                <div className={MainStyles.imageWrapper}>
                  {images[0] && <LandingImage imageSrc={images[0]} maintainAspectRatio={true} alt="Figure 1" />}
                  <div
                    className={`${MainStyles.hoverSquare} ${isHovering ? MainStyles.isHovering : ''}`}
                    style={{
                      top: hoveredItem?.top,
                      left: hoveredItem?.left,
                      width: hoveredItem?.widthPercent,
                      height: hoveredItem?.heightPercent,
                      border: `${hoveredItem ? `4px solid ${hoveredItem?.color}` : 'none'}`,
                    }}
                  />
                </div>
                <ul className={MainStyles.linkList}>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '8%', left: '26%', color: '#ff6347' }, '54.2%', '60%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem1}>
                      Query building canvas
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '8%', left: '0%', color: '#4682b4' }, '25.5%', '48%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem2}>
                      Entity browser (Currently deactivated)
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '7.8%', left: '80%', color: '#32cd32' }, '20%', '61%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem3}>
                      Union builder
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '55.8%', left: '0%', color: '#ffa500' }, '25.5%', '43%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem4}>
                      Variable browser (Types of registered entities)
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '69%', left: '26%', size: '50px', color: '#6a5acd' }, '18.8%', '29%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem5}>
                      Properties selectors
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '69%', left: '45%', size: '50px', color: '#ff1493' }, '35.5%', '29%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem6}>
                      Output display
                    </span>
                  </li>
                  <li className={MainStyles.linkListItem}
                    onMouseEnter={() => handleMouseEnter({ top: '69%', left: '81%', size: '50px', color: '#00ced1' }, '18.8%', '29%')}
                    onMouseLeave={() => handleMouseLeave(null)}>
                    <span className={MainStyles.linkItem7}>
                      Query builder
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* How to Build a Query Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Query building made easy</h2>
              <LandingSlide images={slides} steps={tutorialSteps} />
            </div>
          </div>
        </div>
        {/* Filters and Other Clauses Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Filters and Other Clauses</h2>
              <span className={MainStyles.introText}>
                INTUITION offers various clauses like DISTINCT, COUNT, VALUES, and filters to refine your queries. You can easily apply these clauses and filters through the interface to achieve more precise results.
                {images[4] && <LandingImage imageSrc={images[4]} maintainAspectRatio={true} alt="Figure 5" />}
                {images[5] && <LandingImage imageSrc={images[5]} maintainAspectRatio={true} alt="Figure 6" />}
                {images[6] && <LandingImage imageSrc={images[6]} maintainAspectRatio={true} alt="Figure 7" />}
              </span>
            </div>
          </div>
        </div>
        {/* Additional Features Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Creating and Filtering Variables</h2>
              <span className={MainStyles.introText}>
                INTUITION supports the generation and filtering of new variables. This functionality is implemented in "Nodes shown" {">"} "Bindings" button. For example, by subtracting the end and start positions of the CRMs we obtain the length of the sequences in a new variable. Then, we can filter this new variable in the “Filters set” button.
                {images[7] && <LandingImage imageSrc={images[7]} maintainAspectRatio={true} alt="Figure 8" />}
              </span>
            </div>
          </div>
        </div>
        {/* UNION Clause Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>UNION Clause</h2>
              <span className={MainStyles.introText}>
                INTUITION also allows the use of the UNION clause of SPARQL. UNION merges subqueries through common variables in both queries. We illustrate its use through a use case. For example, we retrieve the OMIM entities that contain the string "breast cancer" as a name or synonym. To do that, follow the steps outlined in the tutorial.
                {images[8] && <LandingImage imageSrc={images[8]} maintainAspectRatio={true} alt="Figure 9" />}
              </span>
            </div>
          </div>
        </div>
        {/* Use Cases Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <h2>Use Cases</h2>
              <span className={MainStyles.introText}>
                The following Use Cases were developed in the paper "Analysis of the landscape of human enhancer sequences in biological databases". The corresponding queries are attached for reproducibility and as examples of use.
                <ul className={MainStyles.linkList}>
                  <li className={MainStyles.linkListItem}>
                    Use case 1: <LandingDownloadLink fileName="UC1.zip" label="Download UC1" /></li>
                  <li className={MainStyles.linkListItem}>
                    Use case 2: <LandingDownloadLink fileName="UC2.zip" label="Download UC2" /></li>
                  <li className={MainStyles.linkListItem}>
                    Use case 3: <LandingDownloadLink fileName="UC3.zip" label="Download UC3" /></li>
                </ul>
              </span>
            </div>
          </div>
        </div>
        {/* Get Started Button */}
        <div className={MainStyles.buttonContainer}>
          <Link to={"/queries"}>
            <button className={MainStyles.big_button}>Get Started</button>
          </Link>
        </div>
        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className={MainStyles.scrollIndicator} onClick={handleScrollClick}>
            <div className={MainStyles.arrow} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
