// import { startPreWarningExecutor, stopPreWarningExecutor } from '@/app/be/services/pre-warning/executor';
// import { NextResponse } from 'next/server';

// export async function POST() {
//     stopPreWarningExecutor()
//     startPreWarningExecutor()
//     return NextResponse.json('Started pre-warning minitor system.')
// }

// export async function DELETE() {
//     stopPreWarningExecutor()
//     return NextResponse.json('Terminated pre-warning minitor system.')
// }

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({})
}