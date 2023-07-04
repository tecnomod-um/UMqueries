import React, { useState, useEffect } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import SearchNodes from '../components/SearchNodes/searchNodes';
import VarTray from '../components/VarTray/varTray';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
import Modal from "../components/Modal/modal";
import { capitalizeFirst } from "../utils/stringFormatter.js";
import { populateWithEndpointData } from "../utils/petitionHandler.js";


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
    const [isOpen, setIsOpen] = useState(false);
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
        if (!selectedNode) setIsOpen(false);
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

    const mainContainerClass = isFading
        ? `${QueriesStyles.queryContainer} ${QueriesStyles.fadeIn}`
        : QueriesStyles.queryContainer;

    function generateColorList(varData) {
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

    function addNode(id, data, type, isVar, graph) {
        setNodes((prevNodes) => {
            const varID = isVar ? varIDs[type] : -1;
            const label = isVar ? `${id} ${varID}` : id;
            const uri = isVar ? `?${capitalizeFirst(type)}___${varID}___URI` : data;
            if (isVar) setVarIDs(prevVarIDs => ({ ...prevVarIDs, [type]: prevVarIDs[type] + 1 }));

            const newNode = {
                id: prevNodes.length ? prevNodes.slice(-1)[0].id + 1 : 0,
                data: uri,
                label: label,
                color: colorList[type],
                type: type,
                varID: varID,
                graph: graph
            };

            return [...prevNodes, newNode];
        });
    }

    function addEdge(id1, id2, label, data, isOptional) {
        setEdges((prevEdges) => {
            const newEdge = {
                id: prevEdges.length > 0 ? prevEdges.slice(-1)[0].id + 1 : 0,
                from: id1,
                to: id2,
                label: label,
                data: data,
                isOptional: isOptional,
                isTransitive: false
            };
            return [...prevEdges, newEdge];
        });
    }

    function setNode(updatedNode) {
        setNodes(nodes => {
            let newNodes = nodes.filter(node => node.id !== updatedNode.id);
            newNodes.push(updatedNode);
            return newNodes;
        });
        setSelectedNode(updatedNode);
    }

    function removeNode() {
        setEdges(edges.filter(edge => (edge.from !== selectedNode.id) && (edge.to !== selectedNode.id)));
        setNodes(nodes.filter(node => node.id !== selectedNode.id));
        setSelectedNode(null);
        setSelectedEdge(null);
        setIsOpen(false);
    }

    function removeEdge() {
        setEdges(edges.filter(edge => (edge.id !== selectedEdge.id)));
        setSelectedNode(null);
        setSelectedEdge(null);
    }

    function toggleIsTransitive(edge) {
        let propCanBeTransitive = objectProperties[nodes.find(node => node.id === edge.to).type].some(obj => obj.property = edge.data);
        if (propCanBeTransitive) {
            let label = edge.label;
            edge.isTransitive ? label = label.slice(0, -1) : label = label + "*";
            let newEdges = [...edges];
            newEdges[edge.id] = { id: edge.id, from: edge.from, to: edge.to, label: label, data: edge.data, isOptional: edge.isOptional, isTransitive: !edge.isTransitive };
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
                <Graph nodesInGraph={nodes} edgesInGraph={edges} setSelectedNode={setSelectedNode} setSelectedEdge={setSelectedEdge} setIsOpen={setIsOpen} toggleIsTransitive={toggleIsTransitive} />
                <div className={QueriesStyles.tray}>
                    <ResultTray edgeData={objectProperties} insideData={dataProperties} nodes={nodes} edges={edges} selectedNode={selectedNode} selectedEdge={selectedEdge} addEdge={addEdge} removeNode={removeNode} removeEdge={removeEdge} setIsOpen={setIsOpen} />
                </div>
            </div>
            <Modal insideData={dataProperties} selectedNode={selectedNode} isOpen={isOpen} setIsOpen={setIsOpen} setNode={setNode} />
        </div>
    );
}
export default Queries;
