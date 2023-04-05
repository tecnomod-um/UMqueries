import React from "react";
import QueriesStyles from "./queries.module.css";
import Search from '../components/Search/search';
import searchElements from '../data/data.json';
import VisGraph from "../components/VisGraph/visGraph";
import ResultTray from "../components/ResultTray/resultTray";
const elements = searchElements.elements;

// Main view
function Queries() {
    return (
        <span>
            <h1>UMU - QUERIES</h1>
            <div className={QueriesStyles.container}>
                <div className={QueriesStyles.constraint_container}>
                    <Search details={elements} />
                </div><div className={QueriesStyles.graph_container}>
                    <div className={QueriesStyles.graph}>
                        <VisGraph></VisGraph>
                    </div>
                    <div className={QueriesStyles.tray}>
                        <ResultTray></ResultTray>
                    </div>
                </div>
            </div>
        </span >
    );
}
export default Queries;