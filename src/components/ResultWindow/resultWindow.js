import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import InputCounter from '../InputCounter/inputCounter';
import ResultView from '../ResultView/resultView';

function ResultWindow({ results, onClose }) {
    const [newWindow, setNewWindow] = useState(null);

    useEffect(() => {
        const win = window.open("", "_blank", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600");
        setNewWindow(win);
        if (!win) return;

        // Load app-wide css settings (not loaded by default when opening a new window)
        const style = win.document.createElement("style");
        style.textContent = `
            body { margin: 0; font-family: sans-serif; }
        `;

        win.document.head.appendChild(style);
        win.document.title = "Search Results";
        const container = win.document.createElement("div");
        win.document.body.appendChild(container);

        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <InputCounter results={results} />
                <ResultView results={results} />
            </React.StrictMode>
        );

        const handleCloseNewWindow = () => {
            onClose(false);
            win.close();
        };

        win.addEventListener('beforeunload', handleCloseNewWindow);
        return () => handleCloseNewWindow();
    }, [results, onClose]);
    return null;
}

export default ResultWindow;
