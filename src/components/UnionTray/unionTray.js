import { React, useState } from 'react';
import UnionTrayStyles from './unionTray.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UnionList from '../UnionList/unionList';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';

function UnionTray({ activeGraphId, graphs, isGraphLoop, addGraph, removeGraph, changeActiveGraph, addGraphNode, isUnionTrayOpen, toggleUnionTray }) {
    const [graphLabel, setGraphLabel] = useState('');
    const [error, showError] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addGraphEntry();
        }
    }

    const addGraphEntry = () => {
        if ((!graphLabel.trim()) || (graphs.some(graph => graph.label === graphLabel))) {
            showError(true);
            return;
        }
        addGraph(graphLabel, null);
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
                        <div className={UnionTrayStyles.inputWrapper}>
                            <input
                                className={UnionTrayStyles.unionInput}
                                placeholder="Define new graph"
                                value={graphLabel}
                                onChange={e => setGraphLabel(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            {error && <CloseIcon className={UnionTrayStyles.errorIcon} />}
                        </div>
                        <button className={UnionTrayStyles.addButton} onClick={addGraphEntry}>
                            <AddIcon />
                        </button>
                    </div>
                    <UnionList graphs={graphs} activeGraphId={activeGraphId} changeActiveGraph={changeActiveGraph} isGraphLoop={isGraphLoop} addGraphNode={addGraphNode} removeGraph={removeGraph} />
                </div>
            )}
        </div>
    );
}

export default UnionTray;
