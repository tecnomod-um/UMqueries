import React, { useState, useEffect } from "react";
import List from "../List/list";
import VarTrayStyles from "./varTray.module.css";

function VarTray({ varData, colorList, addNode }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredLists, setFilteredLists] = useState({});

    useEffect(() => {
        const newFilteredLists = {};
        for (const [type, data] of Object.entries(varData)) {
            const label = data.label.toLowerCase();
            if (label.includes(searchTerm.toLowerCase())) {
                newFilteredLists[`VAR_${type}`] = data.label;
            }
        }
        setFilteredLists(newFilteredLists);
    }, [varData, searchTerm]);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    return (
        <span className={VarTrayStyles.varTray}>
            <input
                type="input"
                className={VarTrayStyles.input}
                placeholder="Search variables"
                value={searchTerm}
                onChange={handleChange}
            />
            <div className={VarTrayStyles.dataContainer} style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(110% - 40px)' }}>
                <List varData={varData} filteredLists={filteredLists} colorList={colorList} addNode={addNode} />
            </div>
        </span>
    );
}

export default VarTray;
