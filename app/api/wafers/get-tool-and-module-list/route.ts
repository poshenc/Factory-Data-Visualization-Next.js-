import { getModuleAndToolList } from "@/app/be/services/wafers"
import { NextResponse } from "next/server"
import { ToolAndModuleList } from "./response-dto"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const moduleAndToolList: ToolAndModuleList = await getModuleAndToolList()
        return NextResponse.json(moduleAndToolList)
    } catch (error) {
        return NextResponse.json(error)
    }
}

