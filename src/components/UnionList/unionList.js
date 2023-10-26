import React from 'react';
import UnionListElement from '../UnionListElement/unionListElement';
import UnionListStyles from './unionList.module.css';

function UnionList({ unions, setUnions }) {
    return (
        <ul className={UnionListStyles.list}>
            {unions.map(union => <UnionListElement key={union.id} {...union} setUnions={setUnions} />)}
        </ul>
    );
}

export default UnionList;
