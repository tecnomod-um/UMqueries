import React, { useState } from 'react';
import styles from './checkbox.module.css';

const Checkbox = ({ label, labelClassName, checked: checkedProp, onChange, ...props }) => {
    const [checked, setChecked] = useState(checkedProp);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (onChange) onChange(e);
    };

    return (
        <label className={styles.checkboxContainer}>
            {label && <span className={`${styles.checkboxLabel} ${labelClassName || ''}`}>{label}</span>}
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className={styles.checkboxInput}
                {...props}
            />
            <span className={styles.checkmark}></span>
        </label>
    );
}

export default Checkbox;
