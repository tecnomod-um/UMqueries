function ResultView({ results }) {
    const headers = Object.keys(results);

    const inlineStyles = {
        resultBody: {
            margin: 0,
            padding: 0,
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            height: '100vh',
            overflowX: 'auto',
        },
        resultTable: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        resultThTd: {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'left',
            minWidth: '120px',
        },
        resultTrEven: {
            backgroundColor: '#f2f2f2'
        },
        resultTh: {
            backgroundColor: '#e0e0e0',
            color: '#333',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            maxWidth: '200px',
            border: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    };

    return (
        <div style={inlineStyles.resultBody}>
            <table style={inlineStyles.resultTable}>
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header} style={{ ...inlineStyles.resultThTd, ...inlineStyles.resultTh }}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {results[headers[0]].map((_, rowIndex) => (
                        <tr key={rowIndex} style={rowIndex % 2 === 0 ? {} : inlineStyles.resultTrEven}>
                            {headers.map(key => (
                                <td key={key + rowIndex} style={inlineStyles.resultThTd}>{results[key][rowIndex]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ResultView;
