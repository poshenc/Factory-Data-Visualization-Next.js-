import { getUChartTimeRangeWafers } from '@/app/be/services/wafers';
import { NextRequest, NextResponse } from 'next/server';
import { GetUChartTimeRangeWafersParams } from './request-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const sdate = params.get('sdate') as string
    const edate = params.get('edate') as string
    const items = params.getAll('items[]') as string[]

    if (!toolId || !sdate || !edate) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    if (items.length === 0) return NextResponse.json([])

    const data: GetUChartTimeRangeWafersParams = {
        toolId,
        sdate,
        edate,
        items
    }

    try {
        const summaryData = await getUChartTimeRangeWafers(data)
        return NextResponse.json(summaryData)
    } catch (error) {
        return NextResponse.json(error)
    }
}