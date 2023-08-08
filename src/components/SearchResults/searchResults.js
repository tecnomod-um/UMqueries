import React, { useState, useMemo } from "react";
import ResultTable from "../ResultTable/resultTable";
import SearchStyles from "./searchResults.module.css";

function SearchResults({ resultData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const handleChange = e => setSearchTerm(e.target.value.toLowerCase());

    const filteredResult = useMemo(() => {
        let filteredResult = {};
        if (resultData) {
            Object.keys(resultData).forEach(key => {
                filteredResult[key] = resultData[key].filter((_, idx) => {
                    // Check if the searchTerm exists in any of the array entries at the current index
                    return Object.values(resultData).some(array =>
                        array[idx] && array[idx].toLowerCase().includes(searchTerm)
                    );
                });
            });
        }
        return filteredResult;
    }, [resultData, searchTerm]);

    const placeholderText = resultData
        ? `Search by ${Object.keys(resultData).join(", ")}`
        : "No elements to display";

    return (
        <span className={SearchStyles.search}>
            <input
                className={SearchStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div className={SearchStyles.dataContainer}>
                <ResultTable filteredLists={filteredResult} minCellWidth={120} />
            </div>
        </span>
    );
}

export default SearchResults;
