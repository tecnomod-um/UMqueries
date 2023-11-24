import React, { useState } from "react";
import { handleQuery } from "../../utils/petitionHandler.js";
import QueryButtonStyles from "./queryButton.module.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const QueryButton = ({ graphs, activeGraphId, bindings, startingVar, setResultData }) => {
    const [isLoading, setIsLoading] = useState(false);

    function inputValidator(startingVar) {
        const somePropIsShown = graphs.find(graph => graph.id === activeGraphId).nodes.some(node => Object.values(node.properties).some(prop => prop.show));
        const startingVarIsEmpty = Object.keys(startingVar).length;
        const someBindingIsShown = bindings.some(binding => binding.showInResults);
        if (!startingVarIsEmpty || somePropIsShown || someBindingIsShown)
            return true;
        return false;
    }

    const sendQuery = () => {
        if (inputValidator(startingVar)) {
            handleQuery(graphs, activeGraphId, startingVar, setIsLoading)
                .then(result => {
                    setResultData(result);
                })
                .catch(error => {
                    console.log(error);
                    setResultData(null);
                });
        }
    }

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

export default QueryButton;
