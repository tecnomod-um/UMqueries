import React, { useState } from "react";
import axios from "axios";
import { parseQuery, parseResponse } from "../../utils/queryParser.js";
import SparqlQueryStyles from "./sparqlQuery.module.css";

const SparqlQuery = ({ endpoint, nodes, edges, startingVar, setResultData }) => {
    const proxyURL = ' http://localhost:8080/sparql';
    const [isLoading, setIsLoading] = useState(false);

    function inputValidator(startingVar) {
        if (!Object.keys(startingVar).length)
            return false;
        return true;
    }
    // TODO set data validation / prevent injection !!!
    const handleQuery = () => {
        if (inputValidator(startingVar)) {
            setIsLoading(true);
            let data = {
                endpoint: endpoint,
                query: parseQuery(nodes, edges, startingVar)
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
    }

    return (
        <button className={SparqlQueryStyles.big_button} onClick={handleQuery} disabled={isLoading}>
            {isLoading ? <div className={SparqlQueryStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;
