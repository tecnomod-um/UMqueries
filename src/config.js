const config = {
    // Deployment backend url
     backendUrl: 'https://semantics.inf.um.es:8888',
    // Development backend url
    // backendUrl: 'http://localhost:8686',

    //Unused backend urls
    //endpointUrl: 'https://dbpedia.org/sparql',
    //endpointUrl: 'http://ssb4.nt.ntnu.no:23032/sparql',
    //endpointUrl: 'https://biogateway.eu/sparql-endpoint/',
    //endpointUrl: 'http://ssb4.nt.ntnu.no:10022/sparql',
    //endpointUrl: 'https://2303.biogateway.eu/sparql',

    endpointUrl: 'http://ssb4.nt.ntnu.no:23122/sparql',
    chunkSize: 1024 * 1024,
    debounceDelay: 500,
}

export default config;
