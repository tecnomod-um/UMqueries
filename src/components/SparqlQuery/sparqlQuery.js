import React, { useState } from 'react';
import axios from "axios";
import { parse } from "./queryParser.js";
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ endpoint, nodeData, edgeData, setQueryResult }) => {
    const proxyURL = ' http://localhost:8080/sparql';
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = () => {
        setIsLoading(true);
        var data = {
            endpoint: endpoint,
            query: parse(nodeData, edgeData)
        }
        console.log(data);
        axios({
            method: 'post',
            url: proxyURL,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (response) {
                console.log(response.data);
                setQueryResult(response.data);
                setIsLoading(false);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    //
    //if (!queryResult) return null;
    return (
        <button className={SparqlQueryStyles.big_button} onClick={handleQuery} disabled={isLoading}>
            {isLoading ? <div className={SparqlQueryStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;