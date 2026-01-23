'use client';

import React, { Suspense } from 'react';
import { PresentationProvider } from '@/context/PresentationContext';

export default function PresentationLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-slate-950 flex items-center justify-center text-white">Cargando presentación...</div>}>
            <PresentationProvider>
                {children}
            </PresentationProvider>
        </Suspense>
    );
}
