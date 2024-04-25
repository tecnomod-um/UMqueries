import React, { createContext, useState } from 'react';

export const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const [preloadedQuery, setPreloadedQuery] = useState(null);

    const loadQueryData = (data) => {
        setPreloadedQuery(data);
    };

    const resetQueryData = () => {
        setPreloadedQuery(null);
    };

    return (
        <QueryContext.Provider value={{ preloadedQuery, loadQueryData, resetQueryData }}>
            {children}
        </QueryContext.Provider>
    );
};
