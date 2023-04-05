import React, { useState } from 'react';
import Scroll from '../Scroll/scroll';
import ConstraintList from '../ConstraintList/constraintList';
import SearchStyles from "./search.module.css";

function Search({ details }) {
    const [searchField, setSearchField] = useState("");
    const filteredElements = details.filter(
        element => {
            return (
                element
                    .name
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                element
                    .email
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
            <Scroll>
                <ConstraintList filteredElements={filteredElements} />
            </Scroll>
        );
    }

    return (
        <section className={SearchStyles.search}>
            <div className="pa2">
                <input
                    className={SearchStyles.input}
                    type="search"
                    placeholder="Search proteins, genes, illneses..."
                    onChange={handleChange}
                />
            </div>
            {constraintList()}
        </section>
    );
}

export default Search;