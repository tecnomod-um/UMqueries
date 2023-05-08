import React, { useState } from 'react';
import axios from "axios";
import { parseQuery, parseResponse } from "./queryParser.js";
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ endpoint, nodeData, edgeData, startingVar, setResultData }) => {
    const proxyURL = ' http://localhost:8080/sparql';
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = () => {
        setIsLoading(true);
        let data = {
            endpoint: endpoint,
            query: parseQuery(nodeData, edgeData, startingVar)
        }
        axios({
            method: 'post',
            url: proxyURL,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (response) {
                setResultData(parseResponse(response));
                setIsLoading(false);
            })
            .catch(function (response) {
                // TODO handle error
                console.log(response);
                setResultData(null);
                setIsLoading(false);
            });
    }

    return (
        <button className={SparqlQueryStyles.big_button} onClick={handleQuery} disabled={isLoading}>
            {isLoading ? <div className={SparqlQueryStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;