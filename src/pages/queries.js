import React, { useState, useEffect } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import SearchNodes from '../components/SearchNodes/searchNodes';
import VarTray from '../components/VarTray/varTray';
import UnionTray from '../components/UnionTray/unionTray';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
import DataModal from "../components/DataModal/dataModal";
import BindingsModal from "../components/BindingsModal/bindingsModal";
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
    const [graphs, setGraphs] = useState([{ id: 0, label: 'Default', nodes: [], edges: [] }]);
    const [activeGraphId, setActiveGraph] = useState(0);
    const [bindings, setBindings] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [varIDs, setVarIDs] = useState(null);
    // Flags used in the UI
    const [isDataOpen, setDataOpen] = useState(false);
    const [isBindingsOpen, setBindingsOpen] = useState(false);
    const [isUnionTrayOpen, setUnionTrayOpen] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    // Graph currently being displayed
    const activeGraph = graphs.find(graph => graph.id === activeGraphId);
    const activeGraphIndex = graphs.findIndex(graph => graph.id === activeGraphId);
    const nodes = activeGraph.nodes;
    const edges = activeGraph.edges;

    console.log(activeGraphId);

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

    // Graphs won't be able to be added to others if doing so would cause a loop
    function isGraphLoop(graphId) {
        return false;
    }

    function addGraph(label, graph) {
        const newId = Math.max(...graphs.map(item => Number(item.id))) + 1;
        const newGraph = graph ? graph : { id: newId, label: label, nodes: [], edges: [] }
        setGraphs([...graphs, newGraph]);
        return true;
    }
    // Adds the passed graph as a node to the active one
    function addGraphNode(graphId) {
        if (isGraphLoop(graphId)) return false;
        return true;
    }
    function removeGraph(graphId) {
        if (graphs.length <= 1)
            return false;
        setGraphs(prevGraphs => {
            const graphIndex = prevGraphs.findIndex(graph => graph.id === graphId);
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

    function addNode(id, data, type, isVar, graph, classURI, uriOnly) {
        let newNode;
        setGraphs(prevGraphs => {
            const newNodes = [...prevGraphs[activeGraphIndex].nodes];
            const maxId = newNodes.reduce((maxId, node) => Math.max(maxId, node.id), -1);
            const varID = isVar ? varIDs[type] : -1;
            const label = isVar ? `${id} ${varID}` : id;
            const uri = isVar ? `?${capitalizeFirst(type)}___${varID}___URI` : data;
            if (isVar) setVarIDs(prevVarIDs => ({ ...prevVarIDs, [type]: prevVarIDs[type] + 1 }));
            const shape = uriOnly ? 'box' : 'big ellipse';
            const color = uriOnly ? '#D3D3D3' : colorList[type];

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
            const maxId = newEdges.reduce((maxId, edge) => Math.max(maxId, edge.id), -1);
            newEdge = {
                id: maxId + 1,
                dashes: isOptional,
                from: id1,
                to: id2,
                label: label,
                data: data,
                isOptional: isOptional,
                isTransitive: false,
                isFromInstance: isFromInstance
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

    function loadGraph(graph) {
        /*
        TODO

        setNodes([]);
        setEdges([]);
        setBindings([]);

        const initialVarIDs = Object.fromEntries(Object.keys(varData).map(type => [type, 0]));
        setVarIDs(initialVarIDs);
        let newVarIDs = { ...initialVarIDs };

        let nodeIdToIndex = {};  // Map from node IDs to their index in the newNodes array

        const newNodes = graph.nodes.map((node, index) => {
            const varID = node.varID !== -1 ? newVarIDs[node.type] : -1;
            const label = node.varID !== -1 ? `${node.label} ${varID}` : node.label;
            const uri = node.varID !== -1 ? `?${capitalizeFirst(node.type)}___${varID}___URI` : node.data;
            const shape = node.shape === 'box' ? 'box' : 'big ellipse';
            const color = node.shape === 'box' ? '#D3D3D3' : colorList[node.type];
            if (node.varID !== -1) newVarIDs[node.type] = varID + 1;

            const newNode = {
                id: node.id,  // Use the actual node id, not the index
                data: uri,
                label: label,
                color: color,
                type: node.type,
                varID: varID,
                graph: node.graph,
                class: node.class,
                shape: shape
            };

            nodeIdToIndex[node.id] = index;  // Store the index for later use in edges

            if (node.properties) {
                newNode.properties = node.properties;
            }

            return newNode;
        });
        setNodes(newNodes);
        setVarIDs(newVarIDs);
        const newEdges = graph.edges.map((edge, index) => {
            return {
                id: index,
                dashes: edge.isOptional,
                from: nodeIdToIndex[edge.from],  // Use the correct index from the map
                to: nodeIdToIndex[edge.to],  // Use the correct index from the map
                label: edge.label,
                data: edge.data,
                isOptional: edge.isOptional,
                isTransitive: false
            };
        });
        setEdges(newEdges);

        if (graph.bindings && Array.isArray(graph.bindings)) {
            setBindings(graph.bindings);
        }
        */
    }

    function toggleIsTransitive(edge) {
        let propCanBeTransitive;
        setGraphs(prevGraphs => {
            propCanBeTransitive = objectProperties[prevGraphs[activeGraphIndex].nodes.find(node => node.id === edge.to).type].some(obj => obj.property === edge.data);
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
                    <UnionTray graphs={graphs} isGraphLoop={isGraphLoop} addGraph={addGraph} removeGraph={removeGraph} changeActiveGraph={changeActiveGraph} addGraphNode={addGraphNode} isUnionTrayOpen={isUnionTrayOpen} toggleUnionTray={toggleUnionTray} />
                    <Graph nodesInGraph={nodes} edgesInGraph={edges} setSelectedNode={setSelectedNode} setSelectedEdge={setSelectedEdge} setDataOpen={setDataOpen} toggleIsTransitive={toggleIsTransitive} />
                </span>
                <ResultTray edgeData={objectProperties} insideData={dataProperties} nodes={nodes} edges={edges} bindings={bindings} selectedNode={selectedNode} selectedEdge={selectedEdge} addNode={addNode} addEdge={addEdge} removeNode={removeNode} removeEdge={removeEdge} setDataOpen={setDataOpen} setBindingsOpen={setBindingsOpen} loadGraph={loadGraph} />
            </div>
            <DataModal insideData={dataProperties} selectedNode={selectedNode} isDataOpen={isDataOpen} setDataOpen={setDataOpen} setNode={setNode} />
            <BindingsModal nodes={nodes} bindings={bindings} isBindingsOpen={isBindingsOpen} setBindingsOpen={setBindingsOpen} setBindings={setBindings} />
        </div>
    );
}

export default Queries;
