'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
    {
        name: 'CONSUMO',
        rows: [
            { modalidad: 'Soat', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Libre Inversión', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Viaje', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Educación, Salud, Emp.', actMin: '12,02%', actMax: '-', propMin: '12,68%', propMax: '-', mvMin: '1,00%', mvMax: '-' },
            { modalidad: 'Centro Vacacionales', actMin: '15,01%', actMax: '-', propMin: '15,50%', propMax: '-', mvMin: '1,21%', mvMax: '-' },
        ]
    },
    {
        name: 'VIVIENDA',
        rows: [
            { modalidad: 'Vivienda VIS', actMin: '12,40%', actMax: '-', propMin: '13,790%', propMax: '-', mvMin: '1,08%', mvMax: '-' },
            { modalidad: 'Vivienda No VIS', actMin: '12,60%', actMax: '-', propMin: '14,129%', propMax: '-', mvMin: '1,11%', mvMax: '-' },
            { modalidad: 'Plan Mi Casa VIS', actMin: '12,27%', actMax: '-', propMin: '13,117%', propMax: '-', mvMin: '1,03%', mvMax: '-' },
            { modalidad: 'Plan Mi Casa No VIS', actMin: '12,40%', actMax: '-', propMin: '13,566%', propMax: '-', mvMin: '1,07%', mvMax: '-' },
        ]
    },
    {
        name: 'COMPRA DE CARTERA & VEHÍCULO',
        rows: [
            { modalidad: 'Compra de Cartera', actMin: '16,10%', actMax: '19,56%', propMin: '16,650%', propMax: '20,152%', mvMin: '1,29%', mvMax: '1,54%' },
            { modalidad: 'Línea de Vehículo', actMin: '15,00%', actMax: '17,04%', propMin: '16,650%', propMax: '18,974%', mvMin: '1,29%', mvMax: '1,46%' },
        ]
    },
    {
        name: 'HIPOTECARIO OTROS USOS',
        rows: [
            { modalidad: 'Hipotecario (0-5 Años)', actMin: '15,99%', actMax: '-', propMin: '16,420%', propMax: '-', mvMin: '1,28%', mvMax: '-' },
            { modalidad: 'Hipotecario (5-10 Años)', actMin: '16,60%', actMax: '-', propMin: '17,088%', propMax: '-', mvMin: '1,32%', mvMax: '-' },
            { modalidad: 'Hipotecario (10-15 Años)', actMin: '17,30%', actMax: '-', propMin: '17,760%', propMax: '-', mvMin: '1,37%', mvMax: '-' },
            { modalidad: 'Hipotecario (15-20 Años)', actMin: '18,00%', actMax: '-', propMin: '18,436%', propMax: '-', mvMin: '1,42%', mvMax: '-' },
        ]
    }
];

export default function CreditRateProposalTable() {
    return (
        <div className="w-full h-full bg-[#1e1e1e] rounded-3xl border border-white/5 p-8 flex flex-col shadow-2xl font-sans overflow-hidden">
            <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Propuesta de Tasas de Crédito</h2>
                    <p className="text-slate-500 text-xs mt-1 font-black uppercase tracking-widest">Acuerdo Estratégico Comité Ejecutivo 2026</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0a0a0a] rounded-2xl border border-white/10 custom-scrollbar shadow-inner">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-30">
                        <tr className="bg-slate-900 border-b border-white/10">
                            <th className="px-6 py-6 text-left text-sm font-black text-white w-1/4"></th>
                            <th colSpan={2} className="px-4 py-3 text-center text-[10px] font-black text-slate-400 border-x border-white/5 uppercase">Actual EA</th>
                            <th colSpan={2} className="px-4 py-3 text-center text-[10px] font-black text-pink-500 border-x border-white/5 uppercase bg-pink-500/5">Propuesta EA</th>
                            <th colSpan={2} className="px-4 py-3 text-center text-[10px] font-black text-slate-400 border-x border-white/5 uppercase">MV (Mes Vencido)</th>
                        </tr>
                        <tr className="bg-[#1a1a1a] shadow-md">
                            <th className="px-6 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border border-white/10">Modalidad</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Max</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {SECTIONS.map((section, sIdx) => (
                            <React.Fragment key={sIdx}>
                                <tr className="bg-black/50">
                                    <td colSpan={7} className="px-6 py-2.5 text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] border-y border-white/5 bg-slate-950/40">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-1 bg-pink-600 rounded-full"></div>
                                            {section.name}
                                        </div>
                                    </td>
                                </tr>
                                {section.rows.map((row, rIdx) => (
                                    <tr key={`${sIdx}-${rIdx}`} className="hover:bg-white/5 transition-all duration-200">
                                        <td className="px-6 py-4 text-[13px] font-black text-slate-100 uppercase tracking-tight">{row.modalidad}</td>
                                        <td className="px-4 py-4 text-center text-[11px] text-slate-400 border-x border-white/5">{row.actMin}</td>
                                        <td className="px-4 py-4 text-center text-[11px] text-slate-600 italic border-x border-white/5">{row.actMax}</td>
                                        <td className="px-4 py-4 text-center text-[13px] text-white font-black border-x border-white/5 bg-pink-500/5">{row.propMin}</td>
                                        <td className="px-4 py-4 text-center text-[12px] text-pink-200 font-bold border-x border-white/5 bg-pink-500/5 italic">{row.propMax}</td>
                                        <td className="px-4 py-4 text-center text-[11px] text-slate-400 border-x border-white/5">{row.mvMin}</td>
                                        <td className="px-4 py-4 text-center text-[11px] text-slate-600 border-x border-white/5 italic">{row.mvMax}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-50">
                <span>Comité de Crédito / Marzo 2026</span>
                <span className="text-pink-600 font-bold uppercase">Estrictamente Confidencial</span>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 20, 147, 0.4);
                }
            `}</style>
        </div>
    );
}
