import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { QueryContext } from '../../contexts/queryContext.js';
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "../Dropdown/dropdown";
import { QueryToFile, FileToQuery } from "../QueryExporter/queryExporter.js";
/*import { getCategory } from "../../utils/typeChecker.js";*/
import QueryButton from "../QueryButton/queryButton";
import ResultExporter from "../ResultExporter/resultExporter";
import ValuesItem from "../Dropdown/valuesItem";
import TooltipPopup from '../TooltipPopup/tooltipPopup';
import CreateNodeItem from "../Dropdown/createNodeItem";
import ResultTrayStyles from "./resultTray.module.css";
import SearchResults from "../SearchResults/searchResults";
import TrashIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

// Contains both control buttons to interact with the graph's nodes and a brief view of the results.
function ResultTray({ varData, activeGraphId, graphs, allNodes, edgeData, insideData, bindings, selectedNode, selectedEdge, addUnion, addNode, addEdge, removeNode, removeEdge, setDataOpen, setBindingsOpen, setFiltersOpen, loadQueryFile, getGraphData }) {

    // Data structures used through the app
    const [startingVar, setStartingVar] = useState({});
    const [resultData, setResultData] = useState();
    const [uriList, setUriList] = useState([]);
    const [isDistinct, setDistinct] = useState(true);
    const [isCount, setCount] = useState(false);
    // Tooltip structures
    const buttonRef0 = useRef(null);
    const buttonRef1 = useRef(null);
    const buttonRef2 = useRef(null);
    const buttonRef3 = useRef(null);
    const buttonRef4 = useRef(null);
    const buttonRef5 = useRef(null);
    const buttonRef6 = useRef(null);
    const buttonRef7 = useRef(null);
    const buttonRef8 = useRef(null);
    const [tooltipMessage, setTooltipMessage] = useState("Tooltip message.");
    const [isTooltipShown, setTooltipShown] = useState(false);
    const [tooltipRef, setTooltipRef] = useState(buttonRef0);
    const inputRefs = useRef({});
    // Context for preloaded use cases
    const { preloadedQuery } = useContext(QueryContext);
    // Current elements being displayed
    const activeGraph = graphs.find(graph => graph.id === activeGraphId);
    // Defined menus and labels
    let shownProperties = (<span />);
    let shownOptionals = (<span />);
    // Static labels
    const buttonPropertyLabel = "Add relations";
    const buttonOptionalLabel = "Add optional relations";
    const buttonInsideLabel = "Set attributes";
    // Dynamic labels
    let buttonVarToShowLabel;
    let buttonFilterLabel;
    let buttonBindingLabel;

    // Load graph from file
    const onFileSelect = useCallback((importData) => {
        loadQueryFile(importData);
        if (importData.startingVar)
            setStartingVar(importData.startingVar);
        if (importData.isDistinct)
            setDistinct(importData.isDistinct)
        if (importData.isCount)
            setCount(importData.isCount)
    }, [loadQueryFile]);

    // Checks and loads sample use cases
    useEffect(() => {
        if (preloadedQuery) onFileSelect(preloadedQuery);
    }, [preloadedQuery, onFileSelect]);
    // Hide the tooltip after 3 seconds
    useEffect(() => {
        let timer;
        if (isTooltipShown)
            timer = setTimeout(() => {
                setTooltipShown(false);
            }, 3000);

        return () => { if (timer) clearTimeout(timer) };
    }, [isTooltipShown]);

    const isButtonDisabled = shownOptionals.length === 0;
    // Creates both property dropdown menus
    const createGroupedMenuItems = (edges, isOptional) => {
        const edgeGroupsByLabel = edges?.reduce((acc, edge) => {
            const key = edge.fromInstance ? 'fromInstance' : 'notFromInstance';
            const label = edge.label;
            if (!acc[key][label]) {
                acc[key][label] = [];
            }
            acc[key][label].push(edge);
            return acc;
        }, { fromInstance: {}, notFromInstance: {} });
        // Same label properties will be shown as one
        const createMenuItemsForGroup = (group) => {
            return Object.entries(group).map(([label, edges]) => {
                const firstEdge = edges[0];
                const valuesItem = (
                    <ValuesItem
                        inputRef={inputRefs.current[label] || (inputRefs.current[label] = React.createRef())}
                        uriList={uriList}
                        selectedNode={selectedNode}
                        label={label}
                        property={firstEdge.property}
                        isOptional={isOptional}
                        isFromInstance={firstEdge.fromInstance}
                        setUriList={setUriList}
                        addNode={addNode}
                        addEdge={addEdge}
                        disabled={firstEdge.fromInstance && selectedNode?.classOmitted}
                    />);

                const propertyTargets = edges.map((edge, index) => getPropertyTargets(isOptional, edge.object, edge.label, edge.property, edge.fromInstance, index === 0)).flat();
                const menu = propertyTargets.length > 0 ? propertyTargets : [<DropdownMenuItem className={ResultTrayStyles.noTarget} disabled={true}>No targets available</DropdownMenuItem>];
                return (
                    <DropdownNestedMenuItem
                        label={label}
                        disableRipple={true}
                        preventCloseOnClick={true}
                        menu={[valuesItem, ...menu]}
                    />
                );
            });
        };
        const fromInstanceMenuItems = createMenuItemsForGroup(edgeGroupsByLabel.fromInstance);
        const notFromInstanceMenuItems = createMenuItemsForGroup(edgeGroupsByLabel.notFromInstance);
        const separator = fromInstanceMenuItems.length && notFromInstanceMenuItems.length ? (
            <div className={ResultTrayStyles.dropdownSeparator} />
        ) : null;
        return [...fromInstanceMenuItems, separator, ...notFromInstanceMenuItems].filter(Boolean);
    }

    // Gets all nodes that could receive a property
    function getPropertyTargets(isOptional, object, label, property, isFromInstance, includeValuesItem) {
        let textAddition = "";
        if (isOptional) textAddition = " (Optional)";
        const isDisabled = isFromInstance && selectedNode.classOmitted;
        const acceptsAnyURI = object === 'http://www.w3.org/2001/XMLSchema#anyURI';
        const result = activeGraph.nodes.filter(generalNode => generalNode && (acceptsAnyURI ? generalNode.class === 'http://www.w3.org/2002/07/owl#Thing' : generalNode.type === object) && generalNode.id !== selectedNode.id)
            .map(targetedNode => (
                <DropdownMenuItem disableRipple={isDisabled} disabled={isDisabled} onClick={() => {
                    if (!isDisabled) addEdge(selectedNode.id, targetedNode.id, label + textAddition, property, isOptional, isFromInstance)
                }
                }>{targetedNode.label} </DropdownMenuItem>));
        // Include node generation in dropdown for ease of access
        if (acceptsAnyURI && result.length === 0) {
            result.push(
                <DropdownMenuItem disabled={true}>
                    {"No target class defined. Please add it manually."}
                </DropdownMenuItem>);
        } else if (!acceptsAnyURI) {
            result.push(
                <CreateNodeItem
                    varKey={object}
                    graph={varData[object].uri_graph}
                    classURI={varData[object].uri_element}
                    selectedNode={selectedNode}
                    edgeLabel={label + textAddition}
                    property={property}
                    isOptional={isOptional}
                    isFromInstance={isFromInstance}
                    addNode={addNode}
                    addEdge={addEdge}
                />)
        }

        if (includeValuesItem && !inputRefs.current[label]) {
            inputRefs.current[label] = React.createRef();
            result.unshift(
                <ValuesItem inputRef={inputRefs.current[label]} uriList={uriList} selectedNode={selectedNode} label={label} property={property} isOptional={isOptional} isFromInstance={isFromInstance} setUriList={setUriList} addNode={addNode} addEdge={addEdge} disabled={isDisabled} />);
        }
        return result;
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
        switch (selectedNode.shape) {
            case 'circle':
                shownProperties = createUnionMenuItems();
                shownOptionals = [];
                break;
            case 'box':
                shownProperties = [];
                shownOptionals = [];
                break;
            default:
                const edgesForSelectedNode = edgeData[selectedNode.type];
                shownProperties = graphs[activeGraphId].edges.some(edge => edge.isOptional && edge.to === selectedNode.id) ? [] : createGroupedMenuItems(edgesForSelectedNode, false);
                shownOptionals = createGroupedMenuItems(edgesForSelectedNode, true);
        }
    }

    const uniqueVars = new Set(Object.values(startingVar).map(({ type, varID }) => `${type}-${varID}`));
    const numVarsSelected = uniqueVars.size;
    const graphsAreEmpty = graphs.every(graph => !graph.nodes || graph.nodes.length === 0);
    const attributesToWorkWith = graphs.some(graph => graph.nodes.some(node => Object.values(node.properties).some(property => property.show || property.as)));
    buttonVarToShowLabel = numVarsSelected === 0 ? 'Select output' : `${numVarsSelected} nodes shown`;
    buttonFilterLabel = activeGraph.filters.length ? activeGraph.filters.length === 1 ?
        `${activeGraph.filters.length} filter set` : `${activeGraph.filters.length} filters set` : "Set filters";
    buttonBindingLabel = activeGraph.bindings.length ? activeGraph.bindings.length === 1 ?
        `${activeGraph.bindings.length} binding set` : `${activeGraph.bindings.length} bindings set` : "Set bindings";
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
    /*
    TODO
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
                            const show = value.show;
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
    */
    // Gets all nodes that could be selected as a shown result
    function getShownTargets() {
        const selectedNodesSet = new Set(Object.keys(startingVar).map(key => parseInt(key, 10)));

        // Toggle selected state for a given node
        const toggleNodeSelection = (nodeIds, nodeInfo, isInstance, isClass) => {
            setStartingVar(prevStartingVar => {
                const updatedStartingVar = { ...prevStartingVar };
                nodeIds.forEach(nodeId => {
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
                });
                return updatedStartingVar;
            });
        };

        function createDropdownItem(targetedNode, label, isInstance, isClass) {
            return (
                <DropdownMenuItem preventCloseOnClick={true} disableRipple={true} onClick={event => {
                    event.stopPropagation();
                    toggleNodeSelection(targetedNode.ids, nodeContents(targetedNode, isInstance, isClass), isInstance, isClass);
                }}>
                    <span className={ResultTrayStyles.shownNode}>
                        {label}
                        {(targetedNode.ids.some(id => selectedNodesSet.has(id)) &&
                            ((isInstance && targetedNode.ids.some(id => startingVar[id]?.instance)) ||
                                (isClass && targetedNode.ids.some(id => startingVar[id]?.class)))) ?
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
                let isInstance = activeGraph.edges.some(edge => edge.isFromInstance && targetedNode.ids.includes(edge.from));
                let isClass = activeGraph.edges.some(edge => !edge.isFromInstance && targetedNode.ids.includes(edge.from)) ||
                    !activeGraph.edges.some(edge => targetedNode.ids.includes(edge.from));

                if (isInstance || isClass) {
                    let instanceLabel = `${baseLabel} (instance)`;
                    let classLabel = `${baseLabel}${isInstance ? ' (class)' : ''}`;
                    if (isInstance) {
                        result.push(createDropdownItem(targetedNode, instanceLabel, true, false));
                        result.push(createDropdownItem(targetedNode, classLabel, false, true));
                    } else if (isClass) {
                        result.push(createDropdownItem(targetedNode, classLabel, false, true));
                    }
                }
            });
        /*
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
    result.push(<DropdownNestedMenuItem label="Metrics..." menu={countMenu} />);*/
        return result;
    }

    // Set data to export format
    const getQueryData = useCallback(() => {
        const queryData = getGraphData();
        queryData.startingVar = startingVar;
        queryData.isDistinct = isDistinct;
        queryData.isCount = isCount;
        return (queryData);
    }, [getGraphData, startingVar, isDistinct, isCount])

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

    const triggerTooltip = (message, ref) => {
        setTooltipMessage(message);
        if (tooltipRef.current !== ref.current)
            setTooltipRef(ref);
        setTooltipShown(false);
        setTimeout(() => setTooltipShown(true), 10);
        return false;
    }

    return (
        <span className={ResultTrayStyles.container}>
            <div className={ResultTrayStyles.controlColumn}>
                {isTooltipShown && <TooltipPopup message={tooltipMessage} buttonRef={tooltipRef} onClose={() => setTooltipShown(false)} />}
                <div className={ResultTrayStyles.buttonRow}>
                    <button ref={buttonRef0} className={ResultTrayStyles.del_button} onClick={() => { if (selectedNode || selectedEdge) deleteSelected(); else triggerTooltip("Please select an item to delete.", buttonRef0) }}>
                        <span className={ResultTrayStyles.deleteText}>Delete</span>
                        <TrashIcon className={ResultTrayStyles.deleteIcon} />
                    </button>
                    <button ref={buttonRef1} className={ResultTrayStyles.big_button} onClick={() => { if (selectedNode) setDataOpen(true); else triggerTooltip("Please select a node first.", buttonRef1) }}>
                        {buttonInsideLabel}
                    </button>
                </div>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown menu={shownProperties} uriList={uriList}
                        trigger={
                            <button
                                ref={buttonRef2}
                                className={ResultTrayStyles.big_button}
                                onClick={(event) => {
                                    if (!selectedNode) {
                                        triggerTooltip("Please select a node first.", buttonRef2)
                                        event.stopPropagation();
                                    }
                                }}
                            > {buttonPropertyLabel} </button>
                        } />
                    <Dropdown menu={shownOptionals}
                        trigger={
                            <button
                                ref={buttonRef3}
                                className={ResultTrayStyles.big_button}
                                onClick={(event) => {
                                    if (!selectedNode) {
                                        triggerTooltip("Please select a node first.", buttonRef3)
                                        event.stopPropagation();
                                    }
                                }}
                                disabled={isButtonDisabled}
                            > {buttonOptionalLabel}</button>
                        } />
                </div>
                <div className={ResultTrayStyles.buttonRow}>
                    <button ref={buttonRef4} className={ResultTrayStyles.big_button} onClick={() => {
                        if (!attributesToWorkWith)
                            triggerTooltip("No attributes set to show.", buttonRef4);
                        else
                            setFiltersOpen(true);
                    }}>{buttonFilterLabel}</button>
                    <button ref={buttonRef5} className={ResultTrayStyles.big_button} onClick={() => {
                        if (!attributesToWorkWith)
                            triggerTooltip("No attributes set to show.", buttonRef5);
                        else
                            setBindingsOpen(true);
                    }}>{buttonBindingLabel}</button>
                </div>
            </div>
            <div className={ResultTrayStyles.resultsColumn}>
                <SearchResults startingData={startingVar} resultData={resultData} />
            </div>
            <div className={ResultTrayStyles.queryColumn}>
                <div className={ResultTrayStyles.switchRow}>
                    <FormControlLabel
                        className={ResultTrayStyles.formControlLabel}
                        label="Distinct"
                        control={
                            <Switch
                                checked={isDistinct}
                                onChange={(e) => setDistinct(e.target.checked)}
                                style={{ color: '#c22535' }}
                                sx={{
                                    '& .MuiSwitch-track': { backgroundColor: 'lightgray' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#c22535',
                                    },
                                }} />}
                    />
                    <FormControlLabel
                        className={ResultTrayStyles.formControlLabel}
                        label="Count"
                        control={
                            <Switch
                                checked={isCount}
                                onChange={(e) => setCount(e.target.checked)}
                                style={{ color: '#c22535' }}
                                sx={{
                                    '& .MuiSwitch-track': { backgroundColor: 'lightgray' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#c22535',
                                    },
                                }} />}
                    />
                </div>
                <div className={ResultTrayStyles.buttonRow}>
                    <Dropdown trigger={<button ref={buttonRef6}
                        onClick={(event) => {
                            if (graphsAreEmpty) {
                                triggerTooltip("Current graphs are empty.", buttonRef6);
                                event.stopPropagation();
                            }
                        }} className={ResultTrayStyles.big_button}>{buttonVarToShowLabel}</button>} menu={getShownTargets()} />
                    <QueryButton ref={buttonRef7} graphs={graphs} activeGraphId={activeGraphId} bindings={bindings} startingVar={startingVar} isDistinct={isDistinct} isCount={isCount} setResultData={setResultData} onValidationError={(message) => triggerTooltip(message, buttonRef7)} />
                </div>
                <div className={ResultTrayStyles.buttonRow}>
                    <FileToQuery onFileSelect={onFileSelect} />
                    <QueryToFile getQueryData={getQueryData} />
                </div>
                <Dropdown trigger={
                    <button ref={buttonRef8} className={ResultTrayStyles.big_button}
                        onClick={(event) => {
                            if (!resultData || resultData.length === 0) {
                                triggerTooltip("No results available to export.", buttonRef8);
                                event.preventDefault();
                            }
                        }}> Export results</button>}
                    menu={
                        resultData && resultData.length > 0 ? [
                            <ResultExporter data={resultData} fileType="csv" />,
                            <ResultExporter data={resultData} fileType="tsv" />,
                            <ResultExporter data={resultData} fileType="txt" />,
                            <ResultExporter data={resultData} fileType="ods" />
                        ] : []
                    }
                />
            </div>
        </span >
    )
}

export default ResultTray;
