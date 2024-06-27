import { checkWaferExists } from "@/app/be/services/wafers";
import { NextRequest, NextResponse } from "next/server";
import { GetWaferExistsParams } from "./request-dto";

export async function POST(req: NextRequest) {
    const request: GetWaferExistsParams = await req.json()

    try {
        const isExist: boolean = await checkWaferExists(request)
        return NextResponse.json(isExist)
    } catch (error) {
        return NextResponse.json(error)
    }
}