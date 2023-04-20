import React, { useState } from 'react';
import ConstraintList from '../ConstraintList/constraintList';
import SearchStyles from "./search.module.css";

// Search functionality of the list component
function Search({ varData, nodeData, colorList, height, addNode }) {
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

    var filteredConstraintLists = {};
    var placeholderText = "Search by ";
    if (varData) {
        Object.keys(varData).forEach(key => {
            filteredConstraintLists["VAR_" + key] = varData[key];
            filteredConstraintLists[key] = getFilteredList(nodeData[key]);
            placeholderText = placeholderText + key + ", ";
        });
        placeholderText = placeholderText.slice(0, -2);
    } else placeholderText = "Empty list";
    function constraintList() {
        return (
            <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', overflowX: 'hidden', height: height }}>
                <ConstraintList keyList={Object.keys(varData)} filteredLists={filteredConstraintLists} colorList={colorList} addNode={addNode} />
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