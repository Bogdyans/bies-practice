// controllers/status.db
import { NextResponse } from 'next/server';
import StatusController from "@/controllers/status";

export async function GET() {
    try {
        const result = StatusController.getDBStatus()

        return NextResponse.json({ status: 'success', version: result });
    } catch {

        return NextResponse.json({ status: 'error', message: 'Failed to connect to the database' }, { status: 500 });
    }
}