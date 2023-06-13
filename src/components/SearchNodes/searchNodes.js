import React, { useState, useRef, useEffect } from "react";
import List from "../List/list";
import SearchNodesStyles from "./searchNodes.module.css";
import { handleFilteredNodeDataFetch } from "../../utils/petitionHandler.js";

function SearchNodes({ varData, colorList, addNode }) {
    const [searchField, setSearchField] = useState("");
    const [data, setData] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
        handleFilteredNodeDataFetch(searchField)
            .then((data) => setData(data))
            .catch((error) => {
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
                ref={searchRef}
                className={SearchNodesStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div
                className={SearchNodesStyles.dataContainer}
                style={{ overflowY: "auto", overflowX: "hidden", height: "calc(58% - 40px)" }}
            >
                <List varData={varData} filteredLists={data} colorList={colorList} addNode={addNode} />
            </div>
        </span>
    );
}

export default SearchNodes;
