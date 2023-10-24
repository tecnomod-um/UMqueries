const config = {
    backendUrl: 'http://localhost:8080',
    //endpointUrl: 'https://dbpedia.org/sparql',
    endpointUrl: 'https://2303.biogateway.eu/sparql',
    //endpointUrl: 'http://ssb4.nt.ntnu.no:23032/sparql',
    //endpointUrl: 'https://biogateway.eu/sparql-endpoint/',
    //endpointUrl: 'http://ssb4.nt.ntnu.no:10022/sparql',
    
    //endpointUrl: 'http://127.0.0.1:34029/sparql',
    chunkSize: 1024 * 1024,
    debounceDelay: 500,
};

export default config;