import { capitalizeFirst, cleanString, addSpaceChars } from "./stringFormatter.js";

export const parseQuery = (nodes, edges, startingVar) => {
    let select = 'SELECT DISTINCT';
    let body = 'WHERE {\n';

    if (startingVar[Object.keys(startingVar)[0]].isMetric) {
        const metricNode = startingVar[Object.keys(startingVar)[0]];
        const varLabel = capitalizeFirst(metricNode.type) + '_' + metricNode.varID;
        const aggregateFunction = metricNode.isMax ? 'MAX' : metricNode.isMin ? 'MIN' : 'COUNT';

        select += ` ${aggregateFunction}(?${varLabel}) AS ?result`;
        body += '?s ?p ?o .';
    } else {
        Object.keys(startingVar).forEach(nodeId => {
            const varLabel = capitalizeFirst(startingVar[nodeId].type) + '___' + startingVar[nodeId].varID;
            const varUri = capitalizeFirst(startingVar[nodeId].type) + '___' + startingVar[nodeId].varID + '___URI';
            const varType = capitalizeFirst(startingVar[nodeId].type) + '___' + startingVar[nodeId].varID + '___type';
            const varTypeLabel = 'VarTypeLabel_' + startingVar[nodeId].type + '_' + startingVar[nodeId].varID;

            // SELECT statement
            select += ` ?${varLabel} ?${varUri} ?${varType} ?${varTypeLabel}`;
            // Get var types
            body += `?${varUri} <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?${varType} .\n`;
            // Get var labels
            body += `OPTIONAL { ?${varUri} <http://www.w3.org/2000/01/rdf-schema#label> ?${varUri}RdfsLabel } .\n`;
            body += `OPTIONAL { ?${varUri} <http://www.w3.org/2004/02/skos/core#prefLabel> ?${varUri}PrefLabel } .\n`;
            body += `OPTIONAL { ?${varUri} <http://www.w3.org/2004/02/skos/core#altLabel> ?${varUri}AltLabel } .\n`;
            body += `BIND(COALESCE(?${varUri}RdfsLabel, ?${varUri}PrefLabel, ?${varUri}AltLabel) AS ?${varLabel})\n`;
            // Get varType labels
            body += `OPTIONAL { ?${varType} <http://www.w3.org/2000/01/rdf-schema#label> ?${varType}RdfsLabel } .\n`;
            body += `OPTIONAL { ?${varType} <http://www.w3.org/2004/02/skos/core#prefLabel> ?${varType}PrefLabel } .\n`;
            body += `OPTIONAL { ?${varType} <http://www.w3.org/2004/02/skos/core#altLabel> ?${varType}AltLabel } .\n`;
            body += `BIND(COALESCE(?${varType}RdfsLabel, ?${varType}PrefLabel, ?${varType}AltLabel) AS ?${varTypeLabel})\n`;
        });
    }
    body += '\n';

    // Create query body
    let graph = '';
    Object.keys(nodes).forEach(nodeInList => {
        const varNode = nodes[nodeInList].varID >= 0 ? nodes[nodeInList].data : `<${nodes[nodeInList].data}>`;
        // Build object properties
        graph = '';
        edges.forEach(edge => {
            if (edge.from === nodes[nodeInList].id) {
                if (!graph) {
                    graph = `GRAPH <${nodes[nodeInList].graph}> {\n`;
                    body += graph;
                }
                let optional = edge.isOptional ? `OPTIONAL {` : ``;
                let transitive = edge.isTransitive ? `*` : ``;
                let targetNode = nodes.find(node => node.id === edge.to);
                let subject = targetNode.varID >= 0 ? targetNode.data : `<${targetNode.data}>`;
                body += `${optional}${varNode} <${edge.data}>${transitive} ${subject}${optional ? '}' : ''}.\n`;
            }
        });
        if (graph) body += `}\n`;

        // Build data properties
        graph = '';
        if (nodes[nodeInList].properties) {
            if (!graph) {
                graph = `GRAPH <${nodes[nodeInList].graph}> {\n`;
                body += graph;
            }

            Object.keys(nodes[nodeInList].properties).forEach(property => {
                let data = nodes[nodeInList].properties[property].data;
                let show = nodes[nodeInList].properties[property].show;
                if (show || data) {
                    let varNodeData = cleanString(capitalizeFirst(property) + '_' + nodes[nodeInList].varID);
                    let uri = nodes[nodeInList].properties[property].uri;
                    let transitive = nodes[nodeInList].properties[property].transitive ? `*` : ``;
                    if (show)
                        select += ' ?' + varNodeData;
                    body += `${varNode} <${uri}>${transitive} ?${varNodeData} .\n`;
                    if (data) {
                        body += `FILTER (?${varNodeData} = "${data}") .\n`;
                    }
                }
            });
        }
        if (graph) body += `}\n`;
    });

    // Add metric aggregations
    Object.keys(startingVar).forEach(nodeId => {
        const metricNode = startingVar[nodeId];
        if (metricNode.isMetric) {
            const metricVarLabel = capitalizeFirst(metricNode.property_label) + '_Metric_' + metricNode.varID;
            select += ` (${metricNode.isMax ? 'MAX' : metricNode.isMin ? 'MIN' : 'COUNT'}(?${metricVarLabel}) AS ?${metricVarLabel})`;
            body += `?${metricVarLabel} <${metricNode.uri_graph}> ?${metricVarLabel}_value .\n`;
            if (metricNode.isTotal)
                body += `FILTER (?${metricVarLabel}_value = "${metricNode.property_label}") .\n`;
        }
    });

    body += '}';
    return select + '\n' + body + '\n';
}

export const parseResponse = (response) => {
    const result = {};

    response.data.results.bindings.forEach((element) => {
        const typeValue = element[Object.keys(element)[3]].value.toLowerCase();

        if (!result[typeValue])
            result[typeValue] = [];

        const elementFields = {};

        Object.keys(element).forEach((field, index) => {
            if (index !== 3) {
                const fieldValue = element[field].value;
                elementFields[addSpaceChars(field)] = fieldValue;
            }
        });

        result[typeValue].push(elementFields);
    });
    return result;
}
