import React, { useState } from "react";
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from '../Dropdown/dropdown';
import SparqlQuery from '../SparqlQuery/sparqlQuery';
import ResultTrayStyles from "./resultTray.module.css";
import Search from '../Search/search';

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ varData, nodeData, edgeData, nodes, selectedNode, selectedEdge, addEdge, removeNode, removeEdge, setIsOpen }) {
    const endpoint = "http://ssb4.nt.ntnu.no:10022/sparql/";

    let shownProperties;
    let shownOptionals;
    let buttonPropertyLabel;
    let buttonOptionalLabel;
    let buttonInsideLabel;
    const [startingVar, setStartingVar] = useState(varData);
    const [resultData, setResultData] = useState();

    function getPropertyTargets(isOptional, object, label, property) {
        let textAddition = "";
        if (isOptional) textAddition = " (Optional)";
        let result = nodes.filter(generalNode => generalNode && generalNode.type === object).map(targetedNode => (<DropdownMenuItem onClick={() => { addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional) }}>
            {targetedNode.label}
        </DropdownMenuItem>))
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    if (selectedNode != null) {
        buttonPropertyLabel = "Set '" + selectedNode.type + "' properties...";
        buttonOptionalLabel = "Set '" + selectedNode.type + "' optional properties...";
        buttonInsideLabel = "Set '" + selectedNode.type + "' intrinsic properties...";
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

    // Gets all countable things
    function getCountTargets(isTotal, isMax) {
        // TODO


        
    }

    function getVarTargets() {
        // Show specific var in results
        let result = nodes.filter(generalNode => generalNode && generalNode.isVar === true).map((targetedNode) => {
            return (<DropdownMenuItem onClick={() => {
                setStartingVar({
                    [targetedNode.type]: {
                        "label": [targetedNode.label],
                        "uri_graph": [targetedNode.data]
                    }
                })
            }}>{targetedNode.label}</DropdownMenuItem>)
        });
        // Show all vars in results
        result.push(<DropdownMenuItem onClick={() => { setStartingVar(varData) }}>
            All variables
        </DropdownMenuItem>);
        // Show parameter / node counts in results
        let countMenu = (
            <span>
                <DropdownNestedMenuItem
                    label="Get min"
                    menu={getCountTargets(false, false)} />
                <DropdownNestedMenuItem
                    label="Get max"
                    menu={getCountTargets(false, true)} />
                <DropdownNestedMenuItem
                    label="Get count"
                    menu={getCountTargets(true)} />
            </span>
        );
        result.push(<DropdownNestedMenuItem label="Metrics..." menu={countMenu} />);
        return result;
    }
    let buttonVarToShowLabel;
    if (startingVar !== varData)
        if (startingVar.isCount)
            buttonVarToShowLabel = "Showing '" + startingVar[Object.keys(startingVar)[0]].type + ' of ' + Object.keys(startingVar)[0];
        else
            buttonVarToShowLabel = "'" + Object.keys(startingVar)[0] + "s' shown";
    else buttonVarToShowLabel = 'Show all variables';

    const deleteSelected = () => {
        if (selectedNode != null)
            removeNode()
        else if (selectedEdge != null)
            removeEdge()
    }

    return (
        <span className={ResultTrayStyles.container}>
            <div className={ResultTrayStyles.controlColumn}>
                <div className={ResultTrayStyles.buttonRow}>
                    <button className={ResultTrayStyles.del_button} onClick={deleteSelected}>Delete</button>
                    <Dropdown
                        trigger={<button className={ResultTrayStyles.var_button}>{buttonPropertyLabel}</button>}
                        menu={shownProperties}
                    />
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonOptionalLabel}</button>}
                    menu={shownOptionals}
                />
                <button className={ResultTrayStyles.big_button} onClick={setIsOpen}>{buttonInsideLabel}</button>
            </div>
            <div className={ResultTrayStyles.resultsColumn}>{
                <Search varData={startingVar} nodeData={resultData} isResults={true} addNode={""} />}
            </div>
            <div className={ResultTrayStyles.queryColumn}>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown
                        trigger={<button className={ResultTrayStyles.var_button}>Export as...</button>}
                    />
                    <SparqlQuery endpoint={endpoint} nodeData={nodeData} edgeData={edgeData} startingVar={startingVar} setResultData={setResultData} ></SparqlQuery>
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonVarToShowLabel}</button>}
                    menu={getVarTargets()}
                />
                <button className={ResultTrayStyles.big_button} onClick={setIsOpen}>Show SPARQL syntax</button>
            </div>
        </span >
    )
}

export default ResultTray;
