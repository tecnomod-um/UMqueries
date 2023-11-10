import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import InputCounter from '../InputCounter/inputCounter';
import ResultView from '../ResultView/resultView';

function ResultWindow({ results, onClose }) {
    const [win, setWin] = useState(null);

    useEffect(() => {
        // Estimate the table size without renders
        const minWidthPerColumn = 120;
        const numberOfColumns = Object.keys(results).length;
        const estimatedWidth = Math.min(numberOfColumns * minWidthPerColumn, window.screen.availWidth);
        const estimatedHeightPerRow = 30;
        const numberOfRows = results[Object.keys(results)[0]].length;
        const headerHeight = 30;
        const additionalSpace = 100;
        const estimatedHeight = Math.min((numberOfRows * estimatedHeightPerRow) + headerHeight + additionalSpace, window.screen.availHeight);

        // Calculate the initial position to center the window
        const initialLeft = (window.screen.availWidth - estimatedWidth) / 2;
        const initialTop = (window.screen.availHeight - estimatedHeight) / 2;

        // Open the window at the calculated position and size
        const newWin = window.open("", "_blank", `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=${initialLeft},top=${initialTop},width=${estimatedWidth},height=${estimatedHeight}`);
        if (!newWin) return;
        setWin(newWin);

        const style = newWin.document.createElement("style");
        style.textContent = `body { margin: 0; font-family: sans-serif; }`;
        newWin.document.head.appendChild(style);

        newWin.document.title = "Search Results";
        const container = newWin.document.createElement("div");
        newWin.document.body.appendChild(container);

        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <InputCounter results={results} />
                <ResultView results={results} win={newWin} />
            </React.StrictMode>
        );

        const handleCloseNewWindow = () => {
            onClose();
            newWin.close();
        };

        newWin.addEventListener('beforeunload', handleCloseNewWindow);

        return () => {
            newWin.removeEventListener('beforeunload', handleCloseNewWindow);
            handleCloseNewWindow();
        };
    }, [results, onClose]);

    return null;
}

export default ResultWindow;
