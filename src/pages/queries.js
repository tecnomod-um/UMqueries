import React, { useState } from "react";
import QueriesStyles from "./queries.module.css";
import searchElements from '../data/data.json';
import Search from '../components/Search/search';
import Graph from '../components/Graph/graph';
import ResultTray from "../components/ResultTray/resultTray";
const elements = searchElements.elements;

// Main view
function Queries() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    function addNode(nodeLabel, nodeTitle) {
        var newId = 0;
        if (nodes.length > 0)
            newId = nodes.slice(-1)[0].id + 1;
        setNodes([...nodes, { id: newId, label: nodeLabel, title: nodeTitle }]);
        //setEdges([...edges, { from: nodes.slice(-1)[0].id, to: newId }]);
    }

    return (
        <span>
            <h1>UMU - QUERIES</h1>
            <div className={QueriesStyles.container}>
                <div className={QueriesStyles.constraint_container}>
                    <Search details={elements} addNode={addNode} />
                </div><div className={QueriesStyles.graph_container}>
                    <div className={QueriesStyles.graph}>
                        <Graph nodes={nodes} edges={edges}></Graph>
                    </div>
                    <div className={QueriesStyles.tray}>
                        <ResultTray addNode={addNode}></ResultTray>
                    </div>
                </div>
            </div>
        </span >
    );
}
export default Queries;