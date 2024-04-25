import React, { createContext, useState } from 'react';

// Defines context to preload files onto the queries tool
export const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const [preloadedQuery, setPreloadedQuery] = useState(null);

    const loadQueryData = (data) => {
        setPreloadedQuery(data);
    };

    return (
        <QueryContext.Provider value={{ preloadedQuery: preloadedQuery, loadQueryData }}>
            {children}
        </QueryContext.Provider>
    );
}
