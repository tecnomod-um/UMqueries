import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainStyles from "./main.module.css";
import LandingImage from "../components/LandingImage/landingImage";
import LandingIntroduction from "../components/LandingIntroduction/landingIntroduction";
import LandingDownloadLink from "../components/LandingDownloadLink/landingDownloadLink";
import image from "../resources/images/image.jpg";

// Landing page for the app
function Main() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [images, setImages] = useState([]);

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


  return (
    <div className={MainStyles.pageContainer}>
      <LandingIntroduction />
      <div className={MainStyles.mainContainer}>
        <h1 className={MainStyles.mainHeader}>Using INTUITION</h1>

        {/* Introduction Section */}
        <div className={MainStyles.contentContainer}>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                INTUITION is a web application for user-friendly SPARQL query building, enabling users to exploit RDF knowledge graphs without advanced knowledge in SPARQL query language. It analyses the knowledge network of an accessible endpoint, BioGateway, and allows building queries graphically by representing nodes (entities) and edges (properties).
              </p>
              <p className={MainStyles.introText}>
                RDF knowledge graphs represent entities through uniform resource identifiers (URIs), and information through triples or statements that represent a directional relationship between two entities, similar to a sentence: {"<"}subject{">"} {"<"}predicate{">"} {"<"}object{">"}. For example: {"<"}Gene{">"} {"<"}encodes{">"} {"<"}Protein{">"}. The SPARQL query language also uses this pattern to build queries. These queries can be complex by linking multiple triples and including operations. A tutorial for building SPARQL queries in BioGateway (BGW) is available in this repository.
              </p>
              {images[0] && <LandingImage imageSrc={images[0]} width={500} height={350} alt="Figure 1" />}
            </div>
          </div>
        </div>

        {/* Design Section */}
        <div className={MainStyles.contentContainer}>
          <h2>Design</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                In INTUITION, we distinguish different sections:
                <ul>
                  <li>Query building screen.</li>
                  <li>Entity browser (Currently deactivated).</li>
                  <li>Graph builder (Used for queries that use union clauses).</li>
                  <li>Variable selection (Main types of entities in the network).</li>
                  <li>Properties selection.</li>
                </ul>
                Each section plays a vital role in building and executing SPARQL queries effectively.
              </p>
              {images[1] && <LandingImage imageSrc={images[1]} width={500} height={350} alt="Figure 2" />}
            </div>
          </div>
        </div>

        {/* How to Build a Query Section */}
        <div className={MainStyles.contentContainer}>
          <h2>How to Build a Query</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                We take as an example the previous case: {"<"}Gene{">"} {"<"}encodes{">"} {"<"}Protein{">"}.
                <ol>
                  <li>Select the first node or subject, in this case, Gene, in the variables section.</li>
                  <li>Select the second node or object, in this case, Protein, in the variables section.</li>
                  <li>Select the object property that relates both entities, in this case, "encodes".</li>
                  <li>Select in "Nodes shown" the data we want to show in the output, in this case, Gene and Protein.</li>
                  <li>Click on "Query" to launch the query.</li>
                  <li>Click on "Export as" to download the data obtained. Click on "Export query" if you want to save the query as well.</li>
                </ol>
              </p>
              {images[2] && <LandingImage imageSrc={images[2]} width={500} height={350} alt="Figure 3" />}
              {images[3] && <LandingImage imageSrc={images[3]} width={500} height={350} alt="Figure 4" />}
            </div>
          </div>
        </div>

        {/* Filters and Other Clauses Section */}
        <div className={MainStyles.contentContainer}>
          <h2>Filters and Other Clauses</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                INTUITION offers various clauses like DISTINCT, COUNT, VALUES, and filters to refine your queries. You can easily apply these clauses and filters through the interface to achieve more precise results.
              </p>
              {images[4] && <LandingImage imageSrc={images[4]} width={500} height={350} alt="Figure 5" />}
              {images[5] && <LandingImage imageSrc={images[5]} width={500} height={350} alt="Figure 6" />}
              {images[6] && <LandingImage imageSrc={images[6]} width={500} height={350} alt="Figure 7" />}
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className={MainStyles.contentContainer}>
          <h2>Creating and Filtering Variables</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                INTUITION supports the generation and filtering of new variables. This functionality is implemented in "Nodes shown" > "Bindings" button. For example, by subtracting the end and start positions of the CRMs we obtain the length of the sequences in a new variable. Then, we can filter this new variable in the “Filters set” button.
              </p>
              {images[7] && <LandingImage imageSrc={images[7]} width={500} height={350} alt="Figure 8" />}
            </div>
          </div>
        </div>

        {/* UNION Clause Section */}
        <div className={MainStyles.contentContainer}>
          <h2>UNION Clause</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                INTUITION also allows the use of the UNION clause of SPARQL. UNION merges subqueries through common variables in both queries. We illustrate its use through a use case. For example, we retrieve the OMIM entities that contain the string "breast cancer" as a name or synonym. To do that, follow the steps outlined in the tutorial.
              </p>
              {images[8] && <LandingImage imageSrc={images[8]} width={500} height={350} alt="Figure 9" />}
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className={MainStyles.contentContainer}>
          <h2>Use Cases</h2>
          <div className={MainStyles.textImageContainer}>
            <div className={MainStyles.textContainer}>
              <p className={MainStyles.introText}>
                The following Use Cases were developed in the paper "Analysis of the landscape of human enhancer sequences in biological databases". The corresponding queries are attached for reproducibility and as examples of use.
                <ul>
                  <li>
                    Use case 1:
                    <LandingDownloadLink fileName="UC1.zip" label="Download UC1" />
                  </li>
                  <li>
                    Use case 2:
                    <LandingDownloadLink fileName="UC2.zip" label="Download UC2" />
                  </li>
                  <li>
                    Use case 3:
                    <LandingDownloadLink fileName="UC3.zip" label="Download UC3" />
                  </li>
                </ul>
              </p>
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
