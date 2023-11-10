import React, { useState, useMemo, useCallback } from "react";
import ResultTable from "../ResultTable/resultTable";
import ResultWindow from "../ResultWindow/resultWindow";
import SearchStyles from "./searchResults.module.css";
import OpenNewIcon from "@mui/icons-material/OpenInNew";

function SearchResults({ resultData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showResultsWindow, setShowResultWindow] = useState(false);

    const handleChange = e => setSearchTerm(e.target.value.toLowerCase());

    const handleOpenNewWindow = () => {
        setShowResultWindow(true);
    };

    const handleCloseNewWindow = useCallback(() => {
        setShowResultWindow(false);
    }, []);

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
            <span className={`${SearchStyles.resultCount} ${Object.values(filteredResult)[0]?.length > 0 ? SearchStyles.shown : ""}`}>
                {Object.values(filteredResult)[0]?.length}
            </span>
            {Object.values(filteredResult).some(array => array.length > 0) && (
                <button className={SearchStyles.openButton} onClick={handleOpenNewWindow}>
                    <OpenNewIcon />
                </button>
            )}
            {showResultsWindow && <ResultWindow results={filteredResult} onClose={handleCloseNewWindow} />}
            <div className={SearchStyles.dataContainer}>
                <ResultTable filteredLists={filteredResult} minCellWidth={120} />
            </div>
        </span>
    );
}

export default SearchResults;
