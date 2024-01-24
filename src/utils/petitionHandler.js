import axios from "axios";
import config from '../config';
import { parseQuery, parseResponse } from "./queryParser.js";

const proxyURL = config.backendUrl;
const endpointURL = config.endpointUrl;
let debounceTimeout;
let lastFilter = null;

export const debounceFilteredNodeData = () => {
    return (filter, setData, setIsLoading) => {
        if (filter !== lastFilter) {
            clearTimeout(debounceTimeout);
            setIsLoading(true);
            debounceTimeout = setTimeout(() =>
                populateWithFilteredNodeData(filter, setData, setIsLoading), config.debounceDelay);
            lastFilter = filter;
        }
    };
}

export const populateWithFilteredNodeData = (filter, setData, setIsLoading) => {
    setIsLoading(true);
    return Promise.all([
        handleFilteredNodeDataFetch(filter),
    ])
        .then(([nodeData]) => {
            setData(nodeData);
            setIsLoading(false);

        })
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        });
}

export const populateWithEndpointData = (setVarData, setVarIDs, setObjectProperties, setDataProperties) => {
    return Promise.all([
        handleVarDataFetch(),
        handlePropertiesFetch()
    ])
        .then(([varData, propertiesData]) => {
            setVarData(varData);
            setVarIDs([{ id: 0, varIdList: Object.fromEntries(Object.keys(varData).map(type => [type, 0])) }]);
            setObjectProperties(propertiesData.objectProperties);
            setDataProperties(propertiesData.dataProperties);
        })
        .catch(error => {
            console.log(error);
        });
}

export const handlePropertiesFetch = () => {
    return fetchData(`/intu/data/properties`);
}

export const handleFilteredNodeDataFetch = (filter) => {
    return fetchData(`/intu/data/nodes?filter=${filter}`);
}

export const handleVarDataFetch = () => {
    return fetchData(`/intu/data/vars`);
}

export const fetchData = (dataFile) => {
    return new Promise((resolve, reject) => {
        fetch(`${proxyURL}${dataFile}`, {
            credentials: 'include',
            headers: {
                'X-SPARQL-Endpoint': endpointURL,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with status code ${response.status}`);
                }
                const reader = response.body.getReader();
                let chunks = [];
                let receivedLength = 0;

                function processChunk(chunk) {
                    chunks.push(chunk);
                    receivedLength += chunk.length;
                }

                function decodeChunks() {
                    const concatenatedChunks = new Uint8Array(receivedLength);
                    let offset = 0;
                    for (let i = 0; i < chunks.length; i++) {
                        concatenatedChunks.set(chunks[i], offset);
                        offset += chunks[i].length;
                    }

                    try {
                        const decodedText = new TextDecoder().decode(concatenatedChunks);
                        const data = JSON.parse(decodedText);
                        resolve(data);
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON data: ${error.message}`));
                    }
                }

                function read() {
                    return reader
                        .read()
                        .then(({ done, value }) => {
                            if (done) {
                                decodeChunks();
                                return;
                            }
                            processChunk(value);
                            return read();
                        })
                        .catch((error) => {
                            console.error(error);
                            reject(new Error(`Failed to read data: ${error.message}`));
                        });
                }

                return read();
            })
            .catch((error) => {
                console.error(error);
                reject(new Error(`Failed to fetch data: ${error.message}`));
            });
    });
}

export const handleQuery = (graphs, activeGraphId, startingVar, isDistinct, isCount, setIsLoading) => {
    setIsLoading(true);
    let data = {
        endpoint: endpointURL,
        query: parseQuery(graphs, activeGraphId, startingVar, isDistinct, isCount)
    };

    // Capture the start time
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `${proxyURL}/intu/sparql`,
            data: data,
            withCredentials: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (response) {
                setIsLoading(false);

                // Capture the end time and calculate the duration
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                console.log(`Response time: ${responseTime} ms`);

                const result = parseResponse(response);
                resolve(result);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);

                // Capture the end time even in case of error
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                console.log(`Response time (with error): ${responseTime} ms`);

                reject(error);
            });
    });
}
