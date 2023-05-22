const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildVars(startingVar) {

    let select = 'SELECT DISTINCT';
    let body = 'WHERE {\n';
    Object.keys(startingVar).forEach(nodeId => {
        const varLabel = capitalizeFirst(startingVar[nodeId].type) + '_' + startingVar[nodeId].varID;
        const varUri = capitalizeFirst(startingVar[nodeId].type) + '_' + startingVar[nodeId].varID + '_URI';
        const varType = capitalizeFirst(startingVar[nodeId].type) + '_' + startingVar[nodeId].varID + '_type_URI';
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
    return select + '\n' + body + '\n';
}

function buildProperties(nodes, edges, insideData) {
    let body = '';
    let graph = '';
    Object.keys(nodes).filter(generalNode => nodes[generalNode].varID >= 0).forEach(nodeInList => {
        const varUri = capitalizeFirst(nodes[nodeInList].type) + '_' + nodes[nodeInList].varID + '_URI';

        // Build object properties
        graph = '';
        edges.forEach(edge => { // !!! +
            if (edge.from === nodes[nodeInList].id) {
                if (!graph) {
                    graph = `GRAPH <${nodes[nodeInList].graph}> {\n`;
                    body += graph;
                }
                let optional = edge.isOptional ? `OPTIONAL {` : ``;
                let transitive = edge.isTransitive ? `*` : ``;
                let targetNode = nodes.find(node => node.id === edge.to);
                let subject = targetNode.varID >= 0 ? targetNode.data : `<${targetNode.data}>`;
                body += `${optional}?${varUri} <${edge.data}>${transitive} ${subject}${optional ? '}' : ''}.\n`;
            }
        });
        if (graph) body += `}\n`;

        // Build data properties
        graph = '';
        let setProperties = Object.keys(nodes[nodeInList]);
        console.log(nodes);
        console.log(setProperties)

    });


    return body + '}';
}


export const parseQuery = (nodes, edges, startingVar) => {
    let query = buildVars(startingVar);
    query += buildProperties(nodes, edges);

    return (query);
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
                elementFields[field] = fieldValue;
            }
        });

        result[typeValue].push(elementFields);
    });
    return result;
};
/*
SELECT DISTINCT ?gene ?protein ?evidenceLevel
    WHERE {
        GRAPH <http://rdf.biogateway.eu/graph/crm> {
            <http://rdf.biogateway.eu/crm/9606/CRMHS00000096925> <http://purl.obolibrary.org/obo/RO_0002428> ?gene
        }
        GRAPH <http://rdf.biogateway.eu/graph/gene> {
            ?gene <http://semanticscience.org/resource/SIO_010078> ?protein
        }
        GRAPH <http://rdf.biogateway.eu/graph/prot> {
            ?protein <http://schema.org/evidenceLevel> ?evidenceLevel
        }
    }
*/
