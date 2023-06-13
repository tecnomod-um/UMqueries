import React, { useState, useRef } from "react";
import ResultTable from "../ResultTable/resultTable";
import SearchStyles from "./searchResults.module.css";

// Search functionality of the result table component
function SearchResults({ startingData, resultData }) {

    const [searchField, setSearchField] = useState("");
    const searchRef = useRef(null);

    const handleChange = e => setSearchField(e.target.value);

    function getFilteredList(elementList) {
        if (!elementList) return null;
        return elementList.filter((element) => {
            const searchFieldLower = searchField.toLowerCase();
            for (const field in element) {
                if (element.hasOwnProperty(field) &&
                    typeof element[field] === 'string' &&
                    element[field].toLowerCase().includes(searchFieldLower))
                    return true;
            }
            return false;
        });
    }

    let filteredResultLists = {};
    let placeholderText = "";

    if (startingData && resultData) {
        placeholderText = "Search by ";
        Object.keys(resultData).forEach(key => {
            filteredResultLists[key] = getFilteredList(resultData[key]);
            placeholderText = placeholderText + key + ", ";
        });
        placeholderText = placeholderText.slice(0, -2);
    }

    if (Object.keys(filteredResultLists).length === 0) {
        placeholderText = "No elements to display";
    }

    return (
        <span className={SearchStyles.search}>
            <input ref={searchRef}
                className={SearchStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div className={SearchStyles.dataContainer} style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(100% - 40px)' }}>
                <ResultTable filteredLists={filteredResultLists} minCellWidth={120} />
            </div>
        </span>
    );
}

export default SearchResults;
