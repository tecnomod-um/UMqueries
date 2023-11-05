import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "../Dropdown/dropdown";
import { QueryToFile, FileToQuery } from "../QueryExporter/queryExporter.js";
import { getCategory } from "../../utils/typeChecker.js";
import QueryButton from "../QueryButton/queryButton";
import ResultExporter from "../ResultExporter/resultExporter";
import ValuesItem from "../ValuesItem/valuesItem";
import ResultTrayStyles from "./resultTray.module.css";
import SearchResults from "../SearchResults/searchResults";
import TrashIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ activeGraphId, graphs, allNodes, edgeData, insideData, bindings, selectedNode, selectedEdge, addUnion, addNode, addEdge, removeNode, removeEdge, setDataOpen, setBindingsOpen, loadQueryFile, getGraphData }) {
    // Data structures used through the app
    const [startingVar, setStartingVar] = useState({});
    const [resultData, setResultData] = useState();
    const [uriList, setUriList] = useState([]);
    const inputRefs = useRef({});
    // Current elements being displayed
    const activeGraph = graphs.find(graph => graph.id === activeGraphId);
    // Defined menus and labels
    let shownProperties;
    let shownOptionals;
    let buttonPropertyLabel;
    let buttonOptionalLabel;
    let buttonInsideLabel;
    let buttonVarToShowLabel;

    // Creates both property dropdown menus
    const createGroupedMenuItems = (edges, isOptional) => {
        const edgeGroups = edges?.reduce((acc, edge) => {
            acc[edge.fromInstance ? 'fromInstance' : 'notFromInstance'].push(
                <DropdownNestedMenuItem
                    label={edge.label}
                    menu={getPropertyTargets(isOptional, edge.object, edge.label, edge.property, edge.fromInstance)}
                />
            );
            return acc;
        }, { fromInstance: [], notFromInstance: [] });
        const separator = edgeGroups?.fromInstance.length && edgeGroups?.notFromInstance.length ? (
            <div className={ResultTrayStyles.dropdownSeparator} />
        ) : null;
        return [...(edgeGroups?.fromInstance || []), separator, ...(edgeGroups?.notFromInstance || [])].filter(Boolean);
    }

    // Gets all nodes that could receive a property
    function getPropertyTargets(isOptional, object, label, property, isFromInstance) {
        let textAddition = "";
        if (isOptional) textAddition = " (Optional)";
        const acceptsAnyURI = object === 'http://www.w3.org/2001/XMLSchema#anyURI';
        const result = activeGraph.nodes.filter(generalNode => generalNode && (acceptsAnyURI ? generalNode.class === 'http://www.w3.org/2002/07/owl#Thing' : generalNode.type === object) && generalNode.id !== selectedNode.id)
            .map(targetedNode => (
                <DropdownMenuItem onClick={() => {
                    addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional, isFromInstance)
                }}>{targetedNode.label} </DropdownMenuItem>))

        if (!inputRefs.current[label]) {
            inputRefs.current[label] = React.createRef();
        }
        result.unshift(
            <ValuesItem inputRef={inputRefs.current[label]} uriList={uriList} selectedNode={selectedNode} label={label} property={property} isOptional={isOptional} setUriList={setUriList} addNode={addNode} addEdge={addEdge} />);
        return result.length ? result : <DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>
    }

    // Gets all graph nodes that could form a Union
    const createUnionMenuItems = () => {
        const graphNodes = activeGraph.nodes.filter(node => node.shape === 'circle' && node.id !== selectedNode.id);
        const menuItems = graphNodes.map(node => (
            <DropdownMenuItem onClick={() => addUnion(selectedNode.id, node.id)}>
                {`Union with graph '${node.label}'`}
            </DropdownMenuItem>
        ));
        return menuItems.length > 0 ? menuItems : [<DropdownMenuItem disabled={true}>No other graphs available</DropdownMenuItem>];
    }

    // Populate on node selected
    if (selectedNode) {
        if (selectedNode.shape === 'circle') {
            buttonPropertyLabel = `Define '${selectedNode.label}' union...`;
            buttonOptionalLabel = `Graph '${selectedNode.label}' currently selected`;
            buttonInsideLabel = `Graph '${selectedNode.label}' currently selected`;

            shownProperties = createUnionMenuItems();
            shownOptionals = [];
        }
        else if (selectedNode.shape === 'box') {
            buttonPropertyLabel = `Value list selected`;
            buttonOptionalLabel = `Value list selected`;
            buttonInsideLabel = `Value list selected`;
            shownProperties = [];
            shownOptionals = [];
        }
        else {
            buttonPropertyLabel = `Set '${selectedNode.type}' properties...`;
            buttonOptionalLabel = `Set '${selectedNode.type}' optional properties...`;
            buttonInsideLabel = `Set '${selectedNode.type}' data properties...`;

            const edgesForSelectedNode = edgeData[selectedNode.type];
            shownProperties = createGroupedMenuItems(edgesForSelectedNode, false);
            shownOptionals = createGroupedMenuItems(edgesForSelectedNode, true);
        }
    } else {
        buttonPropertyLabel = "No node selected";
        buttonOptionalLabel = "No node selected";
        buttonInsideLabel = "No node selected";
        shownProperties = (<span />);
        shownOptionals = (<span />);
    }

    const numVarsSelected = Object.keys(startingVar).length;
    buttonVarToShowLabel = numVarsSelected === 0 ? 'No nodes shown' : `${numVarsSelected} nodes shown`;

    const nodeContents = (node, isInstance, isClass) => {
        return {
            "isMetric": false,
            "varID": node.varID,
            "type": node.type,
            "label": node.label,
            "uri_graph": node.graph,
            "instance": isInstance,
            "class": isClass
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
            activeGraph.nodes.filter(generalNode => generalNode && generalNode.varID >= 0)
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

    // Gets all nodes that could be selected as a shown result
    function getShownTargets() {
        const selectedNodesSet = new Set(Object.keys(startingVar).map(key => parseInt(key, 10)));

        // Toggle selected state for a given node
        const toggleNodeSelection = (nodeId, nodeInfo, isInstance, isClass) => {
            setStartingVar(prevStartingVar => {
                const updatedStartingVar = { ...prevStartingVar };
                if (nodeId in updatedStartingVar) {
                    if (isInstance)
                        updatedStartingVar[nodeId].instance = !updatedStartingVar[nodeId].instance;
                    if (isClass)
                        updatedStartingVar[nodeId].class = !updatedStartingVar[nodeId].class;
                    if (!updatedStartingVar[nodeId].instance && !updatedStartingVar[nodeId].class)
                        delete updatedStartingVar[nodeId];
                } else {
                    updatedStartingVar[nodeId] = {
                        ...nodeInfo,
                        instance: isInstance,
                        class: isClass
                    };
                }
                return updatedStartingVar;
            });
        };

        function createDropdownItem(targetedNode, label, isInstance, isClass) {
            return (
                <DropdownMenuItem preventCloseOnClick={true} disableRipple={true} onClick={event => {
                    event.stopPropagation();
                    toggleNodeSelection(targetedNode.id, nodeContents(targetedNode, isInstance, isClass), isInstance, isClass);
                }}>
                    <span className={ResultTrayStyles.shownNode}>
                        {label}
                        {(selectedNodesSet.has(targetedNode.id) &&
                            ((isInstance && startingVar[targetedNode.id]?.instance) ||
                                (isClass && startingVar[targetedNode.id]?.class))) ?
                            <DeleteIcon sx={{ color: 'darkgray' }} /> :
                            <AddIcon sx={{ color: 'darkgray' }} />}
                    </span>
                </DropdownMenuItem>
            );
        }
        const result = [];
        allNodes.filter(generalNode => generalNode && (generalNode.varID >= 0 || generalNode.shape === 'box'))
            .forEach(targetedNode => {
                const baseLabel = targetedNode.shape === 'box' ? `URI values` : targetedNode.label;
                let isInstance = activeGraph.edges.some(edge => edge.isFromInstance && edge.from === targetedNode.id);
                let isClass = activeGraph.edges.some(edge => !edge.isFromInstance && edge.from === targetedNode.id) ||
                    !activeGraph.edges.some(edge => edge.from === targetedNode.id);
                if (isInstance || isClass) {
                    let instanceLabel = baseLabel + (isInstance ? ' (instance)' : '');
                    let classLabel = baseLabel + (isClass ? ' (class)' : '');
                    if (isInstance)
                        result.push(createDropdownItem(targetedNode, instanceLabel, true, false));
                    if (isClass)
                        result.push(createDropdownItem(targetedNode, classLabel, false, true));
                }
            });
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
        result.push(<DropdownMenuItem onClick={event => {
            event.stopPropagation();
            setBindingsOpen(true);
        }} >Bindings...</DropdownMenuItem>);
        console.log(startingVar)
        return result;
    }

    // Load graph from file
    const onFileSelect = useCallback((importData) => {
        loadQueryFile(importData);
        if (importData.startingVar)
            setStartingVar(importData.startingVar);
    }, [loadQueryFile]);

    // Set data to export format
    const getQueryData = useCallback(() => {
        const queryData = getGraphData();
        queryData.startingVar = startingVar;
        return (queryData);
    }, [getGraphData, startingVar])

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
                    <button className={ResultTrayStyles.del_button} onClick={deleteSelected}>
                        <span className={ResultTrayStyles.deleteText}>Delete</span>
                        <TrashIcon className={ResultTrayStyles.deleteIcon} />
                    </button>
                    <Dropdown
                        trigger={<button className={ResultTrayStyles.var_button}>{buttonPropertyLabel}</button>}
                        menu={shownProperties}
                        uriList={uriList}
                    />
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonOptionalLabel}</button>}
                    menu={shownOptionals} />
                <button className={ResultTrayStyles.big_button} onClick={() => setDataOpen(true)}>{buttonInsideLabel}</button>
            </div>
            <div className={ResultTrayStyles.resultsColumn}>
                <SearchResults startingData={startingVar} resultData={resultData} />
            </div>
            <div className={ResultTrayStyles.queryColumn}>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown trigger={<button className={ResultTrayStyles.var_button}>Export as...</button>}
                        menu={
                            resultData ?
                                [<ResultExporter data={resultData} fileType="csv" />,
                                <ResultExporter data={resultData} fileType="tsv" />,
                                <ResultExporter data={resultData} fileType="txt" />,
                                <ResultExporter data={resultData} fileType="ods" />
                                ] : [<DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No results to export</DropdownMenuItem>]}
                    />
                    <QueryButton graphs={graphs} activeGraphId={activeGraphId} bindings={bindings} startingVar={startingVar} setResultData={setResultData} />
                </div>
                <Dropdown
                    trigger={<button className={ResultTrayStyles.big_button}>{buttonVarToShowLabel}</button>}
                    menu={getShownTargets()}
                />
                <div className={ResultTrayStyles.buttonRow}>
                    <QueryToFile getQueryData={getQueryData} />
                    <FileToQuery onFileSelect={onFileSelect} />
                </div>
            </div>
        </span >
    )
}

export default ResultTray;
