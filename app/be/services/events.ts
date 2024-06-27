import { GetActionEventsParams } from '@/app/api/events/actions/request-dto'
import { GetStepsTimeRangeParams } from '@/app/api/events/steps/request-dto'
import { GetEventTimeRangeParams } from '@/app/api/events/time-range/request-dto'
import { EventTimeRange } from '@/app/api/events/time-range/response-dto'
import prisma from '@/lib/prisma'

async function getActionEvents({ toolId, moduleId, lotId, carrierId, slotNo, waferId }: GetActionEventsParams) {
    const waferInfo = await prisma.wafer_process_info.findFirst({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            lotid: lotId,
            carrierid: carrierId,
            slotno: Number(slotNo),
            waferid: waferId
        },
    })

    if (!waferInfo) return []

    const events = await prisma.ods_equevtlog.groupBy({
        by: ['event'],
        where: {
            time: {
                gte: new Date(waferInfo.sdate!),
                lte: new Date(waferInfo.edate!),
            },
            toolid: toolId,
            moduleid: moduleId,
            type: {
                in: ['S', 'R']
            }
        },
        having: {
            event: {
                _count: {
                    gte: 2
                }
            }
        }
    })

    const alignStep = ''
    let filteredEvents: string[] = []

    if (alignStep) {
        const eventTimeRange = await prisma.ods_equevtlog.findMany({
            where: {
                toolid: toolId,
                moduleid: moduleId,
                time: {
                    gte: new Date(waferInfo.sdate!),
                    lte: new Date(waferInfo.edate!)
                },
                event: {
                    in: events.map(event => event.event!)
                }
            },
            orderBy: [
                { event: 'asc' },
                { time: 'asc' }
            ],
            select: {
                time: true,
                event: true,
                action: true
            }
        })

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

        const eventsData = transformEventData(eventTimeRange)

        eventsData.data.forEach((event: any) => {
            if (event.x[1] > stepRange!.sdate! && !filteredEvents.includes(event.y)) {
                filteredEvents.push(event.y)
            }
        })
    } else {
        filteredEvents = events.map(event => event.event!)
    }

    return filteredEvents
}

async function getStepsTimeRange({ toolId, moduleId, lotId, carrierId, slotNo, waferId }: GetStepsTimeRangeParams) {
    const waferInfo = await prisma.wafer_process_info.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            lotid: lotId,
            carrierid: carrierId,
            slotno: Number(slotNo),
            waferid: waferId
        },
    })

    const stepsStartTime = await prisma.ods_equevtlog.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            time: {
                gte: new Date(waferInfo[0].sdate!),
                lte: new Date(waferInfo[0].edate!)
            },
            action: 'R-STEP START'
        },
        orderBy: [
            { event: 'asc' },
            { time: 'asc' }
        ],
        select: {
            time: true,
            recipestepno: true
        }
    })

    stepsStartTime.forEach(data => {
        if (data.time) data.time = roundMilliseconds(data.time)
    })

    return stepsStartTime ?? []
}

async function getEventTimeRange({ toolId, moduleId, lotId, carrierId, slotNo, waferId, event }: GetEventTimeRangeParams) {
    const waferInfo = await prisma.wafer_process_info.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            lotid: lotId,
            carrierid: carrierId,
            slotno: Number(slotNo),
            waferid: waferId
        },
    })

    const eventTimeRange = await prisma.ods_equevtlog.findMany({
        where: {
            toolid: toolId,
            moduleid: moduleId,
            time: {
                gte: new Date(waferInfo[0].sdate!),
                lte: new Date(waferInfo[0].edate!)
            },
            event: event
        },
        orderBy: [
            { event: 'asc' },
            { time: 'asc' }
        ],
        select: {
            time: true,
            event: true,
            action: true
        }
    })

    const result = transformEventData(eventTimeRange)

    return result
}

function transformEventData(input: {
    event: string | null;
    time: Date | null;
    action: string | null;
}[]) {
    const startList = [
        "OPEN",
        "ON",
        "STEP START",
        "UP",
        "R-STEP START"
    ]

    const endList = [
        "OFF",
        "COMPLETE",
        "CLOSE",
        "AUTO EXIT",
        "DOWN",
        "STEP END",
        "R-STEP END",
    ]

    const result: EventTimeRange = {
        label: '',
        data: []
    };

    let currentEvent: {
        x: Date[]
        y: string
    } | null = null

    input.forEach(item => {
        // Convert start date to timestamp in milliseconds
        const roundedTime = roundMilliseconds(item.time!)

        if (startList.includes(item.action!)) {
            // If a new event starts, create a new entry
            if (!currentEvent) {
                currentEvent = { x: [roundedTime], y: item.event! };
                result.label = item.event ?? ''; // Set label for the event
            } else {
                // If an event is already in progress, add start time to the existing event
                currentEvent.x[0] = roundedTime;
            }
        } else if (endList.includes(item.action!) && currentEvent) {
            // Add end time to the current event and push it to the result
            currentEvent.x[1] = roundedTime;
            result.data.push(currentEvent);
            currentEvent = null; // Reset currentEvent for the next pair
        }
    });

    return result;
}

function roundMilliseconds(date: Date) {
    let milliseconds = date.getMilliseconds()
    let roundedMilliseconds = Math.round(milliseconds / 100) * 100

    date.setMilliseconds(roundedMilliseconds)

    return date
}

export { getActionEvents, getEventTimeRange, getStepsTimeRange }

