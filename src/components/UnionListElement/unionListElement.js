import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import UnionListElementStyles from './unionListElement.module.css';

function UnionListElement({ id, label, setUnions }) {

    // TODO HEAVY FUNCTIONALLITY HERE
    const handleClick = (event) => {
        event.preventDefault();
        console.log(id + ' clicked');
    }

    const handleArrowClick = (event) => {
        event.stopPropagation();
        console.log('Adding ' + id);
    }

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setUnions(prevData => prevData.filter(item => item.id !== id));
    }

    return (
        <li className={UnionListElementStyles.element} onClick={e => handleClick(e)}>
            <button className={UnionListElementStyles.arrowBtn} onClick={handleArrowClick}>
                <ArrowLeft style={{ fontSize: '34px' }} />
            </button>
            <span>{label}</span>
            <button className={UnionListElementStyles.deleteBtn} onClick={handleDeleteClick}>
                <DeleteIcon style={{ color: 'white' }} />
            </button>
        </li>
    );
}

export default UnionListElement;
