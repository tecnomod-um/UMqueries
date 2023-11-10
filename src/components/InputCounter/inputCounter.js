import React, { useState } from "react";
import SvgIcon from '@mui/material/SvgIcon';

const CustomChevronRightIcon = () => (
    <SvgIcon>
        <path fill="white" d="M9.29 6.71a1 1 0 000 1.41L13.17 12l-3.88 3.88a1 1 0 101.41 1.41l4.59-4.59a1 1 0 000-1.41l-4.59-4.59a1 1 0 00-1.41 0z" />
    </SvgIcon>
);

const CustomChevronLeftIcon = () => (
    <SvgIcon>
        <path fill="white" d="M14.71 6.71a1 1 0 010 1.41L10.83 12l3.88 3.88a1 1 0 01-1.41 1.41l-4.59-4.59a1 1 0 010-1.41l4.59-4.59a1 1 0 011.41 0z" />
    </SvgIcon>
);

function InputCounter({ results }) {
    const [isCountTrayOpen, setIsCountTrayOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [exactMatch, setExactMatch] = useState(false);
    // css styles need to be defined MANUALLY when opening in a new window with inlines
    const [hover, setHover] = useState(false);

    const countResults = () => {
        let count = 0;
        if (!searchTerm) return 0;
        Object.values(results).forEach(arr => {
            arr.forEach(item => {
                let itemToCheck = caseSensitive ? item : item.toLowerCase();
                let termToCheck = caseSensitive ? searchTerm : searchTerm.toLowerCase();
                if (exactMatch ? itemToCheck === termToCheck : itemToCheck.includes(termToCheck)) {
                    count++;
                }
            });
        });
        return count;
    };

    const styles = {
        tray: {
            position: 'fixed',
            top: 0,
            right: 0,
            width: isCountTrayOpen ? '650px' : '30px',
            maxWidth: '90%',
            height: '40px',
            backgroundColor: '#e9e9e9',
            transition: 'width 0.3s ease-in-out',
            boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px 0 0 10px',
            outline: '2px solid darkgray',
            overflow: 'hidden',
        },
        tab: {
            minWidth: '30px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px 0 0 10px',
            cursor: 'pointer',
            backgroundColor: hover ? '#e63946' : '#c22535',
            borderRight: '3px solid #c22535',
            boxShadow: hover ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
        },
        iconStyle: {
            color: 'white',
        },
        inputRow: {
            display: 'flex',
            alignItems: 'center',
            padding: '5px',
            transition: 'opacity 0.3s ease',
            opacity: isCountTrayOpen ? 1 : 0,
        },
        input: {
            padding: '5px 10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: 1,
        },
        checkboxLabel: {
            display: 'flex',
            alignItems: 'center',
            margin: '0 5px',
            textAlign: 'center',
            padding: '0.4em 0.5em',
            backgroundColor: '#f3f3f3',
            borderRadius: '5px',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
        },
        checkbox: {
            margin: '-2px 5px -2px -2px',
            height: '20px',
            width: '20px',
            backgroundColor: '#fff',
        },
        countDisplay: {
            margin: '0 5px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0.4em 0.5em',
            backgroundColor: '#f3f3f3',
            borderRadius: '5px',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
        }
    };

    return (
        <div style={styles.tray}>
            <div
                style={styles.tab}
                onClick={() => setIsCountTrayOpen(!isCountTrayOpen)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {isCountTrayOpen
                    ? <CustomChevronRightIcon />
                    : <CustomChevronLeftIcon />
                }
            </div>
            <div style={styles.inputRow}>
                <input
                    style={styles.input}
                    placeholder="Search..."
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <span style={styles.countDisplay}>Count: {countResults()}</span>
                <label style={styles.checkboxLabel}>
                    <input
                        style={styles.checkbox}
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={() => setCaseSensitive(prev => !prev)}
                    />
                    Case Sensitive
                </label>
                <label style={styles.checkboxLabel}>
                    <input
                        style={styles.checkbox}
                        type="checkbox"
                        checked={exactMatch}
                        onChange={() => setExactMatch(prev => !prev)}
                    />
                    Exact Match
                </label>
            </div>
        </div>
    );
}

export default InputCounter;
