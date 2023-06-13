import React from "react";
import ListStyles from "./list.module.css";
import ListElement from '../ListElement/listElement';

// Displays both all the elements and their variables
function List({ varData, filteredLists, colorList, addNode }) {
    if (!filteredLists) return null;
    function getCodeFromURI(uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }

    function listContent() {
        const result = [];

        Object.keys(varData).forEach(key => {
            if (`VAR_${key}` in filteredLists) {
                const element = filteredLists[`VAR_${key}`];
                result.push(
                    <ListElement
                        key={getCodeFromURI(element)}
                        id={key.toUpperCase()}
                        data={null}
                        type={key}
                        color={colorList[key]}
                        addNode={addNode}
                        isVar={true}
                        graph={varData[key].uri_graph}
                    />
                );
            }

            if (filteredLists[key] && filteredLists[key].length !== 0) {
                const elements = filteredLists[key];
                result.push(
                    elements.map(constraint => (
                        <ListElement
                            key={getCodeFromURI(constraint.uri)}
                            id={constraint.label}
                            data={constraint.uri}
                            type={key}
                            color={colorList[key]}
                            addNode={addNode}
                            isVar={false}
                            graph={varData[key].uri_graph}
                        />
                    ))
                );
            }
        });

        return result;
    }

    return (
        <ul className={ListStyles.list}>
            {listContent()}
        </ul>
    );
}

export default List;