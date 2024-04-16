import React from "react";
import ListStyles from "./list.module.css";
import ListElement from '../ListElement/listElement';
import { getItemFromURI } from "../../utils/stringFormatter";

// Displays both all the elements and their variables
function List({ varData, filteredLists, colorList, addNode }) {
    if (!filteredLists) return null;

    function listContent() {
        const result = [];

        Object.keys(varData).forEach((key) => {
            if (`VAR_${key}` in filteredLists) {
                result.push(
                    <ListElement
                        key={`VAR_${key}`}
                        id={key.toUpperCase()}
                        data={null}
                        type={key}
                        color={colorList[key]}
                        isVar={true}
                        graph={varData[key].uri_graph}
                        classURI={varData[key].uri_element}
                        addNode={addNode}
                    />
                );
            }

            if (filteredLists[key] && filteredLists[key].length !== 0) {
                const elements = filteredLists[key];
                result.push(
                    elements.map((constraint, idx) => (
                        <ListElement
                            key={`${getItemFromURI(constraint.uri)}_${key}_${idx}`}
                            id={constraint.label}
                            data={constraint.uri}
                            type={key}
                            color={colorList[key]}
                            isVar={false}
                            graph={varData[key].uri_graph}
                            classURI={varData[key].uri_element}
                            addNode={addNode}
                        />
                    ))
                );
            }
        });

        return result.flat().sort((a, b) => {
            const labelA = a.props.id.toLowerCase();
            const labelB = b.props.id.toLowerCase();
            return labelA.localeCompare(labelB);
        });
    }

    return (
        <ul className={ListStyles.list}>
            {listContent()}
        </ul>
    );
}

export default List;
