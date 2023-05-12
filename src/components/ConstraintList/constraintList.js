import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

// Displays both all the elements and their variables
function ConstraintList({ varData, filteredLists, colorList, addNode }) {
    function getCodeFromURI(uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }

    function listContent() {
        const result = [];

        Object.keys(varData).forEach(key => {
            if (`VAR_${key}` in filteredLists) {
                const constraint = filteredLists[`VAR_${key}`];
                result.push(
                    <Constraint
                        key={getCodeFromURI(constraint)}
                        id={`${key.toUpperCase()} variable`}
                        data={constraint}
                        type={key}
                        color={colorList[key]}
                        addNode={addNode}
                        isVar={true}
                        graph={varData[key].uri_graph}
                    />
                );
            }

            if (filteredLists[key].length !== 0) {
                const constraints = filteredLists[key];
                result.push(
                    constraints.map(constraint => (
                        <Constraint
                            key={getCodeFromURI(constraint.uri)}
                            id={constraint.label}
                            data={constraint.uri}
                            type={key}
                            color={colorList[key]}
                            addNode={addNode}
                            isVar={false}
                        />
                    ))
                );
            }
        });

        return result;
    }

    return (
        <ul className={ConstraintListStyles.constraintList}>
            {listContent()}
        </ul>
    );
}

export default ConstraintList;