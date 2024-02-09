import React, { useState } from 'react';
import styles from './checkbox.module.css';

const Checkbox = ({ label, labelClassName, checked, onChange, ...props }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e) => {
        setIsChecked(e.target.checked);
        if (onChange) onChange(e);
    };

    return (
        <label className={styles.checkboxContainer}>
            {label && <span className={`${styles.checkboxLabel} ${labelClassName || ''}`}>{label}</span>}
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                className={styles.checkboxInput}
                {...props}
            />
            <span className={styles.checker}></span>
        </label>
    );
}

export default Checkbox;
