'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-1.5 bg-pink-600 rounded-full" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{title}</h2>
    </div>
);

const AtribucionCard = ({ title, description, formula }: { title: string, description: string, formula: string }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-pink-500/30 transition-all shadow-xl group"
    >
        <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-pink-500 flex items-center gap-3">
                <span className="w-10 h-10 flex items-center justify-center bg-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    {title === 'Consumo' ? '💰' : '🏠'}
                </span>
                {title}
            </h3>
            <p className="text-slate-200 text-lg leading-relaxed font-light">
                {description}
            </p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4 group-hover:bg-pink-600/5 transition-colors">
                <div className="text-xs font-bold text-pink-500 uppercase tracking-widest whitespace-nowrap">Tasa Mínima :</div>
                <div className="text-xl font-mono text-emerald-400 font-bold tracking-tight">
                    {formula}
                </div>
            </div>
        </div>
    </motion.div>
);

export default function FinancialLeaderAttributionsSlide() {
    return (
        <div className="w-full h-full p-8 md:p-12 flex flex-col items-center bg-slate-950 text-white overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl flex justify-between items-start mb-12 shrink-0">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Atribuciones Líder Financiero</h1>
                    <div className="h-1.5 w-48 bg-pink-600 rounded-full shadow-[0_0_20px_rgba(233,30,99,0.5)]" />
                </div>
                <div className="relative w-32 h-12 md:w-48 md:h-16 opacity-30">
                    <img src="/logo-presente.png" alt="Presente" className="object-contain w-full h-full brightness-0 invert" />
                </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col gap-6 md:gap-8 pb-12 shrink-0">
                <AtribucionCard
                    title="Consumo"
                    description="Se solicita otorgar atribuciones al Líder Financiero para negociar la tasa de interés de créditos de consumo que generen un buen negocio para el Fondo."
                    formula="Tasa marginal de la deuda + 300 puntos básicos."
                />

                <AtribucionCard
                    title="Vivienda"
                    description="Se solicita otorgar atribuciones al Líder Financiero para negociar la tasa de interés de créditos de vivienda que generen un buen negocio para el Fondo."
                    formula="Tasa marginal de la deuda + 50 puntos básicos."
                />
            </div>

            <p className="mt-16 text-slate-500 text-sm font-medium animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Propuesta de negociación autónoma bajo criterios de rentabilidad.
            </p>
        </div>
    );
}
