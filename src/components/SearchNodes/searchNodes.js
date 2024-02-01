import React, { useState, useEffect } from "react";
import List from "../List/list";
import SearchNodesStyles from "./searchNodes.module.css";
import { debounceFilteredNodeData } from "../../utils/petitionHandler.js";

function SearchNodes({ varData, colorList, addNode }) {
    const [searchField, setSearchField] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchField.length >= 3 || !data || searchField === '') {
            debounceFilteredNodeData()(searchField, data, setData, setIsLoading);
        }
    }, [searchField, data]);

    const handleChange = (e) => setSearchField(e.target.value);

    let placeholderText = "";

    if (true) {// TODO implement indexes to speed up nodes
        placeholderText = "Node search is disabled temporally"
    } else
        if (varData) {
            if (Object.keys(varData).length === 0) placeholderText = "No nodes detected";
            else {
                placeholderText = "Search by ";
                Object.keys(varData).forEach((key) => {
                    placeholderText = placeholderText + key + ", ";
                });
                placeholderText = placeholderText.slice(0, -2);

            }
        } else {
            placeholderText = "No elements to display";
        }

    return (
        <span className={SearchNodesStyles.search}>
            <input
                className={SearchNodesStyles.input}
                type="search"
                disabled={true} // TODO implement indexes to speed up nodes
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div
                className={SearchNodesStyles.dataContainer}
                style={{ overflowY: "auto", overflowX: "hidden", height: "calc(58% - 40px)" }}
            >
                {isLoading ? (
                    <div className={SearchNodesStyles.loader}>
                        <div className={SearchNodesStyles.dot}></div>
                        <div className={SearchNodesStyles.dot}></div>
                        <div className={SearchNodesStyles.dot}></div>
                    </div>
                ) : (
                    <List varData={varData} filteredLists={data} colorList={colorList} addNode={addNode} />
                )}
            </div>
        </span>
    );
}

export default SearchNodes;
