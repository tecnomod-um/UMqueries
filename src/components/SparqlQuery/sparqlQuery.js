import React, { useState } from 'react';
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ url, sparqlQuery, setQueryResult }) => {
    const [data, setData] = useState({ data: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleQuery = async () => {
        setIsLoading(true);
        try {
            // Make SPARQL query API call to the given URL using fetch
            const response = await fetch(url + encodeURIComponent(sparqlQuery), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('result is: ', JSON.stringify(result, null, 4));


            // Update the query result in the state
            //setQueryResult(data.results.bindings.map(binding => binding.result.value));
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button className={SparqlQueryStyles.big_button} onClick={handleQuery} disabled={isLoading}>
            {isLoading ? <div className={SparqlQueryStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;