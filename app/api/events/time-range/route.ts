import { getEventTimeRange } from '@/app/be/services/events';
import { NextRequest, NextResponse } from 'next/server';
import { GetEventTimeRangeParams } from './request-dto';
import { EventTimeRange } from './response-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    const lotId = params.get('lotId') as string
    const carrierId = params.get('carrierId') as string
    const slotNo = params.get('slotNo') as string
    const waferId = params.get('waferId') as string
    const event = params.get('event') as string

    if (!toolId || !moduleId || !lotId || !carrierId || !slotNo || !waferId || !event) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    const data: GetEventTimeRangeParams = {
        toolId,
        moduleId,
        lotId,
        carrierId,
        slotNo: Number(slotNo),
        waferId,
        event
    }

    try {
        const timeRange: EventTimeRange = await getEventTimeRange(data)
        return NextResponse.json(timeRange)
    } catch (error) {
        return NextResponse.json(error)
    }
}