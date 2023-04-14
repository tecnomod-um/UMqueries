import { Dropdown, DropdownMenuItem } from '../Dropdown/dropdown';
import ResultTrayStyles from "./resultTray.module.css";

function ResultTray({ geneProperties, proteinProperties, crmProperties, tadProperties, omimProperties, goProperties, miProperties, addNode }) {
    const addGene = (e) => {
        e.preventDefault();
        addNode("Any Gene", "This node acts as a Gene wildcard.", "gene");
    }
    const addProtein = (e) => {
        e.preventDefault();
        addNode("Any Prot", "This node acts as a Protein wildcard.", "protein");
    }
    const addCRM = (e) => {
        e.preventDefault();
        addNode("Any CRM", "This node acts as a CRM wildcard.", "crm");
    }
    const addTAD = (e) => {
        e.preventDefault();
        addNode("Any TAD", "This node acts as a TAD wildcard.", "tad");
    }
    const addOmim = (e) => {
        e.preventDefault();
        addNode("Any Omim", "This node acts as a Omim wildcard.", "omim");
    }
    const addGeneOntology = (e) => {
        e.preventDefault();
        addNode("Any GO", "This node acts as a Gene Ontology wildcard.", "go");
    }
    const addMollecullarInteraction = (e) => {
        e.preventDefault();
        addNode("Any MI", "This node acts as a Mollecullar Interaction wildcard.", "mi");
    }
    return (
        <span>
            <div className={ResultTrayStyles.container_row}>
                <Dropdown
                    trigger={<button className={`${ResultTrayStyles.big_button} ${ResultTrayStyles.layer1}`}>Add variable...</button>}
                    menu={[
                        <DropdownMenuItem onClick={addGene}>
                            Gene
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addProtein}>
                            Protein
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addCRM}>
                            CRM
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addTAD}>
                            TAD
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addOmim}>
                            Omim
                        </DropdownMenuItem>, <DropdownMenuItem onClick={addGeneOntology}>
                            Gene<br />
                            ontology
                        </DropdownMenuItem>, <DropdownMenuItem onClick={addMollecullarInteraction}>
                            Mollecullar<br />
                            interactions
                        </DropdownMenuItem>,
                    ]}
                />
            </div>
            <div className={ResultTrayStyles.container_row}>
                <Dropdown
                    keepOpen
                    // eslint-disable-next-line no-restricted-globals
                    open={open}
                    trigger={<button className={`${ResultTrayStyles.big_button} ${ResultTrayStyles.layer2}`}>Add properties...</button>}
                    menu={[
                        <DropdownMenuItem onClick={addGene}>
                            Gene
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addProtein}>
                            Protein
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addCRM}>
                            CRM
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addTAD}>
                            TAD
                        </DropdownMenuItem>,
                        <DropdownMenuItem onClick={addOmim}>
                            Omim
                        </DropdownMenuItem>, <DropdownMenuItem onClick={addGeneOntology}>
                            Gene<br />
                            ontology
                        </DropdownMenuItem>, <DropdownMenuItem onClick={addMollecullarInteraction}>
                            Mollecullar<br />
                            interactions
                        </DropdownMenuItem>,
                    ]}
                />
            </div>
        </span>
    )
}

export default ResultTray;
