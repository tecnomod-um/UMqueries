import axios from "axios";
import config from '../config';
import { parseQuery, parseResponse } from "./queryParser.js";

const proxyURL = config.backendUrl;

const endpointURL = config.endpointUrl;

export const handleQuery = (nodes, edges, startingVar, setIsLoading) => {
    setIsLoading(true);
    let data = {
        endpoint: endpointURL,
        query: parseQuery(nodes, edges, startingVar)
    };

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: proxyURL,
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
};

export const handleNodeDataFetch = () => {

}

