import { getTChartTraces } from '@/app/be/services/traces';
import { NextRequest, NextResponse } from 'next/server';
import { GetTChartTracesParams } from './request-dto';
import { TChartTraces } from './response-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    // const recipeId = params.get('recipeId') as string
    const lotId = params.get('lotId') as string
    const carrierId = params.get('carrierId') as string
    const slotNo = params.get('slotNo') as string
    const waferId = params.get('waferId') as string
    const items = params.getAll('items[]') as string[]
    const alignStep = params.get('alignStep') as string




    if (!toolId || !moduleId || !lotId || !carrierId || !slotNo || !waferId || items.length < 1) {
        return NextResponse.json({})
    }

    const data: GetTChartTracesParams = {
        toolId,
        moduleId,
        // recipeId,
        lotId,
        carrierId,
        slotNo: Number(slotNo),
        waferId,
        items,
        alignStep
    }

    try {
        const summaryData: TChartTraces = await getTChartTraces(data)
        return NextResponse.json(summaryData)
    } catch (error) {
        return NextResponse.json(error)
    }
}