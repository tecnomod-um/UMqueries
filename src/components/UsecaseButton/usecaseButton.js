import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryContext } from '../../contexts/queryContext';
import styles from './usecaseButton.module.css';

function UsecaseButton({ fileName }) {
    const { loadQueryData } = useContext(QueryContext);
    const navigate = useNavigate();

    const handleClick = () => {
        fetch(`${process.env.PUBLIC_URL}/useCases/${fileName}`)
            .then(response => response.json())
            .then(data => {
                loadQueryData(data);
                navigate('/queries');
            })
            .catch(error => {
                console.error('Failed to load query data', error);
            });
    }

    const label = fileName.replace(/.json$/, '').replace(/_/g, ' ');

    return (
        <button className={styles.button} onClick={handleClick}>{`Load ${label} graph`}</button>
    );
}

export default UsecaseButton;
