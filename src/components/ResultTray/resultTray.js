import { Dropdown, DropdownMenuItem } from '../Dropdown/dropdown';
import ResultTrayStyles from "./resultTray.module.css";

function ResultTray({ addNode }) {
    var nodeType;
    const addGene = (e) => {
        e.preventDefault();
        addNode("Any Gene", "This node acts as a Gene wildcard.", "#ef4444");
    }
    const addProtein = (e) => {
        e.preventDefault();
        addNode("Any Prot", "This node acts as a Protein wildcard.", "#88C6ED");
    }
    const addCRM = (e) => {
        e.preventDefault();
        addNode("Any CRM", "This node acts as a CRM wildcard.","#82C341");
    }
    const addTAD = (e) => {
        e.preventDefault();
        addNode("Any TAD", "This node acts as a TAD wildcard.","#FAA31B");
    }
    const addOmim = (e) => {
        e.preventDefault();
        addNode("Any Omim", "This node acts as a Omim wildcard.","#FFF000");
    }
    const addGeneOntology = (e) => {
        e.preventDefault();
        addNode("Any GO", "This node acts as a Gene Ontology wildcard.","#D54799");
    }
    const addMollecullarInteraction = (e) => {
        e.preventDefault();
        addNode("Any MI", "This node acts as a Mollecullar Interaction wildcard.","#00303F");
    }
    return (
        <span>
        <div className={ResultTrayStyles.container_row}>
            <Dropdown
                keepOpen
                // eslint-disable-next-line no-restricted-globals
                open={open}
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
