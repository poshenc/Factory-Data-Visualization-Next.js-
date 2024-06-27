'use server'

import { GetTChartTracesParams } from '@/app/api/traces/t-chart/request-dto';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

async function getTChartTraces({ toolId, moduleId, lotId, carrierId, slotNo, waferId, items, alignStep }: GetTChartTracesParams) {
    const waferInfo = await prisma.wafer_process_info.findFirst({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            // recipeid: recipeId,
            lotid: lotId,
            carrierid: carrierId,
            slotno: slotNo,
            waferid: waferId
        },
    })

    let selectedList: { [key: string]: boolean } = {}
    items.forEach(item => selectedList[item] = true)

    if (alignStep) {
        const stepRange = await prisma.wafer_process_step_info.findFirst({
            where: {
                toolid: toolId,
                moduleid: moduleId,
                sdate: {
                    gte: waferInfo!.sdate!,
                    lte: waferInfo!.edate!
                },
                recipestepno: Number(alignStep)
            },
            select: {
                sdate: true,
                edate: true,
                carrierid: true,
                lotid: true,
                slotno: true,
                waferid: true
            }
        })
        waferInfo!.sdate = stepRange!.sdate
    }

    const traceData = await prisma.ods_tracelog.findMany({
        where: {
            time: {
                gte: waferInfo!.sdate!,
                lte: waferInfo!.edate!,
            }
        },
        select: selectedList,
        orderBy: {
            time: 'asc'
        }
    })

    const labels = getTimeArray(waferInfo!.sdate!, 0.1, traceData.length)

    const datasets = Object.keys(traceData[0]).map(item => ({
        label: item,
        data: traceData.map(data => data[item])
    }))

    return {
        labels,
        datasets
    }
}

export async function getTraceColumnNames() {
    try {
        const query = Prisma.sql`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'ods_tracelog';
    `

        const result: any[] = await prisma.$queryRaw(query, { tableName: 'ods_tracelog' })
        let columnNames: string[] = []
        const defaultColumns = ['time', 'toolid', 'moduleid', 'uuid']
        result.forEach(row => {
            if (!defaultColumns.includes(row.column_name)) {
                columnNames.push(row.column_name)
            }
        })

        return columnNames
    } catch (error) {
        return []
    }
}

function getTimeArray(startDate: Date, increment: number, count: number): Date[] {
    const timestamps = [];
    const incrementInMilliseconds = increment * 1000; // Convert seconds to milliseconds
    const startTimestamp = roundMilliseconds(startDate).getTime(); // Convert start date to timestamp in milliseconds

    for (let i = 0; i < count; i++) {
        // Calculate the new timestamp and create a new Date object
        const newTimestamp = new Date(startTimestamp + i * incrementInMilliseconds);
        timestamps.push(newTimestamp);
    }

    return timestamps;
}

function roundMilliseconds(date: Date) {
    let milliseconds = date.getMilliseconds()
    let roundedMilliseconds = Math.round(milliseconds / 100) * 100

    date.setMilliseconds(roundedMilliseconds)

    return date
}

export { getTChartTraces };

