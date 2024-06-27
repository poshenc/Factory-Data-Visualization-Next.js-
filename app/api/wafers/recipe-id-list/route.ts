import { getWaferRecipeList } from '@/app/be/services/wafers';
import { NextRequest, NextResponse } from 'next/server';
import { GetWafersRecipeListParams } from './request-dto';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string
    const sdate = params.get('sdate') as string
    const edate = params.get('edate') as string

    if (!toolId || !moduleId || !sdate || !edate) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    const data: GetWafersRecipeListParams = {
        toolId,
        moduleId,
        sdate,
        edate
    }

    try {
        const recipeList = await getWaferRecipeList(data)
        return NextResponse.json(recipeList)
    } catch (error) {
        return NextResponse.json(error)
    }
}