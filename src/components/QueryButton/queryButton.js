import React, { forwardRef, useState } from "react";
import { handleQuery } from "../../utils/petitionHandler.js";
import QueryButtonStyles from "./queryButton.module.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const QueryButton = forwardRef(({ graphs, activeGraphId, bindings, startingVar, isDistinct, isCount, setResultData, onValidationError, showResultsSmallViewport }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    function inputValidator(graphs, startingVar) {
        const somePropIsShown = graphs.find(graph => graph.id === activeGraphId).nodes.some(node => Object.values(node.properties).some(prop => prop.show));
        const startingVarIsEmpty = Object.keys(startingVar)?.length <= 0;
        const someBindingIsShown = bindings.some(binding => binding.showInResults);
        return !startingVarIsEmpty || somePropIsShown || someBindingIsShown;
    }

    const sendQuery = () => {
        if (inputValidator(graphs, startingVar)) {
            handleQuery(graphs, activeGraphId, startingVar, isDistinct, isCount, setIsLoading)
                .then(result => {
                    setResultData(result);
                    showResultsSmallViewport();
                })
                .catch(error => {
                    console.log(error);
                    setResultData(null);
                });
        } else
            onValidationError("No output selected.");
    }

    return (
        <button ref={ref} className={QueryButtonStyles.big_button} onClick={() => {
            sendQuery();
        }} disabled={isLoading}>
            {isLoading ? <div className={QueryButtonStyles.loader}></div> : (
                <>
                    <span className={QueryButtonStyles.queryText}>Query</span>
                    <PlayCircleOutlineIcon className={QueryButtonStyles.queryIcon} />
                </>
            )}
        </button>
    );
})

export default QueryButton;
