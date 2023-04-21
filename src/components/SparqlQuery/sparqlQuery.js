import React, { useState, useEffect } from 'react';
import axios from "axios";
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ url, sparqlQuery, queryResult, setQueryResult }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = () => {
        setIsLoading(true);
        axios
            .get(url)
            .then((res) => {
                setQueryResult(res.data);
            });
        setIsLoading(false);
    }

    useEffect(handleQuery, []);

    //if (!queryResult) return null;
    return (
        <button className={SparqlQueryStyles.big_button} onClick={handleQuery} disabled={isLoading}>
            {isLoading ? <div className={SparqlQueryStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;