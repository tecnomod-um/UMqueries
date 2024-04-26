import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import MainStyles from "./main.module.css";
import LandingImage from "../components/LandingImage/landingImage";
import LandingIntroduction from "../components/LandingIntroduction/landingIntroduction";
import LandingSlide from '../components/LandingSlide/landingSlide';
import UsecaseButton from "../components/UsecaseButton/usecaseButton";
import { QueryContext } from '../contexts/queryContext';

// Landing page for the app
function Main() {
    const [scrollOffset, setScrollOffset] = useState(0);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [images, setImages] = useState([]);
    const [slides, setSlides] = useState([]);
    const [isHovering, setIsHovering] = useState(false);

    const { resetQueryData } = useContext(QueryContext);

    // Reset the context data when the component mounts
    useEffect(() => {
        resetQueryData();
    }, [resetQueryData]);

    useEffect(() => {
        const importImages = async () => {
            const imageArray = [];
            for (let i = 1; i <= 11; i++) {
                if (i === 6) {
                    const geneImage = await import(`../resources/images/tutorial/geneProps.png`);
                    imageArray.push(geneImage.default);
                } else if (i === 7) {
                    const protImage = await import(`../resources/images/tutorial/protProps.png`);
                    imageArray.push(protImage.default);
                } else {
                    const image = await import(`../resources/images/tutorial/Figure${i}.png`);
                    imageArray.push(image.default);
                }
            }
            setImages(imageArray);
        }
        importImages();
    }, []);

    useEffect(() => {
        const slideImages = [];
        for (let i = 1; i <= 6; i++) {
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
        'Select the first entity (subject node), in this case, "Gene", in the "Variable browser".',
        'Select the type of relation you want to use, in this case "encodes", in the "Pattern designer".',
        'Select the second entity (object node), in this case, "Protein"',
        'Select in "Select output" the data you want to show in the output (click on "+").',
        'Click on "Query" to launch the query.',
        'Click on "Export results" to download the data. Click on "Export query" to save the query.'
    ];

    const useCases = [
        { id: "UC1", files: ["1.json", "2.json", "3.1.json", "3.2.json", "3.3.json", "4.1.json", "4.2.json", "5.1.json", "5.2.json", "5.3.json"] },
        { id: "UC2", files: ["1.json", "2.json", "3.1.json", "3.2.json", "4.1.json", "4.2.json", "5.json"] },
        { id: "UC3", files: ["1.json"] },
    ];

    function OverlappingImages({ images }) {
        return (
            <div className={MainStyles.overlappingImagesContainer}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        className={`${MainStyles.overlappingImage} ${MainStyles[`image${index + 1}`]}`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={MainStyles.pageContainer}>
            <LandingIntroduction />
            <div className={MainStyles.mainContainer}>
                <h1 className={MainStyles.mainHeader}> </h1>
                {/* Introduction Section */}
                <div className={MainStyles.contentContainer}>
                    <div className={MainStyles.textImageContainer}>
                        <div className={MainStyles.textContainer}>
                            <h2 className={MainStyles.centeredHeading}>Introduction</h2>
                            <p className={MainStyles.introText}>
                                INTUITION is a web application for user-friendly query building. It lanches these queries against the knowledge graph network of an accessible endpoint, BioGateway, and allows building biological queries graphically by defining search patterns: biological entities (nodes) that can be specified in detail through variables and are related through properties (edges).
                            </p>
                            <span className={MainStyles.lesserText}>
                                In a graph, nodes represent different types of biological entities, such as genes, proteins or CRMs, and edges (or properties) are used to specify different types of relations that exist between two nodes (for example, {"<"}Gene{">"} {"<"}encoding{">"} {"<"}Protein{">"}).Some properties are also used to add attributes to entities. This tutorial covers the most basic aspects of building queries in INTUITION. A more advanced tutorial is also available <a href="https://github.com/juan-mulero/cisreg/blob/main/INTUITION_Tutorial.pdf" target="_blank" rel="noopener noreferrer">here</a>.
                            </span>
                        </div>
                    </div>
                </div>
                {/* Design Section */}
                <div className={MainStyles.contentContainer}>
                    <div className={MainStyles.textImageContainer}>
                        <div className={MainStyles.textContainer}>
                            <h2 className={MainStyles.centeredHeading}>Design</h2>
                            <span className={MainStyles.introText}>
                                The INTUITION interface is composed of the following sections:
                            </span>
                            <div className={MainStyles.designSection}>
                                <div className={MainStyles.imageWrapper}>
                                    {images[0] && <LandingImage imageSrc={images[0]} maintainAspectRatio={true} alt="Figure 1" addDarkBorder={true} />}
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
                                        onMouseEnter={() => handleMouseEnter({ top: '7.8%', left: '80%', color: '#32cd32' }, '20%', '61%')}
                                        onMouseLeave={() => handleMouseLeave(null)}>
                                        <span className={MainStyles.linkItem3}>
                                            Union builder
                                        </span>
                                    </li>
                                    <li className={MainStyles.linkListItem}
                                        onMouseEnter={() => handleMouseEnter({ top: '7.8%', left: '0%', color: '#ffa500' }, '25.5%', '91%')}
                                        onMouseLeave={() => handleMouseLeave(null)}>
                                        <span className={MainStyles.linkItem4}>
                                            Variable browser (Types of registered entities)
                                        </span>
                                    </li>
                                    <li className={MainStyles.linkListItem}
                                        onMouseEnter={() => handleMouseEnter({ top: '69%', left: '26%', size: '50px', color: '#6a5acd' }, '18.8%', '29%')}
                                        onMouseLeave={() => handleMouseLeave(null)}>
                                        <span className={MainStyles.linkItem5}>
                                            Pattern designer (nodes and links)
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
                                            Query runner and save
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
                            <h2 className={MainStyles.centeredHeading}>Query building made easy in 6 steps</h2>
			     <span className={MainStyles.introText}>
				The query building process involves linking entities with their attributes and/or other entities. We take as an example the previous case, the query: Which proteins do the different genes encode? ({"<"}Gene{">"} {"<"}encodes{">"} {"<"}Protein{">"}).
                            </span>
                            <LandingSlide images={slides} steps={tutorialSteps} />
                        </div>
                    </div>
                </div>
                {/* Filters and Other Clauses Section */}
                <div className={MainStyles.contentContainer}>
                    <div className={MainStyles.textImageContainer}>
                        <div className={MainStyles.textContainer}>
                            <h2 className={MainStyles.centeredHeading}>Data filtering and other possible operations</h2>
                            <span className={MainStyles.introText}>
                                Linking two biological entities (or variables) by their relation (properties) is the simplest way to create a search pattern. A search pattern selects the desired information from the knowledge network. That is, an information filter is applied. However, any biological entity can also be selected by its characteristics or attributes. For example, genes can be selected by their names.
                            </span>
                        </div>
                        <OverlappingImages images={[{ src: images[5], alt: "Figure 6" }, { src: images[6], alt: "Figure 7" }]} />
                    </div>
                    <span className={MainStyles.introText}>
                        By defining the desired characteristics of biological entities (by clicking on "set attibutes") we can select entities based on these characteristics (attributes). If the character is defined as "string" composed of letters and/or numbers we can use the operator {"'='"} to find only exact strings, or the operator {"'⊆'"} to find substrings contained in a larger string. If the character is only numeric we can find results equal to, larger, or smaller than, by the use of the operators {"'='"}, {"'>'"}, {"'≥'"}, {"'<'"}, {"'≤'"}.
                    </span>
                    <span className={MainStyles.introText}>
                        To avoid creating repetitive queries when the structure of the query is the same, but the characteristics of the entities are different, INTUITION allows you to assign different values to the variables. For example, if we are interested in searching for cis-regulatory modules (CRM) identified in two or more tissues of interest, we do not need to repeat the same query for each tissue. As shown in the example, we can specify the different tissues in the "Enter URI values" cell, in the "Pattern designer". As BioGateway uses semantic resources to identify entities, the values entered must be Uniform Resource Identifiers (URIs) corresponding to these resources. Detailed information about the vocabularies used can be found in the <a href="https://github.com/juan-mulero/cisreg/blob/f4abace5e36f579882a35ef74615b58fc3a15f36/INTUITION_Tutorial.pdf" target="_blank" rel="noopener noreferrer">advanced tutotial</a>.
                    </span>
                    <LandingImage imageSrc={require('../resources/images/tutorial/NewValues.png')} maintainAspectRatio={true} alt="Values" addDarkBorder={true} />
                    <br />
                    <br />
                    <span className={MainStyles.introText}>
                        The output table shows the biological entities that meet the biological selection criteria. Since a user can design complex query patterns and has the freedom to choose which entities they want to include in the output ("Select output" button), duplicate entities might appear in the result can include duplicate entities. For this reason, the "Distinct" button is activated for automatic filtering. On the other hand, activating the "Count" button shows the number of entities of the query in the results table, instead of each individual entity.
                    </span>

                    {images[4] && <LandingImage imageSrc={images[4]} maintainAspectRatio={true} alt="Figure 5" addDarkBorder={true} />}
                    <div className={MainStyles.imageContainer}>
                        <div className={MainStyles.textContainer}>
                            <span className={MainStyles.introText}>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Features Section */}
                <div className={MainStyles.contentContainer}>
                    <div className={MainStyles.textImageContainer}>
                        <div className={MainStyles.textContainer}>
                            <h2 className={MainStyles.centeredHeading}>Creating and Filtering Variables</h2>
                            <span className={MainStyles.introText}>
                                INTUITION allow a user to create their own selection variables. This functionality is implemented in "Set bindings" button, in the "Pattern designer. For example, by subtracting the end and start positions of the CRMs we obtain the length of the sequences in a new variable. Then, we can filter this new variable in the “Set filters” button. Below we illustrate an example:
                                {images[7] && <LandingImage imageSrc={images[7]} maintainAspectRatio={true} alt="Figure 8" addDarkBorder={true} />}
                                {images[8] && <LandingImage imageSrc={images[8]} maintainAspectRatio={true} alt="Figure 9" addDarkBorder={true} />}
                                {images[9] && <LandingImage imageSrc={images[9]} maintainAspectRatio={true} alt="Figure 10" addDarkBorder={true} />}
                            </span>
                        </div>
                    </div>
                </div>
                {/* UNION Clause Section */}
                <div className={MainStyles.contentContainer}>
                    <h2 className={MainStyles.centeredHeading}>Union of queries</h2>
                    <span className={MainStyles.introText}>
                        INTUITION also allows a user to construct a new query from queries that address related biological aspects, by merging them. We illustrate this through a use case. For example, we want to retrieve the OMIM entities that contain the string "breast cancer" as a name or synonym. To do that, the steps outlined below need to be followed:
                    </span>
                    <div className={MainStyles.textImageContainerUnion}>
                        <div className={MainStyles.imageContainerUnion}>
                            {images[10] && <LandingImage imageSrc={images[10]} maintainAspectRatio={true} alt="Figure 11" />}
                        </div>
                        <div className={MainStyles.textContainerUnion}>
                            <ol className={MainStyles.unionSteps}>
                                <li>We first create a new graph for each UNION block and add the relevant elements, in our case, OMIM.</li>
                                <li>We then configure the OMIM element in the first graph to display a property as it's 'label'.</li>
                                <li>We then do the same but for the OMIM in the other graph selecting a different property.</li>
                                <li>In the first graph we add each of the created blocks as a node...</li>
                                <li>...And join them together using the special property 'UNION'.</li>
                                <li>From this point, we can use the configured 'label' to define filters.</li>
                                <li>Selecting OMIM as an output yields the expected results.</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className={MainStyles.contentContainer}>
                    <h2 className={MainStyles.centeredHeading}>Variables</h2>
                    <table className={MainStyles.variablesTable}>
                        <tbody>
                            <tr><td>CRM variable</td><td>cis regulatory module (currently only enhancer sequences).</td></tr>
                            <tr><td>Gene variable</td><td>genes.</td></tr>
                            <tr><td>Protein variable</td><td>proteins.</td></tr>
                            <tr><td>OMIM variable</td><td>entities from OMIM ontology (mainly phenotypes).</td></tr>
                            <tr><td>Molecular_interaction</td><td>entities from Molecular Interactions ontology (MI).</td></tr>
                            <tr><td>crm2gene variable</td><td>relation between CRM and gene.</td></tr>
                            <tr><td>gene2phen variable</td><td>relation between gene and phenotype.</td></tr>
                            <tr><td>crm2phen variable</td><td>relation between CRM and phenotype.</td></tr>
                            <tr><td>crm2tfac variable</td><td>relation between CRM and protein (transcription factor).</td></tr>
                            <tr><td>Transcription factor variable</td><td>transcription factors (currently only proteins that interact with CRM).</td></tr>
                            <tr><td>reg2targ variable</td><td>regulatory relation between proteins.</td></tr>
                            <tr><td>prot2prot</td><td>molecular interaction relation between proteins.</td></tr>
                            <tr><td>tfac2gene variable</td><td>relation between gene and protein.</td></tr>
                            <tr><td>Database variable</td><td>databases.</td></tr>
                            <tr><td>Chromosome variable</td><td>chromosomes.</td></tr>
                            <tr><td>Reference_genome variable</td><td>genome assembly.</td></tr>
                            <tr><td>TAD variable</td><td>topologically associated domain.</td></tr>
                            <tr><td>Cellular_component variable</td><td>cellular components from Gene Ontology (GO).</td></tr>
                            <tr><td>prot2cc variable</td><td>relation between protein and its cellular components.</td></tr>
                            <tr><td>Molecular_function variable</td><td>molecular functions from GO.</td></tr>
                            <tr><td>prot2mf</td><td>relation between protein and its molecular functions.</td></tr>
                            <tr><td>Biological_process variable</td><td>biological processes from GO.</td></tr>
                            <tr><td>prot2bp variable</td><td>relation between protein and its biological processes.</td></tr>
                            <tr><td>Ortho variable</td><td>orthology relation between proteins.</td></tr>
                            <tr><td>Root variable</td><td>top hierarchically class of NCBITaxon Ontology.</td></tr>
                            <tr><td>Taxonomic_rank variable</td><td>top hierarchically class of NCBITaxon Ontology.</td></tr>
                        </tbody>
                    </table>
                    <p className={MainStyles.lesserText}>
                        The properties are detailed with examples and their domains <a href="https://github.com/juan-mulero/cisreg/blob/9b725286d1b4941b0a4d5abcf6c30172daffb74c/BGW_graphs.xlsx" target="_blank" rel="noopener noreferrer">here</a>.
                    </p>
                </div>
                {/* Use Cases Section */}
                <div className={MainStyles.contentContainer}>
                    <h2 className={MainStyles.centeredHeading}>Use Cases</h2>
                    <span className={MainStyles.introText}>
                        The following Use Cases were developed in the paper "Analysis of the landscape of human enhancer sequences in biological databases". The corresponding queries are attached for reproducibility and as examples of use. We recommend their consultation for a deeper understanding of the concepts introduced. Some more examples can be found <a href="https://github.com/juan-mulero/cisreg/blob/107278c55e9024dda16f8fb9e6d69e690613ba1a/INTUITION_Tutorial.pdf" target="_blank" rel="noopener noreferrer">here</a>.
                    </span>
                    <div className={MainStyles.useCaseButtons}>
                        {useCases.map(useCase => (
                            <div key={useCase.id} className={MainStyles.useCaseSection}>
                                <a href={`${process.env.PUBLIC_URL}/useCases/${useCase.id}.zip`} className={MainStyles.downloadLink} download>
                                    {`Download Use Case ${useCase.id}`}
                                </a>
                                <div className={MainStyles.useCaseButtonContainer}>
                                    {useCase.files.map(file => (
                                        <UsecaseButton key={file} fileName={`${useCase.id}/${file}`} />
                                    ))}
                                </div>
                            </div>
                        ))}
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
