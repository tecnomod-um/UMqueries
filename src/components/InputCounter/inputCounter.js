import React, { useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
            width: isCountTrayOpen ? '600px' : '30px',
            maxWidth: '90%',
            height: '40px',
            backgroundColor: '#f1f1f1',
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
        },
        checkbox: {
            marginRight: '5px',
        },
        countDisplay: {
            margin: '0 5px',
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
                {isCountTrayOpen ? <ChevronRightIcon sx={styles.iconStyle} /> : <ChevronLeftIcon sx={styles.iconStyle} />}
            </div>
            <div style={styles.inputRow}>
                <input
                    style={styles.input}
                    placeholder="Search..."
                    onChange={e => setSearchTerm(e.target.value)}
                />
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
                <span style={styles.countDisplay}>Count: {countResults()}</span>
            </div>
        </div>
    );
}

export default InputCounter;
