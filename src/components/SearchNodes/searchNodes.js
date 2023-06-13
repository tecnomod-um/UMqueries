import React, { useState, useEffect } from "react";
import List from "../List/list";
import SearchNodesStyles from "./searchNodes.module.css";
import { handleFilteredNodeDataFetch } from "../../utils/petitionHandler.js";

function SearchNodes({ varData, colorList, addNode }) {
    const [searchField, setSearchField] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setData(null);
        setIsLoading(true);
        handleFilteredNodeDataFetch(searchField)
            .then((data) => {
                setIsLoading(false);
                setData(data);
                console.log(data)
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    }, [searchField]);

    const handleChange = (e) => setSearchField(e.target.value);

    let placeholderText = "";

    if (varData) {
        placeholderText = "Search by ";
        Object.keys(varData).forEach((key) => {
            placeholderText = placeholderText + key + ", ";
        });
        placeholderText = placeholderText.slice(0, -2);
    } else {
        placeholderText = "No elements to display";
    }

    return (
        <span className={SearchNodesStyles.search}>
            <input
                className={SearchNodesStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div
                className={SearchNodesStyles.dataContainer}
                style={{ overflowY: "auto", overflowX: "hidden", height: "calc(58% - 40px)" }}
            >
                {isLoading && !data ? (
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