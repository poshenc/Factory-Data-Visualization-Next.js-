// import { deleteUser, getUserById, updateUser } from "@/app/be/services/users";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, context: any) {
//     const { params: { userId } } = context

//     try {
//         const user = await getUserById(userId)
//         return NextResponse.json(user)
//     } catch (error) {
//         return NextResponse.json(error)
//     }
// }

// export async function PUT(req: Request, context: any) {
//     const { params: { userId } } = context
//     const { name } = await req.json()

//     try {
//         await updateUser(userId, name)
//         return NextResponse.json({
//             succes: 'updated user succefully'
//         })
//     } catch (error) {
//         return NextResponse.json(error)
//     }
// }

// export async function DELETE(req: Request, context: any) {
//     const { params: { userId } } = context
//     try {
//         await deleteUser(userId)
//         return NextResponse.json({
//             succes: 'deleted user succefully'
//         })
//     } catch (error) {
//         return NextResponse.json(error)
//     }
// }

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({})
}