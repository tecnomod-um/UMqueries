const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildVars(startingVar) {
    console.log(startingVar);

    let select = 'SELECT DISTINCT';
    let body = 'WHERE {\n';
    Object.keys(startingVar).forEach((element, index) => {
        const varLabel = capitalizeFirst(element) + '_' + index;
        const varUri = capitalizeFirst(element) + '_' + index + '_URI';
        const varType = 'var' + element + index;
        const varTypeLabel = 'varTypeLabel' + index

        // SELECT statement
        select += ' ?' + varLabel + ' ?' + varUri + ' ?' + varType + ' ?' + varTypeLabel;

        // Get var types
        body += '?' + varUri + ' <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?' + varType + ' .\n';
        // Get var labels
        body += 'OPTIONAL {?' + varUri + ' <http://www.w3.org/2000/01/rdf-schema#label> ?' + varUri + 'RdfsLabel} .\n';
        body += 'OPTIONAL {?' + varUri + ' <http://www.w3.org/2004/02/skos/core#prefLabel> ?' + varUri + 'PrefLabel} .\n';
        body += 'OPTIONAL {?' + varUri + ' <http://www.w3.org/2004/02/skos/core#altLabel> ?' + varUri + 'AltLabel} .\n';
        body += 'BIND( COALESCE(?' + varUri + 'RdfsLabel, ?' + varUri + 'PrefLabel, ?' + varUri + 'AltLabel) AS ?' + varLabel + ')\n';
        // Get varType labels
        body += 'OPTIONAL {?' + varType + ' <http://www.w3.org/2000/01/rdf-schema#label> ?' + varType + 'RdfsLabel} .\n';
        body += 'OPTIONAL {?' + varType + ' <http://www.w3.org/2004/02/skos/core#prefLabel> ?' + varType + 'PrefLabel} .\n';
        body += 'OPTIONAL {?' + varType + ' <http://www.w3.org/2004/02/skos/core#altLabel> ?' + varType + 'AltLabel} .\n';
        body += 'BIND( COALESCE(?' + varType + 'RdfsLabel, ?' + varType + 'PrefLabel, ?' + varType + 'AltLabel) AS ?' + varTypeLabel + ')\n';

        // TESTING ONLY
        body += '?' + varUri + ' <http://semanticscience.org/resource/SIO_010078> <http://rdf.biogateway.eu/prot/9606/A0A024R0Y4> .\n}';
    });
    return select + '\n' + body + '\n';
}

function buildProperties(nodes, edges) {
    // Testing query
    let body = '?varTest <http://semanticscience.org/resource/SIO_010078> <http://rdf.biogateway.eu/prot/9606/A0A024R0Y4> .\n';

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


    /*
       nodes.forEach((node) => {
           // Check internal properties
           result = result + '';
   
           // Check external properties
           edges.forEach((edge) => {
               result = result + '';
           });
       });
   */
    return body + '}';
}


export const parseQuery = (nodes, edges, startingVar) => {
    let query = buildVars(startingVar);
    //query += buildProperties(nodes, edges);

    return (query);
}

export const parseResponse = (response) => {
    const result = {};
    // Iterate through each element in the response
    response.data.results.bindings.forEach(element => {
        // The type value will dictate the order in the results
        const typeValue = element[Object.keys(element)[3]].value.toLowerCase();

        if (!result[typeValue])
            result[typeValue] = []

        // Iterate through each field in the object, skipping the type
        let elementFields = {};
        Object.keys(element).forEach((field, index) => {
            if (index === 3) return;
            const fieldValue = element[field].value;

            elementFields[field] = fieldValue;

            // Add the field to the corresponding type value object in the result
            //result[typeValue].push({ [field]: fieldValue });
        })
        result[typeValue].push(elementFields);
    })
    return (result);
}
