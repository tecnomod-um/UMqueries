import React, { useState } from 'react';
import ConstraintList from '../ConstraintList/constraintList';
import SearchStyles from "./search.module.css";

function Search({ details, onElementClick}) {
    const [searchField, setSearchField] = useState("");
    const filteredElements = details.filter(
        element => {
            return (
                element
                    .id
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                element
                    .prefix
                    .toLowerCase()
                    .includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = e => {
        setSearchField(e.target.value);
    };

    function constraintList() {
        return (
            <div className={SearchStyles.scroll} style={{ overflowY: 'scroll', height: '70vh' }}>
                <ConstraintList filteredElements={filteredElements} onElementClick={onElementClick}/>
            </div>
        );
    }

    return (
        <section className={SearchStyles.search}>
                <input
                    className={SearchStyles.input}
                    type="search"
                    placeholder="Search proteins, genes, illneses..."
                    onChange={handleChange}
                />
            {constraintList()}
        </section>
    );
}

export default Search;