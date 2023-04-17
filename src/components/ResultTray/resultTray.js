import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from '../Dropdown/dropdown';
import ResultTrayStyles from "./resultTray.module.css";

function ResultTray({ nodes, addEdge, selectedNode, edgeData }) {

    var buttonPropertyLabel;
    var buttonOptionalLabel;
    var shownProperties;
    var shownOptionals;
    function getTargets(isOptional, object, label, property) {
        var textAddition = "";
        if (isOptional) textAddition = " (Optional)";
        var result = nodes.filter(generalNode => generalNode.type === object).map(targetedNode => (<DropdownMenuItem onClick={() => { addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional) }}>
            {targetedNode.label}
        </DropdownMenuItem>))
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    if (selectedNode != null) {
        buttonPropertyLabel = "Set '" + selectedNode.type + "' properties...";
        buttonOptionalLabel = "Set '" + selectedNode.type + "' optional properties...";
        shownProperties = (edgeData[selectedNode.type].map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getTargets(false, edge.object, edge.label, edge.property)} />)
        ));
        shownOptionals = (edgeData[selectedNode.type].map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getTargets(true, edge.object, edge.label, edge.property)} />)
        ));
    } else {
        buttonPropertyLabel = "No node selected";
        buttonOptionalLabel = "No node selected";
        shownProperties = (<span />);
        shownOptionals = (<span />);
    }

    return (
        <span>
            {/*
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
                */}
            <div className={ResultTrayStyles.container_row}>
                <Dropdown
                    trigger={<button className={`${ResultTrayStyles.big_button} ${ResultTrayStyles.layer1}`}>{buttonPropertyLabel}</button>}
                    menu={shownProperties}
                />
            </div>
            <div className={ResultTrayStyles.container_row}>
                <Dropdown
                    trigger={<button className={`${ResultTrayStyles.big_button} ${ResultTrayStyles.layer2}`}>{buttonOptionalLabel}</button>}
                    menu={shownOptionals}
                />
            </div>
        </span>
    )
}

export default ResultTray;
