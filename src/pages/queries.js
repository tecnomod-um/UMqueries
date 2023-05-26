import React, { useState } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import Search from '../components/Search/search';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
import Modal from "../components/Modal/modal";
import { capitalizeFirst } from "../utils/stringFormatter.js";

import varData from '../data/vars.json';
import nodeData from '../data/nodes.json';
import edgeData from '../data/object_properties.json';
import insideData from '../data/data_properties.json'

const colorList = {};
const palette = distinctColors({
    count: Object.keys(varData).length,
    chromaMin: 15,
    chromaMax: 95,
    lightMin: 65,
    lightMax: 90
})

const initVarIDs = (varData) => Object.fromEntries(Object.keys(varData).map(type => [type, 0]));

// Main view. All functional elements will be shown here.
function Queries() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState();
    const [selectedEdge, setSelectedEdge] = useState();
    const [varIDs, setVarIDs] = useState(initVarIDs(varData));
    const [isOpen, setIsOpen] = useState(false);

    for (let i = 0; i < Object.keys(varData).length; i++) {
        colorList[Object.keys(varData)[i]] = palette[i].hex();
    }

    function addNode(id, data, type, isVar, graph) {
        let varID = -1;
        let label = id;
        let uri = data;
        if (isVar) {
            varID = varIDs[type];
            label += " " + varID;
            uri = '?' + capitalizeFirst(type) + '_' + varID + '_URI';
            setVarIDs(prevVarIDs => ({ ...prevVarIDs, [type]: prevVarIDs[type] + 1 }));
        }
        setNodes(nodes => {
            let newId = 0;
            if (nodes.length > 0)
                newId = nodes.slice(-1)[0].id + 1;
            return [...nodes, { id: newId, data: uri, label: label, color: colorList[type], type: type, varID: varID, graph: graph }];
        });
    }

    function addEdge(id1, id2, label, data, isOptional) {
        setEdges(edges => {
            let newId = 0;
            if (edges.length > 0)
                newId = edges.slice(-1)[0].id + 1;
            return [...edges, { id: newId, from: id1, to: id2, label: label, data: data, isOptional: isOptional, isTransitive: false }];
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
        let label = edge.label;
        edge.isTransitive ? label = label.slice(0, -1) : label = label + "*";
        let newEdges = [...edges];
        newEdges[edge.id] = { id: edge.id, from: edge.from, to: edge.to, label: label, data: edge.data, isOptional: edge.isOptional, isTransitive: !edge.isTransitive };
        setEdges(newEdges);
    }

    return (
        <div className={QueriesStyles.queryContainer}>
            <div className={QueriesStyles.constraint_container}>
                <Search varData={varData} nodeData={nodeData} colorList={colorList} isResults={false} addNode={addNode} />
            </div>
            <div className={QueriesStyles.graph_container}>
                <Graph nodesInGraph={nodes} edgesInGraph={edges} setSelectedNode={setSelectedNode} setSelectedEdge={setSelectedEdge} setIsOpen={setIsOpen} toggleIsTransitive={toggleIsTransitive} />
                <div className={QueriesStyles.tray}>
                    <ResultTray edgeData={edgeData} insideData={insideData} nodes={nodes} edges={edges} selectedNode={selectedNode} selectedEdge={selectedEdge} addEdge={addEdge} removeNode={removeNode} removeEdge={removeEdge} setIsOpen={setIsOpen} />
                </div>
            </div>
            {isOpen && selectedNode && <Modal insideData={insideData} selectedNode={selectedNode} setIsOpen={setIsOpen} setNode={setNode} />}
        </div>
    );
}
export default Queries;
