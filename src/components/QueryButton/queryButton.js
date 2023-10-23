import React, { useState } from "react";
import { handleQuery } from "../../utils/petitionHandler.js";
import QueryButtonStyles from "./queryButton.module.css";

// Sends current query to backend
const SparqlQuery = ({ nodes, edges, bindings, startingVar, setResultData }) => {
    const [isLoading, setIsLoading] = useState(false);

    function inputValidator(startingVar) {
        if (!Object.keys(startingVar).length)
            return false;
        return true;
    }

    const sendQuery = () => {
        if (inputValidator(startingVar)) {
            handleQuery(nodes, edges, bindings, startingVar, setIsLoading)
                .then(result => {
                    setResultData(result);
                })
                .catch(error => {
                    console.log(error);
                    setResultData(null);
                });
        }
    };
    
    return (
        <button className={QueryButtonStyles.big_button} onClick={() => sendQuery()} disabled={isLoading}>
            {isLoading ? <div className={QueryButtonStyles.loader}></div> : 'Query'}
        </button>
    );
};

export default SparqlQuery;
