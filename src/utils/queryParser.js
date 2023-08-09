import { capitalizeFirst, cleanString, addSpaceChars, removeSpaceChars } from "./stringFormatter.js";

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

    // TODO metric settings
    if (startingVar[Object.keys(startingVar)[0]].isMetric) {
        const metricNode = startingVar[Object.keys(startingVar)[0]];
        const varLabel = capitalizeFirst(metricNode.type) + '_' + metricNode.varID;
        const aggregateFunction = metricNode.isMax ? 'MAX' : metricNode.isMin ? 'MIN' : 'COUNT';
        select += ` ${aggregateFunction}(?${varLabel}) AS ?result`;
        body += '?s ?p ?o .';
    } else {
        Object.keys(startingVar).forEach(nodeId => {
            const varUri = startingVar[nodeId].varID >= 0 ?
                capitalizeFirst(startingVar[nodeId].type) + '___' + startingVar[nodeId].varID + '___URI' : `List___${nodeId}___URI`;
            select += ` ?${varUri}`;
        });
    }
    body += '\n';

    // Create query body
    Object.keys(nodes).forEach(nodeInList => {
        // If node is a uri list it will be skipped
        if (nodeInList.shape === 'box') return;
        const nodeIsVar = nodes[nodeInList].varID >= 0;
        const varNode = nodeIsVar ? nodes[nodeInList].data : `<${nodes[nodeInList].data}>`;
        // Apply class/graph restrictions
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
            if (targetNode.shape === 'box') {
                subject = `?List___${targetNode.id}___URI`;
                body += `VALUES ${subject} { ${targetNode.data.map(item => `<${item}>`).join(' ')} }`;
            }
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
                    let varProperty = cleanString(capitalizeFirst(removeSpaceChars(property)) + '___' + nodes[nodeInList].type + '___' + nodes[nodeInList].varID);
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
    console.log(select + '\n' + body + '\n')
    return select + '\n' + body + '\n';
}

export const parseResponse = (response) => {
    const resultURIAndLabels = {};
    const resultOther = {};

    response.data.results.bindings.forEach((binding) => {
        const keysInThisBinding = new Set();
        Object.entries(binding).forEach(([key, value]) => {
            // Establish query columns
            const keyWithSpaces = addSpaceChars(key);
            keysInThisBinding.add(keyWithSpaces);

            if (value.type === 'uri') {
                const labelFieldName = keyWithSpaces.replace(/URI/g, 'Label');
                keysInThisBinding.add(labelFieldName);
                if (!resultURIAndLabels[labelFieldName]) {
                    resultURIAndLabels[labelFieldName] = [];
                }
                resultURIAndLabels[labelFieldName].push(value.label);
                if (!resultURIAndLabels[keyWithSpaces])
                    resultURIAndLabels[keyWithSpaces] = [];
                resultURIAndLabels[keyWithSpaces].push(value.value);
            } else {
                console.log(value.value)
                if (!resultOther[keyWithSpaces])
                    resultOther[keyWithSpaces] = [];
                resultOther[keyWithSpaces].push(value.value);
            }
        });
        // Ensure all arrays have the same length by filling missing values with ""
        [...Object.keys(resultURIAndLabels), ...Object.keys(resultOther)].forEach(key => {
            if (!keysInThisBinding.has(key)) {
                if (resultURIAndLabels[key]) {
                    resultURIAndLabels[key].push("");
                } else {
                    resultOther[key].push("");
                }
            }
        });
    });
    const result = { ...resultURIAndLabels, ...resultOther };
    return result;
}
