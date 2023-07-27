import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "../Dropdown/dropdown";
import { GraphToFile, FileToGraph } from "../GraphExporter/graphExporter.js";
import { capitalizeFirst } from "../../utils/stringFormatter.js";
import { getCategory } from "../../utils/typeChecker.js";
import QueryButton from "../QueryButton/queryButton";
import ResultExporter from "../ResultExporter/resultExporter";
import ValuesItem from "../ValuesItem/valuesItem";
import ResultTrayStyles from "./resultTray.module.css";
import SearchResults from "../SearchResults/searchResults";

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ edgeData, insideData, nodes, edges, selectedNode, selectedEdge, addNode, addEdge, removeNode, removeEdge, setIsOpen, loadGraph }) {

    const [startingVar, setStartingVar] = useState({});
    const [resultData, setResultData] = useState();
    const [uriList, setUriList] = useState([]);
    const inputRefs = useRef({});

    let shownProperties;
    let shownOptionals;
    let buttonPropertyLabel;
    let buttonOptionalLabel;
    let buttonInsideLabel;
    let buttonVarToShowLabel;

    // Update button labels dynamically
    if (selectedNode != null) {
        buttonPropertyLabel = `Set '${selectedNode.type}' properties...`;
        buttonOptionalLabel = `Set '${selectedNode.type}' optional properties...`;
        buttonInsideLabel = `Set '${selectedNode.type}' data properties...`;
        shownProperties = (edgeData[selectedNode.type]?.map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getPropertyTargets(false, edge.object, edge.label, edge.property)} />)
        ) ?? []);

        shownOptionals = (edgeData[selectedNode.type]?.map(edge => (
            <DropdownNestedMenuItem
                label={edge.label}
                menu={getPropertyTargets(true, edge.object, edge.label, edge.property)} />)
        ) ?? []);
    } else {
        buttonPropertyLabel = "No node selected";
        buttonOptionalLabel = "No node selected";
        buttonInsideLabel = "No node selected";
        shownProperties = (<span />);
        shownOptionals = (<span />);
    }

    const varsInGraph = nodes.filter(generalNode => generalNode && generalNode.varID >= 0).length;
    if (!Object.keys(startingVar).length) buttonVarToShowLabel = 'No nodes shown';
    else if (startingVar[Object.keys(startingVar)[0]].isMetric) {
        const operator = startingVar[Object.keys(startingVar)[0]].isMax ? 'Max ' : 'Min ';
        buttonVarToShowLabel = operator + ' ' + startingVar[Object.keys(startingVar)[0]].property_label + ' from ' + startingVar[Object.keys(startingVar)[0]].type + ' ' + startingVar[Object.keys(startingVar)[0]].varID + ' shown';
    }
    else if (Object.keys(startingVar).length !== varsInGraph) {
        let varName = startingVar[Object.keys(startingVar)[0]].type
        buttonVarToShowLabel = capitalizeFirst("" + varName) + " " + startingVar[Object.keys(startingVar)[0]].varID + " shown";
    }
    else buttonVarToShowLabel = 'All nodes shown';

    // Gets all nodes that could receive a property
    function getPropertyTargets(isOptional, object, label, property) {
        let textAddition = "";
        if (isOptional) textAddition = " (Optional)";
        const acceptsAnyURI = object === 'http://www.w3.org/2001/XMLSchema#anyURI';
        const result = nodes.filter(generalNode => generalNode && (acceptsAnyURI ? generalNode.class === 'http://www.w3.org/2002/07/owl#Thing' : generalNode.type === object) && generalNode.id !== selectedNode.id)
            .map(targetedNode => (
                <DropdownMenuItem onClick={() => {
                    addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional)
                }}>{targetedNode.label} </DropdownMenuItem>))

        if (!inputRefs.current[label]) {
            inputRefs.current[label] = React.createRef();
        }
        result.unshift(
            <ValuesItem inputRef={inputRefs.current[label]} uriList={uriList} selectedNode={selectedNode} label={label} property={property} isOptional={isOptional} setUriList={setUriList} addNode={addNode} addEdge={addEdge} />);
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    const nodeContents = (node) => {
        return {
            "isMetric": false,
            "varID": node.varID,
            "type": node.type,
            "label": node.label,
            "uri_graph": node.graph
        };
    }

    const metricContents = (node, property, isTotal, isMax) => {
        return {
            "isMetric": true,
            "isTotal": isTotal,
            "isMax": isMax,
            "property_label": property,
            "type": node.type,
            "varID": node.varID,
            "uri_graph": node.graph
        };
    }

    // Gets all countable elements that could be queried
    function getMetricTargets(isTotal, isMax) {
        let result = [];
        // TODO get nodes themselves as counts
        if (isTotal) { }
        // Detects properties marked as shown in vars
        if (!isTotal) {
            nodes.filter(generalNode => generalNode && generalNode.varID >= 0)
                .forEach(targetedNode => {
                    if (targetedNode.properties)
                        Object.entries(targetedNode.properties).forEach(([key, value]) => {
                            let show = value.show;
                            const category = getCategory(insideData[targetedNode.type].filter(entry => entry.property === value.uri)[0]?.type);
                            if (show && (category === 'number' || category === 'decimal' || category === 'datetime')) {
                                result.push(<DropdownMenuItem onClick={() =>
                                    setStartingVar({ [targetedNode.id]: metricContents(targetedNode, key, isTotal, isMax) })
                                }>{targetedNode.label + "'s '" + key + "'"}</DropdownMenuItem>);
                            }
                        });

                });
        }
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    function showAllVars() {
        const result = nodes
            .filter(generalNode => generalNode && generalNode.varID >= 0)
            .reduce((acc, targetedNode) => {
                return {
                    ...acc,
                    [targetedNode.id]: nodeContents(targetedNode)
                };
            }, {});

        setStartingVar(result);
    }

    // Get all things that could be shown in the results
    function getShownTargets() {
        // Show specific var in results
        let result = nodes.filter(generalNode => generalNode && generalNode.varID >= 0)
            .map(targetedNode => {
                return (<DropdownMenuItem onClick={() => setStartingVar({ [targetedNode.id]: nodeContents(targetedNode) })}>{targetedNode.label}</DropdownMenuItem>)
            });
        // Show all vars in results
        result.push(<DropdownMenuItem onClick={showAllVars}> All variables </DropdownMenuItem>);
        // Show parameter / node counts in results
        let countMenu = [
            (<DropdownNestedMenuItem
                label="Get min"
                menu={getMetricTargets(false, false)} />),
            (<DropdownNestedMenuItem
                label="Get max"
                menu={getMetricTargets(false, true)} />),
            (<DropdownNestedMenuItem
                label="Get count"
                menu={getMetricTargets(true)} />)
        ];
        result.push(<DropdownNestedMenuItem label="Metrics..." menu={countMenu} />);
        return result;
    }

    // Load graph from file
    const onFileSelect = useCallback((queryData) => {
        loadGraph(queryData);
        if (queryData.startingVar)
            setStartingVar(queryData.startingVar);
    }, [loadGraph]);

    // Remove nodes
    const deleteSelected = useCallback(() => {
        if (selectedNode) {
            removeNode();
            if (Object.keys(startingVar).includes(String(selectedNode.id)))
                setStartingVar({});
        }
        else if (selectedEdge)
            removeEdge();
    }, [startingVar, selectedNode, selectedEdge, removeNode, removeEdge]);

    // Remove nodes on del press
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Delete") {
                deleteSelected();
                document.activeElement.blur();
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
                        uriList={uriList}
                    />
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonOptionalLabel}</button>}
                    menu={shownOptionals} />
                <button className={ResultTrayStyles.big_button} onClick={() => setIsOpen(true)}>{buttonInsideLabel}</button>
            </div>
            <div className={ResultTrayStyles.resultsColumn}>
                <SearchResults startingData={startingVar} resultData={resultData} />
            </div>
            <div className={ResultTrayStyles.queryColumn}>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown trigger={<button className={ResultTrayStyles.var_button}>Export as...</button>}
                        menu={
                            resultData ?
                                [
                                    <ResultExporter data={resultData} fileType="csv" />,
                                    <ResultExporter data={resultData} fileType="tsv" />,
                                    <ResultExporter data={resultData} fileType="txt" />,
                                    <ResultExporter data={resultData} fileType="ods" />
                                ] : [<DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No results to export</DropdownMenuItem>]}
                    />
                    <QueryButton nodes={nodes} edges={edges} startingVar={startingVar} setResultData={setResultData} ></QueryButton>
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonVarToShowLabel}</button>}
                    menu={getShownTargets()}
                />
                <div className={ResultTrayStyles.buttonRow}>
                    <GraphToFile nodes={nodes} edges={edges} startingVar={startingVar} />
                    <FileToGraph onFileSelect={onFileSelect} />
                </div>
            </div>
        </span >
    )
}

export default ResultTray;
