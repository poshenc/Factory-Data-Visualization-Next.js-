// import { createUser, getAllUsers } from '@/app/be/services/users';
// import { NextResponse } from 'next/server';

// interface Account {
//     name: string
// }

// export async function GET() {
//     try {
//         const users = await getAllUsers()
//         return NextResponse.json(users)
//     } catch (error) {
//         return NextResponse.json(error)
//     }
// }


// export async function POST(req: Request) {
//     const { name }: Account = await req.json()

//     try {
//         const newUser = await createUser(name)
//         return NextResponse.json(newUser)
//     } catch (error) {
//         return NextResponse.json(error)
//     }
// }

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({})
}