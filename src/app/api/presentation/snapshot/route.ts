import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        const snapshot = await prisma.presentationSnapshot.findUnique({
            where: { id }
        });
        if (!snapshot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(snapshot);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const snapshot = await prisma.presentationSnapshot.create({
            data: {
                data: body.data
            }
        });
        return NextResponse.json({ id: snapshot.id });
    } catch (error) {
        console.error('Snapshot save error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
