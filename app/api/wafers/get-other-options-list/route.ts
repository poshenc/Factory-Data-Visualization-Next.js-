import { getOtherOptionsList } from "@/app/be/services/wafers"
import { NextRequest, NextResponse } from "next/server"
import { GetOtherOptionsListParams } from "./request-dto"
import { OtherOptionsList } from "./response-dto"

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams

    const toolId = params.get('toolId') as string
    const moduleId = params.get('moduleId') as string

    if (!toolId || !moduleId) {
        return NextResponse.json({
            message: "Missing params"
        }, {
            status: 400,
        })
    }

    const data: GetOtherOptionsListParams = {
        moduleId,
        toolId
    }

    try {
        const otherOptionsList: OtherOptionsList = await getOtherOptionsList(data)
        return NextResponse.json(otherOptionsList)
    } catch (error) {
        return NextResponse.json(error)
    }
} 