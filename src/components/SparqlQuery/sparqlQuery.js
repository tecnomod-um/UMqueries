import React, { useState, useEffect } from 'react';
import axios from "axios";
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ url, sparqlQuery, queryResult, setQueryResult }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = () => {
        setIsLoading(true);
        axios
            .get('/api/http://ssb4.nt.ntnu.no:10022/sparql?default-graph-uri=&query=SELECT+%3Fs+%3Fp+%3Fo%0D%0AFROM+%3Chttp%3A%2F%2Frdf.biogateway.eu%2Fgraph%2Fgene%3E%0D%0AWHERE+%7B%0D%0A++%3Fs+%3Fp+%3Fo+.%0D%0A%7D+limit+50&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on')
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