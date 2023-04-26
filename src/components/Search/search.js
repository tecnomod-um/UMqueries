import React, { useState } from 'react';
import ConstraintList from '../ConstraintList/constraintList';
import ResultTable from '../ResultList/resultTable';
import ResultTableContent from '../ResultList/resultTableContent';

import SearchStyles from "./search.module.css";

// Search functionality of the list component
// The same functionallity is shared between both tables
function Search({ varData, nodeData, colorList, isResults, addNode }) {
    const [searchField, setSearchField] = useState("");

    const handleChange = e => {
        setSearchField(e.target.value);
    }

    function getFilteredList(elementList) {
        return (elementList.filter(
            element => {
                return (
                    element
                        .uri
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    element
                        .label
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                )
            }
        ))
    }

    function isVarIncludedInFilter(key) {
        var keyLabel = key + " variable";
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

    var filteredConstraintLists = {};
    var placeholderText = "Search by ";

    if (varData) {
        Object.keys(varData).forEach(key => {
            // Vars wont be added on the result table
            if (isVarIncludedInFilter(key) && !isResults)
                filteredConstraintLists["VAR_" + key] = varData[key].label;

            filteredConstraintLists[key] = getFilteredList(nodeData[key]);
            placeholderText = placeholderText + key + ", ";
        });
        placeholderText = placeholderText.slice(0, -2);
    } else placeholderText = "No elements to display";

    function constraintList() {
        // Return results component
        if (isResults)
            return (
                <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', overflowX: 'hidden', height: "20vh" }}>
                    <ResultTable minCellWidth={120} tableContent={<ResultTableContent />} />

                    {/*
                    <ConstraintList varData={varData} filteredLists={filteredConstraintLists} colorList={colorList} addNode={addNode} />

            */}
                </div>
            );
        // Return node list component
        return (
            <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', overflowX: 'hidden', height: "75vh" }}>
                <ConstraintList varData={varData} filteredLists={filteredConstraintLists} colorList={colorList} addNode={addNode} />
            </div>
        );
    }

    return (
        <section className={SearchStyles.search}>
            <input
                className={SearchStyles.input}
                type="search"
                placeholder={placeholderText}
                onChange={handleChange}
            />
            {constraintList()}
        </section>
    );
}

export default Search;