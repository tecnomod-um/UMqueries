import React, { useState } from "react";
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from '../Dropdown/dropdown';
import SparqlQuery from '../SparqlQuery/sparqlQuery';
import ResultTrayStyles from "./resultTray.module.css";
import Search from '../Search/search';

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ edgeData, nodes, selectedNode, queryResult, addEdge, setIsOpen, setQueryResult }) {

    // temp testing data
    var sparqlQuery = "SELECT * WHERE {<http://rdf.biogateway.eu/crm/9606/CRMHS00000003515> <http://purl.obolibrary.org/obo/RO_0002428> ?gene}";
    var url = "http://ssb4.nt.ntnu.no:10022/sparql/";

    var buttonPropertyLabel;
    var buttonOptionalLabel;
    var buttonInsideLabel;
    var shownProperties;
    var shownOptionals;
    function getPropertyTargets(isOptional, object, label, property) {
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
        buttonInsideLabel = "Set '" + selectedNode.type + "' inside properties...";
        shownProperties = (edgeData[selectedNode.type].map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getPropertyTargets(false, edge.object, edge.label, edge.property)} />)
        ));
        shownOptionals = (edgeData[selectedNode.type].map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getPropertyTargets(true, edge.object, edge.label, edge.property)} />)
        ));
    } else {
        buttonPropertyLabel = "No node selected";
        buttonOptionalLabel = "No node selected";
        buttonInsideLabel = "No node selected";
        shownProperties = (<span />);
        shownOptionals = (<span />);
    }

    const [startingVar, setStartingVar] = useState();
    var buttonVarToShowLabel;
    function getVarTargets() {
        var result = nodes.filter(generalNode => generalNode.isVar === true).map(targetedNode => (<DropdownMenuItem onClick={() => { setStartingVar(targetedNode) }}>
            {targetedNode.label}
        </DropdownMenuItem>))
        result.push(<DropdownMenuItem onClick={() => { setStartingVar(null) }}>
            All variables
        </DropdownMenuItem>);
        return result;
    }
    var shownVars = getVarTargets();
    if (startingVar != null)
        buttonVarToShowLabel = "'" + startingVar.label + "s' shown";
    else buttonVarToShowLabel = 'Show all variables';

    return (
        <span className={ResultTrayStyles.container}>
            <div className={ResultTrayStyles.controlColumn}>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonPropertyLabel}</button>}
                    menu={shownProperties}
                />
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonOptionalLabel}</button>}
                    menu={shownOptionals}
                />
                <button className={ResultTrayStyles.big_button} onClick={setIsOpen}>{buttonInsideLabel}</button>
            </div>
            <div className={ResultTrayStyles.resultsColumn}>{<Search varData={""} nodeData={""} colorList={""} height="20vh" addNode={""} />}</div>
            <div className={ResultTrayStyles.queryColumn}>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown
                        trigger={<button className={ResultTrayStyles.var_button}>{buttonVarToShowLabel}</button>}
                        menu={shownVars}
                    />
                    <SparqlQuery url={url} sparqlQuery={sparqlQuery} queryResult={queryResult} setQueryResult={setQueryResult}></SparqlQuery>
                </div>
            </div>
        </span >
    )
}

export default ResultTray;
