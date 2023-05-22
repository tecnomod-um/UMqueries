import React, { useState, useRef } from "react";
import ConstraintList from "../ConstraintList/constraintList";
import ResultTable from "../ResultTable/resultTable";
import SearchStyles from "./search.module.css";

// Search functionality of the list component
// The same functionality is shared between both the result table and the constraint in the UI
function Search({ varData, nodeData, colorList, isResults, addNode }) {
    const [searchField, setSearchField] = useState("");
    const searchRef = useRef(null);

    const handleChange = e => {
        setSearchField(e.target.value);
    }

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


    // Takes generated vars into account if necessary
    function isVarIncludedInFilter(key) {
        let keyLabel = key + " variable";
        return (
            keyLabel
                .toLowerCase()
                .includes(searchField.toLowerCase()) ||
            varData[key]
                .label
                .toLowerCase()
                .includes(searchField.toLowerCase())
        )
    }

    let filteredConstraintLists = {};
    let placeholderText = "";

    if (varData && nodeData) {
        placeholderText = "Search by ";
        Object.keys(nodeData).forEach(key => {
            if (isVarIncludedInFilter(key) && !isResults)
                filteredConstraintLists["VAR_" + key] = varData[key].label;
            filteredConstraintLists[key] = getFilteredList(nodeData[key]);
            placeholderText = placeholderText + key + ", ";
        });
        placeholderText = placeholderText.slice(0, -2);
    }

    if (Object.keys(filteredConstraintLists).length === 0) {
        placeholderText = "No elements to display";
    }

    function dataElementToDisplay() {
        // Results will be displayed
        if (isResults)
            return (<ResultTable filteredLists={filteredConstraintLists} minCellWidth={120} />);
        // Constraint list will be displayed
        return (<ConstraintList varData={varData} filteredLists={filteredConstraintLists} colorList={colorList} addNode={addNode} />);
    }

    return (
        <span className={SearchStyles.search}>
            <input ref={searchRef}
                className={SearchStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            <div className={SearchStyles.dataContainer} style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(100% - 38px)' }}>
                {dataElementToDisplay()}
            </div>
        </span>
    );
}

export default Search;