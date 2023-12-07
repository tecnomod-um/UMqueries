import '@testing-library/jest-dom';

const config = {
    backendUrl: 'http://localhost:8080',
    endpointUrl: 'https://2303.biogateway.eu/sparql',
    chunkSize: 1024 * 1024,
    debounceDelay: 500,
}

global.config = config;

process.env = {
    ...process.env,
    PORT: '3000',
    BROWSER: 'chrome',
    CHUNKSIZE: '1048576',
}
