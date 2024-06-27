import { GetBaselineWafersParams } from '@/app/api/wafers/baseline/request-dto';
import { BaselineWafers } from '@/app/api/wafers/baseline/response-dto';
import { GetWaferExistsParams } from '@/app/api/wafers/check-wafer-exists/request-dto';
import { GetOtherOptionsListParams } from '@/app/api/wafers/get-other-options-list/request-dto';
import { GetWafersRecipeListParams } from '@/app/api/wafers/recipe-id-list/request-dto';
import { GetUChartWafersParams } from '@/app/api/wafers/u-chart/request-dto';
import { GetUChartTimeRangeWafersParams } from '@/app/api/wafers/u-chart/time-range/request-dto';
import prisma from '@/lib/prisma';

async function getUChartWafers({ sdate, edate, items, toolId, moduleId, recipeId }: GetUChartWafersParams) {
    // customize adjust time zone
    const startDate = new Date(sdate)
    startDate.setTime(startDate.getTime() + 8 * 60 * 60 * 1000)
    const endDate = new Date(edate)
    endDate.setTime(endDate.getTime() + 8 * 60 * 60 * 1000)

    let selectedList: { [key: string]: boolean } = {}

    const defaultItems = ['time', 'toolid', 'moduleid', 'recipeid', 'lotid', 'carrierid', 'slotno', 'waferid', 'recipestepno']
    items = [
        ...items,
        ...defaultItems]
    items.forEach(item => selectedList[item] = true)

    const rawData = await prisma.wafer_summary.findMany({
        where: {
            time: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            toolid: toolId,
            moduleid: moduleId,
            recipeid: recipeId ? recipeId : undefined
        },
        orderBy: {
            time: 'asc'
        },
        select: selectedList
    })

    // customize adjust time zone
    rawData.forEach((data: any) => {
        data.time.setTime(data.time.getTime() - 8 * 60 * 60 * 1000)
    })

    return rawData
}

async function getUChartTimeRangeWafers({ sdate, edate, items, toolId }: GetUChartTimeRangeWafersParams) {
    // customize adjust time zone
    const startDate = new Date(sdate)
    startDate.setTime(startDate.getTime() + 8 * 60 * 60 * 1000)
    const endDate = new Date(edate)
    endDate.setTime(endDate.getTime() + 8 * 60 * 60 * 1000)

    let selectedList: { [key: string]: boolean } = {}

    const defaultItems = ['time', 'toolid', 'moduleid', 'recipeid', 'lotid', 'carrierid', 'slotno', 'waferid', 'recipestepno']
    items = [
        ...items,
        ...defaultItems]
    items.forEach(item => selectedList[item] = true)

    const distinctModules = await prisma.wafer_summary.findMany({
        where: {
            time: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            toolid: toolId,
        },
        distinct: ['moduleid'],
        select: {
            moduleid: true
        }
    })

    const promiseFunctions = distinctModules.map(async wafer => {
        const rawData = await prisma.wafer_summary.findMany({
            where: {
                time: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                toolid: toolId,
                moduleid: wafer.moduleid
            },
            orderBy: {
                time: 'asc'
            },
            select: selectedList
        })

        // customize adjust time zone
        rawData.forEach((data: any) => {
            data.time.setTime(data.time.getTime() - 8 * 60 * 60 * 1000)
        })

        return rawData
    })

    try {
        const results = await Promise.all(promiseFunctions)
        return results
    } catch (error) {
        return []
    }
}

async function getWaferRecipeList({ sdate, edate, toolId, moduleId }: GetWafersRecipeListParams) {
    // customize adjust time zone
    const startDate = new Date(sdate)
    startDate.setTime(startDate.getTime() + 8 * 60 * 60 * 1000)
    const endDate = new Date(edate)
    endDate.setTime(endDate.getTime() + 8 * 60 * 60 * 1000)

    const recipeList = await prisma.wafer_summary.findMany({
        where: {
            time: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            toolid: toolId,
            moduleid: moduleId
        },
        distinct: ['recipeid'],
        select: {
            recipeid: true
        }
    })

    return recipeList.map(value => value.recipeid)
}

const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate
}

const filterDataByTimeRange = (data: any, startDate: Date, endDate: Date) => {
    return data.filter((item: any) => {
        const itemDate = item.time
        return isDateInRange(itemDate, startDate, endDate)
    })
}

