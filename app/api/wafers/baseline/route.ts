import { getBaselineWafers } from '@/app/be/services/wafers';
import { NextRequest, NextResponse } from 'next/server';
import { GetBaselineWafersParams } from './request-dto';
import { BaselineWafers } from './response-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    const sdate = params.get('sdate') as string
    const edate = params.get('edate') as string
    const recipeId = params.get('recipeId') as string
    const items = params.getAll('items[]') as string[]
    const alignStep = params.get('alignStep') as string

    if (!toolId || !moduleId || !sdate || !edate) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    if (!items[0]) return NextResponse.json([])

    const data: GetBaselineWafersParams = {
        toolId,
        moduleId,
        sdate,
        edate,
        recipeId,
        items,
        alignStep
    }

    try {
        const summaryData: BaselineWafers = await getBaselineWafers(data)
        return NextResponse.json(summaryData)
    } catch (error) {
        return NextResponse.json(error)
    }
}