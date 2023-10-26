import { React, useState } from 'react';
import UnionTrayStyles from './unionTray.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UnionList from '../UnionList/unionList';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';

function UnionTray({ unions, setUnions, isUnionTrayOpen, toggleUnionTray }) {
    const [graphLabel, setGraphLabel] = useState('');
    const [error, showError] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addUnion();
        }
    }

    const addUnion = () => {
        if ((!graphLabel.trim()) || (unions.some(graph => graph.label === graphLabel))) {
            showError(true);
            return;
        }
        const newId = (Math.max(...unions.map(item => Number(item.id))) + 1).toString();
        setUnions([...unions, { id: newId, label: graphLabel }]);
        setGraphLabel('');
        showError(false);
    }

    return (
        <div className={isUnionTrayOpen ? `${UnionTrayStyles.unionTray} ${UnionTrayStyles.open}` : UnionTrayStyles.unionTray}>
            <div className={UnionTrayStyles.tab} onClick={toggleUnionTray}>
                {isUnionTrayOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </div>
            {isUnionTrayOpen && (
                <div className={UnionTrayStyles.content}>
                    <div className={UnionTrayStyles.header}>
                        <input
                            className={UnionTrayStyles.unionInput}
                            placeholder="Define new graph"
                            value={graphLabel}
                            onChange={e => setGraphLabel(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {error && <CloseIcon className={UnionTrayStyles.errorIcon} />}
                        <button className={UnionTrayStyles.addButton} onClick={addUnion}>
                            <AddIcon />
                        </button>
                    </div>
                    <UnionList unions={unions} setUnions={setUnions} />
                </div>
            )}
        </div>
    );
}

export default UnionTray;
