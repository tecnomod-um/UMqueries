import React, { useState } from "react";
import QueriesStyles from "./queries.module.css";
import nodes from '../data/nodes.json';
import edges from '../data/edges.json';
import Search from '../components/Search/search';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";

const genes = nodes.gene;
const proteins = nodes.protein;
const crms = nodes.crm;
const tads = nodes.tad;
const omims = nodes.omim;
const gos = nodes.ontology;
const mis = nodes.interaction;

const geneProperties = edges.gene;
const proteinProperties = edges.protein;
const crmProperties = edges.crm;
const tadProperties = edges.tad;
const omimProperties = edges.omim;
const goProperties = edges.go;
const miProperties = edges.mi;

// Main view
function Queries() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

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

        setNodes([...nodes, { id: newId, label: id, title: data, color: nodeColor, type: type}]);
        //setEdges([...edges, { from: nodes.slice(-1)[0].id, to: newId }]);
    }

    return (
        <span>
            <h1>UMU - QUERIES</h1>
            <div className={QueriesStyles.container}>
                <div className={QueriesStyles.constraint_container}>
                    <Search genes={genes} proteins={proteins} crms={crms} tads={tads} omims={omims} gos={gos} mis={mis} addNode={addNode} />
                </div><div className={QueriesStyles.graph_container}>
                    <div className={QueriesStyles.graph}>
                        <Graph nodes={nodes} edges={edges}></Graph>
                    </div>
                    <div className={QueriesStyles.tray}>
                        <ResultTray geneProperties={geneProperties} proteinProperties={proteinProperties} crmProperties={crmProperties} tadProperties={tadProperties} omimProperties={omimProperties} goProperties={goProperties} miProperties={miProperties} addNode={addNode}></ResultTray>
                    </div>
                </div>
            </div>
        </span >
    );
}
export default Queries;