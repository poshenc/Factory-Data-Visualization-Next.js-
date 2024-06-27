import { useEffect, useState } from "react";
import { getValidationFunction, validationType } from "../utils/validation";
import { intervalValidation, variableValidation } from "../utils/variablesBounded";

export interface InputsHooks {
    label: string
    type: validationType | variableValidation
    defaultValue: string
    errorMessage?: string
    upperBound?: number
    lowerBound?: number
    nullable?: boolean
}

interface State {
    label: string
    type: validationType | variableValidation
    enteredValue: string
    isEditing: boolean
    hasError: boolean
    errorMessage?: string
    upperBound?: number
    lowerBound?: number
    nullable?: boolean
}

export function useInputs(initialInputs: InputsHooks[]) {
    const [allInputs, setAllInputs] = useState<State[]>([])

    useEffect(() => {
        const updatedValue: State[] = initialInputs.map(input => ({
            label: input.label,
            type: input.type,
            enteredValue: input.defaultValue,
            isEditing: true,
            hasError: false,
            errorMessage: input.errorMessage
        }))
        setAllInputs(updatedValue)
    }, [])

    function validateInput({ type, enteredValue, upperBound, lowerBound, nullable }: State): boolean {
        if (upperBound) {
            const validateHasErrorFn = intervalValidation(type as variableValidation)
            return !validateHasErrorFn(upperBound, lowerBound!, enteredValue, nullable!)
        } else {
            const validationFn = getValidationFunction(type as validationType)
            return validationFn(enteredValue)
        }

    }

    function handleInputChange(label: string, enteredValue: string) {
        setAllInputs(previousValue => {
            const updatedValue = [...previousValue]
            const input = updatedValue[updatedValue.findIndex(el => el.label === label)]
            input.enteredValue = enteredValue
            input.isEditing = true
            const isValid = validateInput(input)
            input.hasError = !isValid && !input.isEditing
            return updatedValue
        })
    }

    function handleInputBlur(label: string) {
        setAllInputs(previousValue => {
            const updatedValue = [...previousValue]
            const input = updatedValue[updatedValue.findIndex(el => el.label === label)]
            input.isEditing = false
            const isValid = validateInput(input)
            input.hasError = !isValid && !input.isEditing
            return updatedValue
        })
    }

    function handleAddInput(input: InputsHooks) {
        const newInput: State = {
            label: input.label,
            type: input.type,
            enteredValue: input.defaultValue,
            isEditing: true,
            hasError: false,
            errorMessage: input.errorMessage,
            ...(input.nullable) && { nullable: input.nullable },
            ...(input.upperBound) && { upperBound: input.upperBound },
            ...(input.lowerBound) && { lowerBound: input.lowerBound }
        }
        setAllInputs(previousValue => [...previousValue, newInput])
    }

    function clearAllInputs() {
        setAllInputs([])
    }

    return {
        value: allInputs,
        setValue: handleInputChange,
        handleInputBlur,
        clearAllInputs,
        addInput: handleAddInput
    }
}

