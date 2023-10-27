import React from 'react';
import UnionListElement from '../UnionListElement/unionListElement';
import UnionListStyles from './unionList.module.css';

function UnionList({ graphs, changeActiveGraph, isGraphLoop, addGraphNode, removeGraph }) {
    return (
        <ul className={UnionListStyles.list}>
            {graphs.map(graph =>
                <UnionListElement
                    key={graph.id}
                    id={graph.id}
                    label={graph.label}
                    removeDisabled={graphs.length <= 1}
                    changeActiveGraph={changeActiveGraph}
                    isGraphLoop={isGraphLoop}
                    addGraphNode={addGraphNode}
                    removeGraph={removeGraph}
                />
            )}
        </ul>
    );
}

export default UnionList;
