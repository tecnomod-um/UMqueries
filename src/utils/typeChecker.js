export const getCategory = (inputType) => {
    if (Array.isArray(inputType)) {
        return 'select';
    }
    const type = inputType.toLowerCase();
    const patterns = [
        { re: /uri|link|url|typed-literal/, return: 'link' },
        { re: /numeric|int|integer|long|decimal|byte|short|nonnegativeinteger|unsignedlong|unsignedint|unsignedshort|unsignedbyte|positiveinteger/, return: 'number' },
        { re: /float|double/, return: 'decimal' },
        { re: /boolean/, return: 'boolean' },
        { re: /datetime|date|time|gyear|gyearmonth|gmonth|gmonthday|gday|duration|daytimeduration|yearmonthduration/, return: 'datetime' },
        { re: /string|normalizedstring|token|language|name|ncname|id|idref|idrefs|entity|entities|nmtoken|nmtokens/, return: 'text' },
        { re: /base64binary|hexbinary/, return: 'binary' },
        { re: /anyuri|qname|notation/, return: 'uri' },
        { re: /array|enumeration/, return: 'select' }
    ];

    for (const pattern of patterns) {
        if (pattern.re.test(type)) {
            return pattern.return;
        }
    }
    return 'text';
}

export const getOperatorTooltip = (operator) => {
    switch (operator) {
        case '=':
            return 'is equal to';
        case '==':
            return 'is the same as';
        case '!=':
            return 'is not equal to';
        case '<':
            return 'is less than';
        case '<=':
            return 'is less than or equal to';
        case '>':
            return 'is greater than';
        case '>=':
            return 'is greater than or equal to';
        case '⊆':
            return 'contains';
        case '+':
            return 'adds';
        case '-':
            return 'subtracts';
        case '*':
            return 'multiplies';
        case '/':
            return 'divides';
        default:
            return 'unknown operator';
    }
}
