import { capitalizeFirst, cleanString, addSpaceChars } from "./stringFormatter.js";

const getOperatorString = (operator, type, value, varNodeData) => {
    const valueString = ['number', 'decimal', 'datetime'].includes(type) ? value : `"${value}"`;
    const operators = {
        '>': `?${varNodeData} > ${valueString}`,
        '<': `?${varNodeData} < ${valueString}`,
        '<=': `?${varNodeData} <= ${valueString}`,
        '>=': `?${varNodeData} >= ${valueString}`,
        '⊆': `CONTAINS(?${varNodeData}, ${valueString})`,
        '=': `?${varNodeData} = ${valueString}`,
    }
    return operators[operator] || operators['='];
}

// All SPARQL logic goes here
export const parseQuery = (nodes, edges, startingVar) => {
    let select = 'SELECT DISTINCT';
    let body = 'WHERE {\n';

    // TODO metric
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
            // TODO redo select statements to only relevan things select += ` ?${varLabel} ?${varUri} ?${varType} ?${varTypeLabel}`;
            select += ` ?${varLabel} ?${varUri} ?${varType} ?${varTypeLabel}`;

            // TODO do label fetching in different query
            /*
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
            */
        });
    }
    body += '\n';

    // Create query body
    Object.keys(nodes).forEach(nodeInList => {
        // If node is a uri list it will be skipped
        if (nodeInList.shape === 'box') return;
        const nodeIsVar = nodes[nodeInList].varID >= 0;
        const varNode = nodeIsVar ? nodes[nodeInList].data : `<${nodes[nodeInList].data}>`;
        // Apply class restrictions
        let graph = '';
        if (nodeIsVar && !['http://www.w3.org/2002/07/owl#Thing', 'Triplet'].includes(nodes[nodeInList]?.class))
            body += `${varNode} <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${nodes[nodeInList].class}> .\n`;
        else if (edges.some(edge => edge.from === nodes[nodeInList].id)) {
            graph = `GRAPH <${nodes[nodeInList].graph}> {\n`;
            body += graph;
        }
        // Build object properties
        edges.filter(edge => edge.from === nodes[nodeInList].id).forEach(edge => {
            let optional = edge.isOptional ? `OPTIONAL { ` : ``;
            let transitive = edge.isTransitive ? `*` : ``;
            let targetNode = nodes.find(node => node.id === edge.to);
            let subject;
            if (targetNode.shape === 'box')
                subject = `VALUES { ${targetNode.map(item => `<${item}>`).join(' ')} }`;
            else if (targetNode.varID >= 0)
                subject = targetNode.data;
            else
                subject = `<${targetNode.data}>`;

            body += `${optional}${varNode} <${edge.data}>${transitive} ${subject} ${optional ? '}' : ''}.\n`;
        });
        // Build data properties
        if (nodes[nodeInList].properties) {
            Object.keys(nodes[nodeInList].properties).forEach(property => {
                let show = nodes[nodeInList].properties[property].show;
                let data = nodes[nodeInList].properties[property].data;
                if (show || data) {
                    let varProperty = cleanString(capitalizeFirst(property) + '_' + nodes[nodeInList].varID);
                    let uri = nodes[nodeInList].properties[property].uri;
                    let transitive = nodes[nodeInList].properties[property].transitive ? `*` : ``;

                    body += `${varNode} <${uri}>${transitive} ?${varProperty} .\n`;
                    if (show) select += ' ?' + varProperty;
                    if (data) body += `FILTER ( ${getOperatorString(nodes[nodeInList].properties[property].operator, nodes[nodeInList].properties[property].type, data, varProperty)} ) .\n`;
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

// Parses the response body
export const parseResponse = (response) => {
    const result = {};

    response.data.results.bindings.forEach((element) => {
        const typeValue = element?.[Object.keys(element)[3]]?.value?.toLowerCase() ?? null;
        if (!typeValue) return;
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
    console.log(result)
    return result;
}
