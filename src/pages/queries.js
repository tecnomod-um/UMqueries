import React, { useState } from "react";
import QueriesStyles from "./queries.module.css";
import nodeData from '../data/nodes.json';
import edgeData from '../data/inter_properties.json';
import Search from '../components/Search/search';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";

const genes = nodeData.gene;
const proteins = nodeData.protein;
const crms = nodeData.crm;
const tads = nodeData.tad;
const omims = nodeData.omim;
const gos = nodeData.go;
const mis = nodeData.mi;

// Main view
function Queries() {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState();

    function addNode(id, data, type) {
        var newId = 0;
        if (nodes.length > 0)
            newId = nodes.slice(-1)[0].id + 1;
        var nodeColor;
        switch (type) {
            case 'gene':
                nodeColor = "#ef4444";
                break;
            case 'protein':
                nodeColor = "#88C6ED";
                break;
            case 'crm':
                nodeColor = "#82C341";
                break;
            case 'tad':
                nodeColor = "#FAA31B";
                break;
            case 'omim':
                nodeColor = "#FFF000";
                break;
            case 'go':
                nodeColor = "#f095eb";
                break;
            case 'mi':
                nodeColor = "#d9d3d0";
                break;
            default:
                break;
        }
        setNodes([...nodes, { id: newId, label: id, title: data, color: nodeColor, type: type }]);
        //setEdges([...edges, { from: nodes.slice(-1)[0].id, to: newId }]);
        setSelectedNode({ id: newId, label: id, title: data, color: nodeColor, type: type });
    }

    function addEdge(id1, id2, label, data, isOptional) {
        setEdges([...edges, { from: id1, to: id2, label: label, data: data , isOptional: isOptional}]);
    }

    return (
        <span>
            <h1>UMU - QUERIES</h1>
            <div className={QueriesStyles.container}>
                <div className={QueriesStyles.constraint_container}>
                    <Search genes={genes} proteins={proteins} crms={crms} tads={tads} omims={omims} gos={gos} mis={mis} addNode={addNode} />
                </div><div className={QueriesStyles.graph_container}>
                    <div className={QueriesStyles.graph}>
                        <Graph nodes={nodes} edges={edges} selectedNode={selectedNode} setSelectedNode={setSelectedNode} ></Graph>
                    </div>
                    <div className={QueriesStyles.tray}>
                        <ResultTray nodes={nodes} selectedNode={selectedNode} edgeData={edgeData} addNode={addNode} addEdge={addEdge}></ResultTray>
                    </div>
                </div>
            </div>
        </span >
    );
}
export default Queries;