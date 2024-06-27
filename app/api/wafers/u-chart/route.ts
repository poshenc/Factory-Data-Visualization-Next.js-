import { getUChartWafers } from '@/app/be/services/wafers';
import { NextRequest, NextResponse } from 'next/server';
import { GetUChartWafersParams } from './request-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    const sdate = params.get('sdate') as string
    const edate = params.get('edate') as string
    const recipeId = params.get('recipeId') as string
    const items = params.getAll('items[]') as string[]

    if (!toolId || !moduleId || !sdate || !edate) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    if (items.length === 0) return NextResponse.json([])

    const data: GetUChartWafersParams = {
        toolId,
        moduleId,
        sdate,
        edate,
        recipeId,
        items
    }

    try {
        const summaryData = await getUChartWafers(data)
        return NextResponse.json(summaryData)
    } catch (error) {
        return NextResponse.json(error)
    }
}