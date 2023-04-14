import React, { useState } from 'react';
import ConstraintList from '../ConstraintList/constraintList';
import SearchStyles from "./search.module.css";

function Search({ genes, proteins, crms, tads, omims, gos, mis, addNode }) {
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

    function constraintList() {
        return (
            <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
                <ConstraintList filteredGenes={getFilteredList(genes)} filteredProteins={getFilteredList(proteins)} filteredCRMs={getFilteredList(crms)} filteredTADs={getFilteredList(tads)} filteredOmims={getFilteredList(omims)} filteredGOs={getFilteredList(gos)} filteredMIs={getFilteredList(mis)} addNode={addNode} />
            </div>
        );
    }

    return (
        <section className={SearchStyles.search}>
            <input
                className={SearchStyles.input}
                type="search"
                placeholder="Search proteins, genes, diseases..."
                onChange={handleChange}
            />
            {constraintList()}
        </section>
    );
}

export default Search;