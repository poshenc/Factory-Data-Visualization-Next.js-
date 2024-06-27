export type validationType = 'userName' | 'password' | 'name' | 'datasetName' | 'notEmpty' | 'noValidation' | 'postiveNumber' | 'workers' | ''

export function getValidationFunction(type: validationType): (value: string) => boolean {
    switch (type) {
        case 'userName':
            return isValidUserName
        case 'password':
            return isValidPassword
        case 'name':
            return isValidName
        case 'datasetName':
            return isValidDatasetName
        case 'notEmpty':
            return isNotEmpty
        case 'noValidation':
            return isNotEmpty
        case 'postiveNumber':
            return isPostive
        case 'workers':
            return isWorks
        default:
            return () => true
    }
}

const validationTypes = {
    letterNumber: /^[0-9a-zA-Z]+$/,
    letterNumberDashUnderscoreFullstop: /^[0-9a-zA-Z_.-]+$/,
    letterNumberDashUnderscoreSpace: /^[0-9a-zA-Z _-]+$/,
    letterNumberDashUnderscoreSpaceFullstop: /^[0-9a-zA-Z _.-]+$/,
    halfWidthExceptSpace: /^[\w`~!@#$%^&*()-_=+[\]{}\\|;:'",<.>/?]+$/,
}

export function isValidUserName(inputText: string): boolean {
    if (inputText.length === 0) return true

    const validFirstLetter = validationTypes.letterNumber.test(inputText.charAt(0));
    const validText = validationTypes.letterNumberDashUnderscoreFullstop.test(inputText);
    return validFirstLetter && validText
}

export function isValidPassword(inputText: string): boolean {
    return validationTypes.halfWidthExceptSpace.test(inputText)
}

export function isValidDatasetName(inputText: string): boolean {
    const validText = validationTypes.letterNumberDashUnderscoreSpaceFullstop.test(inputText);
    const validFirstAndLastLetter = inputText.trim().length === inputText.length;
    return validText && validFirstAndLastLetter
}

export function isValidName(inputText: string): boolean {
    const validText = validationTypes.letterNumberDashUnderscoreSpace.test(inputText);
    const validFirstAndLastLetter = inputText.trim().length === inputText.length;
    return validText && validFirstAndLastLetter
}

export function isNotEmpty(inputText: string): boolean {
    return inputText.length > 0
}

export function isPostive(variable: string): boolean {
    return parseFloat(variable) > 0
}

export function isWorks(variable: string): boolean {
    return parseFloat(variable) >= 0 && parseFloat(variable) <= 4
}

