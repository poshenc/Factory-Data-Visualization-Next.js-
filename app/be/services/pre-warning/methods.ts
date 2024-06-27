export const findAllConsecutiveIncreases = (consecutiveAmount: number, conditionKey: string, inputData: any[]): any[] => {
    let increaseCount = 0
    let sequences = []

    for (let i = 1; i < inputData.length; i++) {
        if (inputData[i][conditionKey] > inputData[i - 1][conditionKey]) {
            increaseCount++;
            if (increaseCount >= consecutiveAmount - 1) {
                sequences.push(inputData[i])
            }
        } else {
            increaseCount = 0;
        }
    }

    return sequences
}

export const findAllUpperLimitReached = (limitValue: number, conditionKey: string, inputData: any[]): any[] => {
    let sequences: any[] = []

    inputData.forEach(data => {
        if (data[conditionKey] > limitValue) {
            sequences.push(data)
        }
    })

    return sequences
}

export const findAllLowerLimitReached = (limitValue: number, conditionKey: string, inputData: any[]): any[] => {
    let sequences: any[] = []

    inputData.forEach(data => {
        if (data[conditionKey] < limitValue) {
            sequences.push(data)
        }
    })

    return sequences
}