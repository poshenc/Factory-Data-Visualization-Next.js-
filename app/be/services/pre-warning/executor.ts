'use server'


declare global {
    var intervalExecutor: NodeJS.Timeout | null | undefined;
}

// Singleton for intervalExecutor
const intervalExecutorSingleton = () => {
    if (typeof globalThis.intervalExecutor === 'undefined') {
        globalThis.intervalExecutor = null;
    }
    return globalThis.intervalExecutor;
}

// Initialize or get the existing intervalExecutor
const intervalExecutor = globalThis.intervalExecutor ?? intervalExecutorSingleton();

// In development, ensure singleton instance is reused
if (process.env.NODE_ENV !== 'production') {
    globalThis.intervalExecutor = intervalExecutor;
}

export const startPreWarningExecutor = () => {
    stopPreWarningExecutor()
    // globalThis.intervalExecutor = executeAllRulesEverySec()
}

export const stopPreWarningExecutor = () => {
    if (globalThis.intervalExecutor) {
        clearInterval(globalThis.intervalExecutor)
        globalThis.intervalExecutor = null
    }
}

export const getExecutorState = (): Promise<boolean> => {
    const state = globalThis.intervalExecutor ? true : false
    return Promise.resolve(state)
}


function executeAllRulesEverySec() {
    // return setInterval(async () => {
    //     const allRules = await prisma.monitor_Rule.findMany()

    //     // for loop each rules and execute
    //     allRules.forEach(async rule => {
    //         const { Condition_Value, Condition_Column } = rule
    //         switch (rule.Method_Name) {
    //             case 'CONSECUTIVE_INCREASE':
    //                 const consecutiveData = await prisma.generated_Data.findMany({
    //                     take: -9 - rule.Condition_Value, // total of 15 data if looping 6 consecutive in 1 sec
    //                     orderBy: {
    //                         id: 'asc'
    //                     }
    //                 })

    //                 const consecutiveResult = findAllConsecutiveIncreases(Condition_Value, Condition_Column, consecutiveData)

    //                 consecutiveResult.forEach(alertData => {
    //                     const notificationData = {
    //                         Rule_Id: rule.id,
    //                         Description: `${rule.Rule_Name} reached with value of ${alertData[rule.Condition_Column]}.`,
    //                         Occurrence: alertData.Occurrence
    //                     }
    //                     insertNotificationIfNotExists(notificationData)
    //                 })

    //                 break
    //             case 'UPPER_LIMIT':
    //                 const upperData = await prisma.generated_Data.findMany({
    //                     take: -10, // total of 10 in 1 sec
    //                     orderBy: {
    //                         id: 'asc'
    //                     }
    //                 })

    //                 const upperResult = findAllUpperLimitReached(Condition_Value, Condition_Column, upperData)

    //                 upperResult.forEach(alertData => {
    //                     const notificationData = {
    //                         Rule_Id: rule.id,
    //                         Description: `${rule.Rule_Name} reached with value of ${alertData[rule.Condition_Column]}.`,
    //                         Occurrence: alertData.Occurrence
    //                     }
    //                     insertNotificationIfNotExists(notificationData)
    //                 })

    //                 break
    //             case 'LOWER_LIMIT':
    //                 const lowerData = await prisma.generated_Data.findMany({
    //                     take: -10, // total of 10 in 1 sec
    //                     orderBy: {
    //                         id: 'asc'
    //                     }
    //                 })

    //                 const lowerResult = findAllLowerLimitReached(Condition_Value, Condition_Column, lowerData)

    //                 lowerResult.forEach(alertData => {
    //                     const notificationData = {
    //                         Rule_Id: rule.id,
    //                         Description: `${rule.Rule_Name} reached with value of ${alertData[rule.Condition_Column]}.`,
    //                         Occurrence: alertData.Occurrence
    //                     }
    //                     insertNotificationIfNotExists(notificationData)
    //                 })

    //                 break
    //             default:
    //                 break
    //         }
    //     })
    // }, 1000)
}

async function insertNotificationIfNotExists(data: { Rule_Id: number; Description: string; Occurrence: any }) {
    // const { Rule_Id, Description, Occurrence } = data;

    // // Check if a record with the same Description and Occurrence already exists
    // const existingRecord = await prisma.notification.findFirst({
    //     where: {
    //         Rule_Id: Rule_Id,
    //         Description: Description,
    //         Occurrence: new Date(Occurrence)
    //     }
    // });

    // // If no such record exists, insert the new data
    // if (!existingRecord) {
    //     const newRecord = await prisma.notification.create({
    //         data: {
    //             Rule_Id,
    //             Description,
    //             Occurrence: new Date(Occurrence),
    //             Has_Read: false
    //         }
    //     });
    //     return newRecord;
    // } else {
    //     // Return some indication that the record already exists
    //     return "Record already exists";
    // }
}