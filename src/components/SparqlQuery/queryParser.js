function buildVars(startingVar) {
    let select = 'SELECT';
    let body = 'WHERE {\n';
    Object.keys(startingVar).map((element, index) => {

        const varUri = 'var' + index;
        const varLabel = 'varLabel' + index;
        const varType = 'var' + element + index;
        const varTypeLabel = 'varTypeLabel' + index

        // SELECT statement
        select += ' ?' + varUri + ' ?' + varLabel + ' ?' + varType + ' ?' + varTypeLabel;

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
        body += '?' + varUri +' <http://semanticscience.org/resource/SIO_010078> <http://rdf.biogateway.eu/prot/9606/A0A024R0Y4> .\n}';
    });
    return select + '\n' + body;
}

function buildProperties(nodes, edges) {
    // Testing query
    let body = '?varTest <http://semanticscience.org/resource/SIO_010078> <http://rdf.biogateway.eu/prot/9606/A0A024R0Y4> .\n';

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