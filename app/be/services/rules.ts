'use server'

export async function getAllRules(): Promise<any[]> {
    // try {
    //     const rules = await prisma.monitor_Rule.findMany()
    //     return rules
    // } catch (err) {
    //     return []
    // }
    return []
}

export async function createNewRule(ruleName: string, methodName: string, value: number, column: string): Promise<any> {
    // return prisma.monitor_Rule.create({
    //     data: {
    //         Rule_Name: ruleName,
    //         Method_Name: methodName,
    //         Condition_Value: value,
    //         Condition_Column: column
    //     }
    // })`
    return {}
}

export async function deleteRuleById(ruleId: number) {
    // return prisma.monitor_Rule.delete({
    //     where: {
    //         id: ruleId
    //     }
    // })
}