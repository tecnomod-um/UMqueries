export const parseQuery = (nodeData, edgeData, startingVar) => {
    //col set by var
    // starts building the query
    let result = '?default-graph-uri=&query=SELECT+';
    // only the selected var will be shown in the results
    if (startingVar)
        // set SELECT
        result = result + '';
    else
        result = result + '';
    /*
        nodeData.forEach((node) => {
            // Check internal properties
            result = result + '';
    
            // Check external properties
            edgeData.forEach((edge) => {
                result = result + '';
            });
        });
    */
    result = result + '%3Fvar+%3FLabel+%3FvarType+%3FvarTypeLabel%0D%0AWHERE+%7B%0D%0A%23Actual+query%0D%0A+++%3Fvar+<http%3A%2F%2Fsemanticscience.org%2Fresource%2FSIO_010078>+<http%3A%2F%2Frdf.biogateway.eu%2Fprot%2F9606%2FA0A024R0Y4>+.%0D%0A%23Get+var+types%0D%0A+++%3Fvar+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf>+%3FvarType+.%0D%0A%23Get+var+label%0D%0A+++OPTIONAL+%7B%3Fvar+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label>+%3FvarRdfsLabel%7D+.%0D%0A+++OPTIONAL+%7B%3Fvar+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel>+%3FvarPrefLabel%7D+.%0D%0A+++OPTIONAL%7B%3Fvar+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23altLabel>++%3FvarAltLabel%7D+.%0D%0A+++BIND%28COALESCE%28%0D%0A++++%3FvarRdfsLabel%2C%0D%0A++++%3FvarPrefLabel%2C%0D%0A++++%3FvarAltLabel%0D%0A+++%29+AS+%3FLabel%29%0D%0A%23Get+varType+label%0D%0A+++OPTIONAL+%7B%3FvarType+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label>+%3FvarTypeRdfsLabel%7D+.%0D%0A+++OPTIONAL+%7B%3FvarType+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel>+%3FvarTypePrefLabel%7D+.%0D%0A+++OPTIONAL+%7B%3FvarType+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23altLabel>++%3FvarTypeAltLabel%7D+.%0D%0A++BIND%28COALESCE%28%0D%0A++++%3FvarTypeRdfsLabel%2C%0D%0A++++%3FvarTypePrefLabel%2C%0D%0A++++%3FvarTypeAltLabel%0D%0A+++%29+AS+%3FvarTypeLabel%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';
    return (result);
}

export const parseResponse = (response) => {
    const result = {};
    // Iterate through each element in the response
    response.data.results.bindings.forEach(element => {
        // The type value will dictate the order in the results
        const typeValue = element.varTypeLabel.value.toLowerCase();

        if (!result[typeValue])
            result[typeValue] = []

        // Iterate through each field in the object
        let elementFields = {};
        Object.keys(element).forEach(field => {
            if (field === 'varTypeLabel') return;
            const fieldValue = element[field].value;

            elementFields[field] = fieldValue;

            // Add the field to the corresponding type value object in the result
            //result[typeValue].push({ [field]: fieldValue });
        })
        result[typeValue].push(elementFields);
    })
    return (result);
}

/*
SELECT ?var ?varLabel ?varType ?varTypeLabel
WHERE {
#Actual query
   ?var <http://semanticscience.org/resource/SIO_010078> <http://rdf.biogateway.eu/prot/9606/A0A024R0Y4> .
#Get var types
   ?var <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?varType .
#Get var label
   OPTIONAL {?var <http://www.w3.org/2000/01/rdf-schema#label> ?varRdfsLabel} .
   OPTIONAL {?var <http://www.w3.org/2004/02/skos/core#prefLabel> ?varPrefLabel} .
   OPTIONAL{?var <http://www.w3.org/2004/02/skos/core#altLabel>  ?varAltLabel} .
   BIND(COALESCE(
    ?varRdfsLabel,
    ?varPrefLabel,
    ?varAltLabel
   ) AS ?varLabel)
#Get varType label
   OPTIONAL {?varType <http://www.w3.org/2000/01/rdf-schema#label> ?varTypeRdfsLabel} .
   OPTIONAL {?varType <http://www.w3.org/2004/02/skos/core#prefLabel> ?varTypePrefLabel} .
   OPTIONAL {?varType <http://www.w3.org/2004/02/skos/core#altLabel>  ?varTypeAltLabel} .
  BIND(COALESCE(
    ?varTypeRdfsLabel,
    ?varTypePrefLabel,
    ?varTypeAltLabel
   ) AS ?varTypeLabel)
}
*/