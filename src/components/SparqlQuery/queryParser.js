import React from 'react';



export function parse(nodeData, edgeData) {
    var result = '';
    // logica crear query
    return ('?default-graph-uri=&query=SELECT+%3Fs+%3Fp+%3Fo%0D%0AFROM+%3Chttp%3A%2F%2Frdf.biogateway.eu%2Fgraph%2Fgene%3E%0D%0AWHERE+%7B%0D%0A++%3Fs+%3Fp+%3Fo+.%0D%0A%7D+limit+50&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on');

}