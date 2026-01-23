
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const slides = await prisma.presentationSlide.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(slides);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, content, data, title } = body;

        const updatedSlide = await prisma.presentationSlide.update({
            where: { id },
            data: {
                content,
                data,
                title
            },
        });

        return NextResponse.json(updatedSlide);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}
