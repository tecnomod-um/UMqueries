import React, { useState } from 'react';
import ConstraintList from '../ConstraintList/constraintList';
import SearchStyles from "./search.module.css";

// Search functionality of the list component
function Search({ varData, nodeData, addNode }) {
    const [searchField, setSearchField] = useState("");

    const handleChange = e => {
        setSearchField(e.target.value);
    }

    function getFilteredList(elementList) {
        return (elementList.filter(
            element => {
                return (
                    element
                        .id
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    element
                        .uri
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                )
            }
        ))
    }

    var filteredConstraintLists = {};
    var placeholderText = "Search by ";

    Object.keys(varData).forEach(key => {
        filteredConstraintLists["VAR_"+key] = varData[key];
        filteredConstraintLists[key] = getFilteredList(nodeData[key]);
        placeholderText = placeholderText + key + ", ";
    });
    placeholderText = placeholderText.slice(0, -2);

    function constraintList() {
        return (
            <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
                <ConstraintList keyList={Object.keys(varData)} filteredLists={filteredConstraintLists} addNode={addNode} />
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