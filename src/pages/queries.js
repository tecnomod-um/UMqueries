import React, { useState, useEffect } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import SearchNodes from '../components/SearchNodes/searchNodes';
import VarTray from '../components/VarTray/varTray';
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
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [varIDs, setVarIDs] = useState(null);
    // Flags used in the UI
    const [isDataOpen, setDataOpen] = useState(false);
    const [isBindingsOpen, setBindingsOpen] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
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

    function addNode(id, data, type, isVar, graph, classURI, uriOnly) {
        let newNode;
        setNodes((prevNodes) => {
            const maxId = prevNodes.reduce((maxId, node) => Math.max(maxId, node.id), -1);
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
            return [...prevNodes, newNode];
        });
        return newNode;
    }

    function addEdge(id1, id2, label, data, isOptional, isFromInstance) {
        setEdges((prevEdges) => {
            const maxId = prevEdges.reduce((maxId, edge) => Math.max(maxId, edge.id), -1);
            const newEdge = {
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
            return [...prevEdges, newEdge];
        });
    }

    function setNode(updatedNode) {
        setNodes(nodes => {
            let newNodes = nodes.filter(node => node.id !== updatedNode.id);
            newNodes.push(updatedNode);
            newNodes.sort((node1, node2) => node1.id - node2.id);
            return newNodes;
        });
        setSelectedNode(updatedNode);
    }

    function removeNode() {
        setEdges(edges.filter(edge => (edge.from !== selectedNode.id) && (edge.to !== selectedNode.id)));
        setNodes(nodes.filter(node => node.id !== selectedNode.id));
        setSelectedNode(null);
        setSelectedEdge(null);
        setDataOpen(false);
    }

    function removeEdge() {
        setEdges(edges.filter(edge => (edge.id !== selectedEdge.id)));
        setSelectedNode(null);
        setSelectedEdge(null);
    }

    function loadGraph(graph) {
        setNodes([]);
        setEdges([]);
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
    }

    function toggleIsTransitive(edge) {
        let propCanBeTransitive = objectProperties[nodes.find(node => node.id === edge.to).type].some(obj => obj.property = edge.data);
        if (propCanBeTransitive) {
            let label = edge.label;
            edge.isTransitive ? label = label.slice(0, -1) : label = label + "*";
            let newEdges = [...edges];
            newEdges[edge.id] = { id: edge.id, dashes: edge.isOptional, from: edge.from, to: edge.to, label: label, data: edge.data, isOptional: edge.isOptional, isTransitive: !edge.isTransitive };
            setEdges(newEdges);
        }
    }

    return (
        <div className={mainContainerClass}>
            <div className={QueriesStyles.constraint_container}>
                <SearchNodes varData={varData} colorList={colorList} addNode={addNode} />
                <VarTray varData={varData} colorList={colorList} addNode={addNode} />
            </div>
            <div className={QueriesStyles.graph_container}>
                <Graph nodesInGraph={nodes} edgesInGraph={edges} setSelectedNode={setSelectedNode} setSelectedEdge={setSelectedEdge} setDataOpen={setDataOpen} toggleIsTransitive={toggleIsTransitive} />
                <ResultTray edgeData={objectProperties} insideData={dataProperties} nodes={nodes} edges={edges} selectedNode={selectedNode} selectedEdge={selectedEdge} addNode={addNode} addEdge={addEdge} removeNode={removeNode} removeEdge={removeEdge} setDataOpen={setDataOpen} setBindingsOpen={setBindingsOpen} loadGraph={loadGraph} />
            </div>
            <DataModal insideData={dataProperties} selectedNode={selectedNode} isDataOpen={isDataOpen} setDataOpen={setDataOpen} setNode={setNode} />
            <BindingsModal nodes={nodes} isBindingsOpen={isBindingsOpen} setBindingsOpen={setBindingsOpen} />
        </div>
    );
}

export default Queries;
