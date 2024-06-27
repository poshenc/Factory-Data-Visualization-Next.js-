import { getStepsTimeRange } from '@/app/be/services/events';
import { NextRequest, NextResponse } from 'next/server';
import { GetStepsTimeRangeParams } from './request-dto';
import { StepsTimeRange } from './response-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    const lotId = params.get('lotId') as string
    const carrierId = params.get('carrierId') as string
    const slotNo = params.get('slotNo') as string
    const waferId = params.get('waferId') as string

    if (!toolId || !moduleId || !lotId || !carrierId || !slotNo || !waferId) {
        return NextResponse.json([])
    }

    const data: GetStepsTimeRangeParams = {
        toolId,
        moduleId,
        lotId,
        carrierId,
        slotNo: Number(slotNo),
        waferId
    }

    try {
        const timeRange: StepsTimeRange[] = await getStepsTimeRange(data)
        return NextResponse.json(timeRange)
    } catch (error) {
        return NextResponse.json(error)
    }
}