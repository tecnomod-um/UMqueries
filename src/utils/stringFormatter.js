export const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getItemFromURI = str => {
    const trimmedStr = str.trim().replace(/\/+$/, '');
    const lastSegment = trimmedStr.substring(trimmedStr.lastIndexOf('/') + 1);
    return lastSegment === '' ? trimmedStr : lastSegment;
}



export const cleanString = str => {
    const invalidCharsRegex = /[^a-zA-Z0-9_]/g;
    const cleanedString = str.replace(invalidCharsRegex, '');
    return cleanedString;
}

export const addSpaceChars = str => {
    return str.replaceAll("___", " ");
}

export const removeSpaceChars = str => {
    return str.replaceAll(" ", "___");
}
