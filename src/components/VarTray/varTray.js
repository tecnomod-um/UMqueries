import React from "react";
import List from "../List/list";
import VarTrayStyles from "./varTray.module.css";


function VarTray({ varData, colorList, addNode }) {
    const filteredLists = {};
    for (const [type, data] of Object.entries(varData)) {
        filteredLists[`VAR_${type}`] = data.label;
    }

    return (<div className={VarTrayStyles.dataContainer} style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(58% - 40px)' }}>
        <List varData={varData} filteredLists={filteredLists} colorList={colorList} addNode={addNode} />
    </div>);
}

export default VarTray