async function getBaselineWafers({ sdate, edate, items, toolId, moduleId, recipeId, alignStep }: GetBaselineWafersParams) {
    // customize adjust time zone
    const startDate = new Date(sdate)
    startDate.setTime(startDate.getTime() + 8 * 60 * 60 * 1000)
    const endDate = new Date(edate)
    endDate.setTime(endDate.getTime() + 8 * 60 * 60 * 1000)

    let waferTimeRanges: {
        sdate: Date | null;
        edate: Date | null;
    }[] = []

    waferTimeRanges = await prisma.wafer_process_info.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            recipeid: recipeId ? recipeId : undefined,
            sdate: {
                gte: startDate!,
                lte: endDate!,
            }
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

    if (alignStep) {
        const stepRanges = await prisma.wafer_process_step_info.findMany({
            where: {
                toolid: toolId,
                moduleid: moduleId,
                sdate: {
                    gte: startDate!,
                    lte: endDate!,
                },
                recipeid: recipeId ? recipeId : undefined,
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
        stepRanges.forEach(range => {
            const waferIndex = waferTimeRanges.findIndex(wafer => range.sdate! >= wafer.sdate! && range.sdate! <= wafer.edate!)
            waferTimeRanges[waferIndex].sdate = range.sdate
        })
    }

    if (waferTimeRanges.length === 0) return {} as BaselineWafers

    let minSDate = new Date(waferTimeRanges[0].sdate!)
    let maxEDate = new Date(waferTimeRanges[0].edate!)

    waferTimeRanges.forEach(item => {
        const sDate = new Date(item.sdate!)
        const eDate = new Date(item.edate!)

        if (sDate < minSDate) minSDate = sDate
        if (eDate > maxEDate) maxEDate = eDate
    })

    const traceData = await prisma.ods_tracelog.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            time: {
                gte: minSDate!,
                lte: maxEDate!,
            }
        },
        select: {
            time: true,
            [items[0]]: true
        },
        orderBy: {
            time: 'asc'
        }
    })

    const organisedData = waferTimeRanges.map((item: any) => {
        const startDate = new Date(item.sdate)
        startDate.setTime(startDate.getTime() - 8 * 60 * 60 * 1000)

        return {
            label: startDate,
            data: filterDataByTimeRange(traceData, item.sdate!, item.edate!).map((data: any) => data[items[0]]),
            carrierid: item.carrierid,
            lotid: item.lotid,
            slotno: item.slotno,
            waferid: item.waferid
        }
    })

    let maxLength = 0
    organisedData.forEach((dataset: any) => {
        if (dataset.data.length > maxLength) maxLength = dataset.data.length
    })

    let labels: string[] = []
    for (let i = 1; i <= maxLength; i++) {
        labels.push((i / 10).toFixed())
    }

    const result: BaselineWafers = {
        labels: labels,
        datasets: organisedData
    }

    return result
}

async function checkWaferExists(params: GetWaferExistsParams) {
    const waferInfo = await prisma.wafer_process_info.count({
        where: {
            toolid: params.toolId,
            moduleid: params.moduleId,
            lotid: params.lotId,
            carrierid: params.carrierId,
            slotno: Number(params.slotNo),
            waferid: params.waferId,
            recipeid: params.recipeId
        },
    })
    return waferInfo > 0 ? true : false
}

async function getModuleAndToolList() {
    const moduleList = await prisma.wafer_process_info.findMany({
        distinct: ['moduleid'],
        select: {
            moduleid: true
        }
    })

    const toolList = await prisma.wafer_process_info.findMany({
        distinct: ['toolid'],
        select: {
            toolid: true
        }
    })

    return {
        moduleId: moduleList.map(item => item.moduleid) ?? [],
        toolId: toolList.map(item => item.toolid) ?? []
    }
}

async function getOtherOptionsList({ moduleId, toolId }: GetOtherOptionsListParams) {
    const carrierList = await prisma.wafer_process_info.findMany({
        where: {
            moduleid: moduleId,
            toolid: toolId
        },
        distinct: ['carrierid'],
        select: {
            carrierid: true
        }
    })

    const recipeList = await prisma.wafer_process_info.findMany({
        where: {
            moduleid: moduleId,
            toolid: toolId
        },
        distinct: ['recipeid'],
        select: {
            recipeid: true
        }
    })

    const lotList = await prisma.wafer_process_info.findMany({
        where: {
            moduleid: moduleId,
            toolid: toolId,
        },
        distinct: ['lotid'],
        select: {
            lotid: true
        }
    })

    const slotNoList = await prisma.wafer_process_info.findMany({
        where: {
            moduleid: moduleId,
            toolid: toolId,
        },
        distinct: ['slotno'],
        select: {
            slotno: true
        }
    })

    const waferList = await prisma.wafer_process_info.findMany({
        where: {
            moduleid: moduleId,
            toolid: toolId,
        },
        distinct: ['waferid'],
        select: {
            waferid: true
        }
    })

    return {
        carrierId: carrierList.map(item => item.carrierid) ?? [],
        lotId: lotList.map(item => item.lotid) ?? [],
        slotNo: slotNoList.map(item => item.slotno.toString()) ?? [],
        waferId: waferList.map(item => item.waferid) ?? [],
        recipeId: recipeList.map(item => item.recipeid) ?? []
    }
}

export {
    checkWaferExists,
    getBaselineWafers,
    getModuleAndToolList,
    getOtherOptionsList,
    getUChartTimeRangeWafers,
    getUChartWafers,
    getWaferRecipeList
};

