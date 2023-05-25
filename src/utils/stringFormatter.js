export const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const cleanString = str => {
    const invalidCharsRegex = /[^a-zA-Z0-9_]/g;
    const cleanedString = str.replace(invalidCharsRegex, '');
    return cleanedString;
}
