// Utility class to define modal fields. 
// TODO fill with all w3c ontology field types
export const getCategory = (inputType) => {
    if (inputType.includes('uri') || inputType.includes('link') || inputType.includes('url'))
        return 'link';
    else if (inputType.includes('numeric') || inputType.includes('int') || inputType.includes('integer') || inputType.includes('long') || inputType.includes('decimal') || inputType.includes('byte'))
        return 'number';
    else if (Array.isArray(inputType) || (typeof inputType === 'string' && inputType.includes('array')))
        return 'select';
    else if (typeof inputType === 'string' && inputType.includes('boolean'))
        return 'boolean';
    else
        return 'text';
}
