'use client';

import PricingCards from '@/components/PricingCards';
import NominaXLogo from '@/components/NominaXLogo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlanesPage() {
    return (
        <main className="min-h-screen bg-[#0f1014] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden pt-20">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-[#0f1014]/80 backdrop-blur-md border-b border-gray-800">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:block">Volver al inicio</span>
                </Link>
                <NominaXLogo className="scale-75 origin-center" lightTheme={true} />
                <Link
                    href="/"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-900/20 text-sm md:text-base border border-blue-500/50"
                >
                    Iniciar Sesión
                </Link>
            </header>

            <div className="bg-white rounded-t-[3rem] mt-12 min-h-screen pb-20 pt-10">
                <PricingCards />
            </div>
        </main>
    );
}
