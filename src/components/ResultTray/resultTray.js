import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "../Dropdown/dropdown";
import SparqlQuery from "../SparqlQuery/sparqlQuery";
import ResultTrayStyles from "./resultTray.module.css";
import Search from "../Search/search";

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ varData, nodeData, edgeData, insideData, nodes, selectedNode, selectedEdge, addEdge, removeNode, removeEdge, setIsOpen }) {
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
        let result = nodes.filter(generalNode => generalNode && generalNode.type === object).map(
            targetedNode => (
                <DropdownMenuItem onClick={() => {
                    addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional)
                }}>{targetedNode.label} </DropdownMenuItem>))
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

    // Gets all countable elements that could be queried
    function getCountTargets(isTotal, isMax) {
        let result = [];
        // TODO get nodes themselves as counts
        if (isTotal) { }
        // Detects properties marked as shown in vars
        if (!isTotal) {
            nodes.filter(generalNode => generalNode && generalNode.isVar === true).forEach((targetedNode) => {
                insideData[targetedNode.type].forEach((property) => {
                    if (targetedNode[property.label + "_queriesShow"] && !isNaN(targetedNode[property.label])) {
                        result.push(<DropdownMenuItem onClick={() => setStartingVar(
                            {
                                [targetedNode.type]: {
                                    "isMetric": true,
                                    "isMax": isMax,
                                    "label": [targetedNode.label],
                                    "property_label": property.label,
                                    "uri_graph": [targetedNode.data]
                                }
                            })

                        }>{targetedNode.label + "'s '" + property.label + "'"}</DropdownMenuItem>);
                    }
                });
            });
        }
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    function getVarTargets() {
        // Show specific var in results
        let result = nodes.filter(generalNode => generalNode && generalNode.isVar === true).map((targetedNode) => {
            return (<DropdownMenuItem onClick={() => setStartingVar(
                {
                    [targetedNode.type]: {
                        "label": [targetedNode.label],
                        "uri_graph": [targetedNode.data]
                    }
                }
            )}>{targetedNode.label}</DropdownMenuItem>)
        });
        // Show all vars in results
        result.push(<DropdownMenuItem onClick={() => { setStartingVar(varData) }}>
            All variables
        </DropdownMenuItem>);
        // Show parameter / node counts in results
        let countMenu = [
            (<DropdownNestedMenuItem
                label="Get min"
                menu={getCountTargets(false, false)} />),
            (<DropdownNestedMenuItem
                label="Get max"
                menu={getCountTargets(false, true)} />),
            (<DropdownNestedMenuItem
                label="Get count"
                menu={getCountTargets(true)} />)
        ];
        result.push(<DropdownNestedMenuItem label="Metrics..." menu={countMenu} />);
        return result;
    }
    let buttonVarToShowLabel;
    if (startingVar !== varData)
        if (startingVar[Object.keys(startingVar)[0]].isMetric) {
            let order;
            startingVar[Object.keys(startingVar)[0]].isMax ? order = "Max" : order = "Min";
            buttonVarToShowLabel = order + ' ' + startingVar[Object.keys(startingVar)[0]].property_label + " shown";
        }
        else
            buttonVarToShowLabel = "'" + Object.keys(startingVar)[0].charAt(0).toUpperCase() + Object.keys(startingVar)[0].slice(1) + "s' shown";
    else buttonVarToShowLabel = 'All variables shown';

    const deleteSelected = useCallback(() => {
        if (selectedNode != null)
            removeNode();
        else if (selectedEdge != null)
            removeEdge();
    }, [selectedNode, selectedEdge, removeNode, removeEdge]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Delete") {
                deleteSelected();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [deleteSelected]);

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
