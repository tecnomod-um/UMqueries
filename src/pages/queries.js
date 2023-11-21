import React, { useState, useEffect, useMemo } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import SearchNodes from '../components/SearchNodes/searchNodes';
import VarTray from '../components/VarTray/varTray';
import UnionTray from '../components/UnionTray/unionTray';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
import DataModal from "../components/DataModal/dataModal";
import BindingsModal from "../components/BindingsModal/bindingsModal";
import FiltersModal from "../components/FiltersModal/filtersModal";
import { capitalizeFirst } from "../utils/stringFormatter.js";
import { populateWithEndpointData } from "../utils/petitionHandler.js";
import { getCategory } from "../utils/typeChecker.js";

// Main view. All functional elements will be shown here.
function Queries() {
    // Data generated from endpoint
    const [varData, setVarData] = useState(null);
    const [dataProperties, setDataProperties] = useState(null);
    const [objectProperties, setObjectProperties] = useState(null);
    // Data structures used through the app
    const [graphs, setGraphs] = useState([{ id: 0, label: 'Default', nodes: [], edges: [], bindings: [], filters: [] }]);
    const [activeGraphId, setActiveGraph] = useState(0);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [varIDs, setVarIDs] = useState(null);
    // Modal-related hooks
    const [isDataOpen, setDataOpen] = useState(false);
    const [isBindingsOpen, setBindingsOpen] = useState(false);
    const [isUnionTrayOpen, setUnionTrayOpen] = useState(false);
    const [isFiltersOpen, setFiltersOpen] = useState(false);
    // Flags used in the UI loading state
    const [isFading, setIsFading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    // Graph currently being displayed
    const activeGraph = graphs.find(graph => graph.id === activeGraphId);
    const activeGraphIndex = graphs.findIndex(graph => graph.id === activeGraphId);
    // Nodes defined though all graphs
    const allNodes = useMemo(() => {
        const uniqueNodesMap = new Map();
        graphs.forEach(graph => {
            graph.nodes.forEach(node => {
                const nodeKey = `${node.type}_${node.varID}`;
                if (!uniqueNodesMap.has(nodeKey)) {
                    uniqueNodesMap.set(nodeKey, node);
                }
            });
        });
        return Array.from(uniqueNodesMap.values());
    }, [graphs]);

    // Loads endpoint data when first loaded
    useEffect(() => {
        populateWithEndpointData(setVarData, setVarIDs, setObjectProperties, setDataProperties)
            .then(() => {
                setTimeout(() => {
                    setIsFading(true);
                    setTimeout(() => setIsLoaded(true), 150);
                });
            });
    }, []);

    // Updates modal to stop showing if currentNode is deleted
    useEffect(() => {
        if (!selectedNode) setDataOpen(false);
    }, [selectedNode]);

    // Loading screen
    if (!isLoaded) {
        const loadingContainerClass = isFading
            ? `${QueriesStyles.loadingContainer} ${QueriesStyles.fadeOut}`
            : QueriesStyles.loadingContainer;

        return (
            <div className={loadingContainerClass}>
                <div className={QueriesStyles.loadingAnimation} />
            </div>
        );
    }
    // Can't connect to server screen
    else if (varData == null)
        return <div className={QueriesStyles.error_screen}>Server can't be reached at the moment. Try again later.</div>;

    const mainContainerClass = isFading
        ? `${QueriesStyles.queryContainer} ${QueriesStyles.fadeIn}`
        : QueriesStyles.queryContainer;

    function generateColorList(varData) {
        if (!varData) return {};
        const palette = distinctColors({
            count: Object.keys(varData).length,
            chromaMin: 15,
            chromaMax: 95,
            lightMin: 65,
            lightMax: 90
        });

        const colorList = Object.fromEntries(
            Object.keys(varData).map((type, index) => [type, palette[index].hex()])
        );
        return colorList;
    }

    const colorList = generateColorList(varData);

    const toggleUnionTray = () => {
        setUnionTrayOpen(prevState => !prevState);
    }

    function changeActiveGraph(graphId) {
        setActiveGraph(graphId);
    }

    // Checks if adding a graph would create a loop.
    function isGraphLoop(graphIdToAdd, currentGraphId, visitedGraphs) {
        if (graphIdToAdd === currentGraphId)
            return true;
        if (visitedGraphs.has(graphIdToAdd))
            return true;

        visitedGraphs.add(graphIdToAdd);
        const graphToAdd = graphs.find(graph => graph.id === graphIdToAdd);
        for (const node of graphToAdd.nodes) {
            if (node.shape === 'circle' && node.data) {
                if (node.data === currentGraphId)
                    return true;
                if (isGraphLoop(graphIdToAdd, node.data, visitedGraphs))
                    return true;
            }
        }
        return false;
    }

    function addGraph(label, graph) {
        const newId = Math.max(...graphs.map(item => Number(item.id))) + 1;
        const newGraph = graph ? graph : { id: newId, label: label, nodes: [], edges: [], bindings: [], filters: [] }
        setGraphs([...graphs, newGraph]);
        setVarIDs([...varIDs, { id: newId, varIdList: Object.fromEntries(Object.keys(varData).map(type => [type, 0])) }]);
        return true;
    }

    // Adds the passed graph as a node to the active one
    function addGraphNode(graphId) {
        if (isGraphLoop(graphId, activeGraphId, new Set())) return false;
        return addNode(graphId, graphs[graphs.findIndex(graph => graph.id === graphId)].label, null, null, null, null, false, true);
    }

    function addUnion(selectedNodeId, targetNodeId) {
        setGraphs(prevGraphs => {
            const newEdges = [...prevGraphs[activeGraphIndex].edges];
            const maxId = prevGraphs.reduce((maxId, graph) => {
                const graphMaxId = graph.edges.reduce((max, edge) => Math.max(max, edge.id), -1);
                return Math.max(maxId, graphMaxId);
            }, -1);
            const unionEdge = {
                id: maxId,
                dashes: false,
                from: selectedNodeId,
                to: targetNodeId,
                label: 'UNION',
                data: 'UNION',
                isOptional: false,
                isTransitive: false,
                isFromInstance: false,
                arrows: {
                    to: { enabled: true, scaleFactor: 1, type: 'arrow' },
                    from: { enabled: true, scaleFactor: 1, type: 'arrow' }
                },
                smooth: {
                    enabled: true,
                    type: 'curvedCW',
                    roundness: 0.5
                },
                width: 2,
                chosen: true,
                color: {
                    color: '#848484',
                    highlight: '#848484',
                    hover: '#848484',
                    inherit: false
                },
            }
            newEdges.push(unionEdge);
            const updatedGraph = { ...prevGraphs[activeGraphIndex], edges: newEdges };
            return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
        });
        return true;
    }

    function removeGraph(graphId) {
        if (graphs.length <= 1)
            return false;
        setGraphs(prevGraphs => {
            const graphIndex = prevGraphs.findIndex(graph => graph.id === graphId);
            const idIndex = varIDs.findIndex(set => set.id === graphId);
            setVarIDs(prevIds => [...prevIds.slice(0, idIndex), ...prevIds.slice(idIndex + 1)]);
            if (graphId === activeGraphId) {
                if (graphIndex > 0)
                    setActiveGraph(prevGraphs[graphIndex - 1].id);
                else if (graphIndex < prevGraphs.length - 1)
                    setActiveGraph(prevGraphs[graphIndex + 1].id);
                else
                    setActiveGraph(prevGraphs[0].id);
            }
            return [...prevGraphs.slice(0, graphIndex), ...prevGraphs.slice(graphIndex + 1)];
        });
        return true;
    }

    function addNode(id, data, type, isVar, graph, classURI, uriOnly, isGraph) {
        let newNode;
        setGraphs(prevGraphs => {
            const newNodes = [...prevGraphs[activeGraphIndex].nodes];
            const maxId = prevGraphs.reduce((maxId, graph) => {
                const graphMaxId = graph.nodes.reduce((max, node) => Math.max(max, node.id), -1);
                return Math.max(maxId, graphMaxId);
            }, -1);
            const varID = isVar ? varIDs[varIDs.findIndex(set => set.id === activeGraphId)].varIdList[type] : -1;
            const uri = isVar ? `?${capitalizeFirst(type)}___${varID}___URI` : isGraph ? id : data;
            const label = isVar ? `${id} ${varID}` : isGraph ? data : id;

            // Update only the active graph varIds 
            if (isVar) {
                setVarIDs(prevVarIDs => {
                    return prevVarIDs.map(set => {
                        if (set.id === activeGraphId)
                            return { ...set, varIdList: { ...set.varIdList, [type]: set.varIdList[type] + 1 } };
                        return set;
                    });
                });
            }
            const shape = uriOnly ? 'box' : isGraph ? 'circle' : 'big ellipse';
            const color = uriOnly ? '#D3D3D3' : isGraph ? '#C22535' : colorList[type];
            const fontColor = isGraph ? 'white' : 'black';
            newNode = {
                id: maxId + 1,
                data: uri,
                label: label,
                color: color,
                type: type,
                varID: varID,
                graph: graph,
                class: classURI,
                shape: shape,
                font: { color: fontColor },
                properties: {}
            }

            dataProperties[type]?.forEach(property => {
                newNode.properties[property.label] = {
                    uri: property.property,
                    data: '',
                    show: false,
                    type: getCategory(property.type),
                    transitive: false,
                    operator: '=',
                }
            });
            newNodes.push(newNode);
            const updatedGraph = { ...prevGraphs[activeGraphIndex], nodes: newNodes };
            return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
        });
        return newNode;
    }

    function addEdge(id1, id2, label, data, isOptional, isFromInstance) {
        let newEdge;
        setGraphs((prevGraphs) => {
            const newEdges = [...prevGraphs[activeGraphIndex].edges];
            const maxId = prevGraphs.reduce((maxId, graph) => {
                const graphMaxId = graph.edges.reduce((max, edge) => Math.max(max, edge.id), -1);
                return Math.max(maxId, graphMaxId);
            }, -1);
            newEdge = {
                id: maxId + 1,
                dashes: isOptional,
                from: id1,
                to: id2,
                label: label,
                data: data,
                isOptional: isOptional,
                isTransitive: false,
                isFromInstance: isFromInstance,
                arrows: {
                    to: { enabled: true, scaleFactor: 1, type: 'arrow' },
                    from: { enabled: false }
                },
                smooth: {
                    enabled: false,
                },
                width: 1,
                chosen: true,
                color: {
                    color: '#000000',
                    highlight: '#000000',
                    hover: '#000000',
                    inherit: false
                },
            };
            newEdges.push(newEdge);
            const updatedGraph = { ...prevGraphs[activeGraphIndex], edges: newEdges };
            return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
        });
        return newEdge;
    }

    function setNode(updatedNode) {
        setGraphs(graphs => {
            let newNodes = graphs[activeGraphIndex].nodes.filter(node => node.id !== updatedNode.id);
            newNodes.push(updatedNode);
            newNodes.sort((node1, node2) => node1.id - node2.id);
            const updatedGraph = { ...graphs[activeGraphIndex], nodes: newNodes };
            return [...graphs.slice(0, activeGraphIndex), updatedGraph, ...graphs.slice(activeGraphIndex + 1)];
        });
        setSelectedNode(updatedNode);
    }

    function removeNode() {
        if (selectedNode) {
            setGraphs(graphs => {
                const updatedEdges = graphs[activeGraphIndex].edges.filter(edge => (edge.from !== selectedNode.id) && (edge.to !== selectedNode.id));
                const updatedNodes = graphs[activeGraphIndex].nodes.filter(node => node.id !== selectedNode.id);
                const updatedGraph = { ...graphs[activeGraphIndex], nodes: updatedNodes, edges: updatedEdges };
                return [...graphs.slice(0, activeGraphIndex), updatedGraph, ...graphs.slice(activeGraphIndex + 1)];
            });
            setSelectedNode(null);
            setSelectedEdge(null);
            setDataOpen(false);
            return true;
        } return false;
    }

    function removeEdge() {
        if (selectedEdge) {
            setGraphs(graphs => {
                const updatedEdges = graphs[activeGraphIndex].edges.filter(edge => (edge.id !== selectedEdge.id));
                const updatedGraph = { ...graphs[activeGraphIndex], edges: updatedEdges };
                return [...graphs.slice(0, activeGraphIndex), updatedGraph, ...graphs.slice(activeGraphIndex + 1)];
            });
            setSelectedNode(null);
            setSelectedEdge(null);
            return true;
        } return false;
    }

    function loadQueryFile(importData) {
        const { graphs, bindings } = importData;
        const initialVarIDs = graphs.map(graph => ({
            id: graph.id,
            varIdList: Object.fromEntries(
                Object.keys(graph.nodes.reduce((acc, node) => {
                    acc[node.type] = 0;
                    return acc;
                }, {})).map(type => [type, 0])
            )
        }));
        const newGraphs = graphs.map((graph) => {
            const currentVarIDObj = initialVarIDs.find(item => item.id === graph.id);
            let nodeIdToIndexMapping = {};
            const newNodes = graph.nodes.map((node) => {
                let varID = node.varID;
                if (varID !== -1)
                    varID = currentVarIDObj.varIdList[node.type]++;
                const label = varID !== -1 ? `${node.label} ${varID}` : node.label;
                const uri = varID !== -1 ? `?${capitalizeFirst(node.type)}___${varID}___URI` : node.data;
                nodeIdToIndexMapping[node.id] = node.id;
                return {
                    ...node,
                    varID,
                    label,
                    data: uri,
                };
            });
            const newEdges = graph.edges.map(edge => ({
                ...edge,
                from: nodeIdToIndexMapping[edge.from],
                to: nodeIdToIndexMapping[edge.to],
            }));

            return {
                ...graph,
                nodes: newNodes,
                edges: newEdges,
            };
        });
        const allTypes = new Set([...initialVarIDs.flatMap(item => Object.keys(item.varIdList)), ...Object.keys(varData)]);
        const updatedVarIDs = initialVarIDs.map(varID => ({
            ...varID,
            varIdList: Object.fromEntries(
                Array.from(allTypes).map(type => [type, varID.varIdList[type] ?? 0])
            )
        }));
        setGraphs(newGraphs);
        setVarIDs(updatedVarIDs);
        setBindings(bindings);
        setActiveGraph(newGraphs[0]?.id || 0);
    }

    function getGraphData() {
        const result = {};
        result.graphs = graphs.map(graph => {
            return {
                id: graph.id,
                label: graph.label,
                nodes: graph.nodes,
                edges: graph.edges,
                bindings: graph.bindings,
                filters: graph.filters
            };
        });
        return result;
    }

    // Updates the bindings  in the current graph
    function setBindings(newBindings) {
        setGraphs(prevGraphs => {
            const updatedGraph = { ...prevGraphs[activeGraphIndex], bindings: newBindings };
            return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
        });
        return activeGraph.bindings;
    }

    // Updates the filters in the current graph
    function setFilters(newFilters) {
        console.log(activeGraph);
        setGraphs(prevGraphs => {
            const updatedGraph = { ...prevGraphs[activeGraphIndex], filters: newFilters };
            return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
        });
        console.log(activeGraph)
        return activeGraph.filters;
    }

    // Toggles transitivity for the selected edge
    function toggleIsTransitive(edge) {
        let propCanBeTransitive;
        setGraphs(prevGraphs => {
            propCanBeTransitive = edge.data === 'UNION' ? false : objectProperties[prevGraphs[activeGraphIndex].nodes.find(node => node.id === edge.to).type].some(obj => obj.property === edge.data);
            if (propCanBeTransitive) {
                let label = edge.label;
                edge.isTransitive ? label = label.slice(0, -1) : label = label + "*";
                let newEdges = [...prevGraphs[activeGraphIndex].edges];
                const edgeIndex = newEdges.findIndex(e => e.id === edge.id);
                newEdges[edgeIndex] = {
                    ...edge,
                    label: label,
                    isTransitive: !edge.isTransitive
                };
                const updatedGraph = { ...prevGraphs[activeGraphIndex], edges: newEdges };
                return [...prevGraphs.slice(0, activeGraphIndex), updatedGraph, ...prevGraphs.slice(activeGraphIndex + 1)];
            }
            return prevGraphs;
        });
        return propCanBeTransitive;
    }

    return (
        <div className={mainContainerClass}>
            <div className={QueriesStyles.constraint_container}>
                <SearchNodes varData={varData} colorList={colorList} addNode={addNode} />
                <VarTray varData={varData} colorList={colorList} addNode={addNode} />
            </div>
            <div className={QueriesStyles.main_container}>
                <span className={QueriesStyles.graph_wrapper}>
                    <UnionTray activeGraphId={activeGraphId} graphs={graphs} isGraphLoop={isGraphLoop} addGraph={addGraph} removeGraph={removeGraph} changeActiveGraph={changeActiveGraph} addGraphNode={addGraphNode} isUnionTrayOpen={isUnionTrayOpen} toggleUnionTray={toggleUnionTray} />
                    <Graph activeGraph={activeGraph} setSelectedNode={setSelectedNode} setSelectedEdge={setSelectedEdge} setDataOpen={setDataOpen} toggleIsTransitive={toggleIsTransitive} />
                </span>
                <ResultTray activeGraphId={activeGraphId} graphs={graphs} allNodes={allNodes} edgeData={objectProperties} insideData={dataProperties} bindings={activeGraph.bindings} selectedNode={selectedNode} selectedEdge={selectedEdge} addUnion={addUnion} addNode={addNode} addEdge={addEdge} removeNode={removeNode} removeEdge={removeEdge} setDataOpen={setDataOpen} setBindingsOpen={setBindingsOpen} setFiltersOpen={setFiltersOpen} loadQueryFile={loadQueryFile} getGraphData={getGraphData} />
            </div>
            <DataModal insideData={dataProperties} selectedNode={selectedNode} isDataOpen={isDataOpen} setDataOpen={setDataOpen} setNode={setNode} />
            <BindingsModal allNodes={allNodes} bindings={activeGraph.bindings} isBindingsOpen={isBindingsOpen} setBindingsOpen={setBindingsOpen} setBindings={setBindings} />
            <FiltersModal nodes={activeGraph.nodes} bindings={activeGraph.bindings} isFiltersOpen={isFiltersOpen} filters={activeGraph.filters} setFiltersOpen={setFiltersOpen} setFilters={setFilters} />
        </div>
    );
}

export default Queries;
