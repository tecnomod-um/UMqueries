import React from 'react';
import UnionTrayStyles from './unionTray.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const UnionTray = ({ isOpen, toggleTray }) => {
    const trayClass = isOpen ? 
        `${UnionTrayStyles.unionTray} ${UnionTrayStyles.open}` :
        UnionTrayStyles.unionTray;

    return (
        <div className={trayClass} onClick={toggleTray}>
            <div className={UnionTrayStyles.tab}>
                {isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </div>
            {isOpen && (
                <div className={UnionTrayStyles.content}>
                    <div className={UnionTrayStyles.header}>Lore ipsum</div>
                    Many such cases!.
                </div>
            )}
        </div>
    );
};

export default UnionTray;
