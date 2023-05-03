import React, { useState } from "react";
import distinctColors from "distinct-colors";
import QueriesStyles from "./queries.module.css";
import Search from '../components/Search/search';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
import Modal from "../components/Modal/modal";

import varData from '../data/vars.json';
import nodeData from '../data/nodes.json';
import edgeData from '../data/inter_properties.json';
import insideData from '../data/intra_properties.json'

const colorList = {};
const palette = distinctColors({
    count: Object.keys(varData).length,
    chromaMin: 15,
    chromaMax: 95,
    lightMin: 65,
    lightMax: 90
})

for (let i = 0; i < Object.keys(varData).length; i++) {
    colorList[Object.keys(varData)[i]] = palette[i].hex();
}

// Main view. All functional elements will be shown here.

// TODO add transitive properties (recursive properties made by adding an * in SPARQL)
function Queries() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState();
    const [isOpen, setIsOpen] = useState(false);

    function addNode(id, data, type, isVar, graph) {
        var newId = 0;
        if (nodes.length > 0)
            newId = nodes.slice(-1)[0].id + 1;
        setNodes([...nodes, { id: newId, label: id, title: data, color: colorList[type], type: type, isVar: isVar, graph: graph }]);
        setSelectedNode({ id: newId, label: id, title: data, color: colorList[type], type: type, isVar: isVar, graph: graph });
    }

    function addEdge(id1, id2, label, data, isOptional) {
        setEdges([...edges, { from: id1, to: id2, label: label, data: data, isOptional: isOptional }]);
    }

    return (
        <span>
            <h1 className={QueriesStyles.queryHeader}>UMU - QUERIES</h1>
            <div className={QueriesStyles.queryContainer}>
                <div className={QueriesStyles.constraint_container}>
                    <Search varData={varData} nodeData={nodeData} colorList={colorList} isResults={false} addNode={addNode} />
                </div>
                <div className={QueriesStyles.graph_container}>
                    <Graph nodesInGraph={nodes} edgesInGraph={edges} setSelectedNode={setSelectedNode} setIsOpen={setIsOpen} />
                    <div className={QueriesStyles.tray}>
                        <ResultTray varData={varData} nodeData={nodeData} colorList={colorList} edgeData={edgeData} nodes={nodes} selectedNode={selectedNode} addEdge={addEdge} setIsOpen={setIsOpen} />
                    </div>
                </div>
            </div>
            {isOpen && selectedNode && <Modal insideData={insideData} selectedNode={selectedNode} setIsOpen={setIsOpen} addNode={addNode} />}
        </span >
    );
}
export default Queries;