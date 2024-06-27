'use server'

export async function getAllUnreadNotificationsCount() {
    // try {
    //     const count = await prisma.notification.count({
    //         where: {
    //             Has_Read: false
    //         }
    //     })
    //     return count
    // } catch (err) {
    //     return 0
    // }
}

export async function getNotificationCountByRuleId(ruleId: number) {
    // try {
    //     const count = prisma.notification.count({
    //         where: {
    //             Rule_Id: ruleId,
    //             Has_Read: false
    //         }
    //     })
    //     return count
    // } catch (err) {
    //     return 0
    // }
    return 0
}

export async function getNotificationsByRuleId(ruleId: number): Promise<any[]> {
    // try {
    //     const data = prisma.notification.findMany({
    //         where: {
    //             Rule_Id: ruleId
    //         },
    //         orderBy: {
    //             Occurrence: 'desc'
    //         }
    //     })
    //     return data
    // } catch (err) {
    //     return []
    // }
    return []
}

export async function readSingleNotification(notificationId: number) {
    // return prisma.notification.update({
    //     where: {
    //         id: notificationId
    //     },
    //     data: {
    //         Has_Read: true
    //     }
    // })
}

export async function readAllNotificationsByRuleId(ruleId: number) {
    // return prisma.notification.updateMany({
    //     where: {
    //         Rule_Id: ruleId
    //     },
    //     data: {
    //         Has_Read: true
    //     }
    // })
}