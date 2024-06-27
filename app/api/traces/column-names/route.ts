import { getTraceColumnNames } from "@/app/be/services/traces"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const columnNames: string[] = await getTraceColumnNames()
        return NextResponse.json(columnNames)
    } catch (error) {
        return NextResponse.json(error)
    }
}