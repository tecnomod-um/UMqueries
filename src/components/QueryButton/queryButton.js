import React, { useState } from "react";
import { handleQuery } from "../../utils/petitionHandler.js";
import QueryButtonStyles from "./queryButton.module.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const SparqlQuery = ({ nodes, edges, bindings, startingVar, setResultData }) => {
    const [isLoading, setIsLoading] = useState(false);

    function inputValidator(startingVar) {
        if (!Object.keys(startingVar).length)
            return false;
        return true;
    }

    const sendQuery = () => {
        if (inputValidator(startingVar) || bindings.some(binding => binding.showInResults)) {
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
            {isLoading ? (
                <div className={QueryButtonStyles.loader}></div>) : (
                <>
                    <span className={QueryButtonStyles.queryText}>Query</span>
                    <PlayCircleOutlineIcon className={QueryButtonStyles.queryIcon} />
                </>
            )}
        </button>
    );
};

export default SparqlQuery;
