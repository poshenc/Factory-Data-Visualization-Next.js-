import { useState } from "react";
import { getValidationFunction, validationType } from "../utils/validation";

export function useInput(defaultValue: string, type: validationType) {
    const [enteredValue, setEnteredValue] = useState(defaultValue)
    const [isEditing, setIsEditing] = useState(true)

    const validationFn = getValidationFunction(type)
    const isValueValid = validationFn(enteredValue)

    const handleInputChange = (value: string) => {
        setEnteredValue(value)
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        setIsEditing(false)
    }

    return {
        value: enteredValue,
        setValue: handleInputChange,
        handleInputBlur,
        hasError: !isValueValid && !isEditing,
        isValid: isValueValid
    }
}

