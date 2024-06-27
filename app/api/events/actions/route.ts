import { getActionEvents } from '@/app/be/services/events';
import { NextRequest, NextResponse } from 'next/server';
import { GetActionEventsParams } from './request-dto';

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

    const data: GetActionEventsParams = {
        toolId,
        moduleId,
        lotId,
        carrierId,
        slotNo: Number(slotNo),
        waferId
    }

    try {
        const actionEvents = await getActionEvents(data)
        return NextResponse.json(actionEvents)
    } catch (error) {
        return NextResponse.json(error)
    }
}