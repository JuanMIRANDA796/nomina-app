import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SHARED_ID = 'main-presentation-v1';

export async function GET() {
    try {
        const snapshot = await prisma.presentationSnapshot.findUnique({
            where: { id: SHARED_ID }
        });
        
        if (!snapshot) {
            return NextResponse.json({ data: null }, {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                }
            });
        }
        return NextResponse.json({ ...snapshot, serverVersion: 'v2.1.3' }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            }
        });
    } catch (error: any) {
        console.error('Shared presentation fetch error:', error);
        return NextResponse.json({ error: 'Server error', status: 500, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data } = body;

        // Upsert the main presentation state
        const snapshot = await prisma.presentationSnapshot.upsert({
            where: { id: SHARED_ID },
            update: { data },
            create: { id: SHARED_ID, data }
        });

        return NextResponse.json({ success: true, id: snapshot.id, updatedAt: snapshot.updatedAt });
    } catch (error: any) {
        console.error('Shared presentation save error:', error);
        return NextResponse.json({ error: 'Server error', status: 500, message: error.message }, { status: 500 });
    }
}
