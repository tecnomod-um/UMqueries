import axios from "axios";
import config from '../config';
import { parseQuery, parseResponse } from "./queryParser.js";

const proxyURL = config.backendUrl;
const endpointURL = config.endpointUrl;

export const handleDataPropertiesFetch = () => {
    return fetchData('/data/data_properties');
}

export const handleNodeDataFetch = () => {
    return fetchData('/data/nodes');
}

export const handleObjectPropertiesFetch = () => {
    return fetchData('/data/object_properties');
}

export const handleVarDataFetch = () => {
    return fetchData('/data/vars');
}

export const fetchData = (dataFile) => {
    let reader;

    return new Promise((resolve, reject) => {
        fetch(`${proxyURL}${dataFile}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with status code ${response.status}`);
                }
                reader = response.body.getReader();

                const decoder = new TextDecoder('utf-8');
                let data = '';

                function read() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            const parsedData = JSON.parse(data);
                            resolve(parsedData);
                            reader.cancel();
                            return;
                        }
                        const chunk = decoder.decode(value, { stream: true });
                        data += chunk;
                        return read();
                    });
                }
                return read();
            })
            .catch((error) => {
                console.error(error);
                if (reader) {
                    reader.cancel();
                }
                reject(new Error(`Failed to fetch data: ${error.message}`));
            });
    });
}

export const handleQuery = (nodes, edges, startingVar, setIsLoading) => {
    setIsLoading(true);
    let data = {
        endpoint: endpointURL,
        query: parseQuery(nodes, edges, startingVar)
    };

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `${proxyURL}/sparql`,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (response) {
                setIsLoading(false);
                const result = parseResponse(response);
                resolve(result);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
                reject(error);
            });
    });
}
