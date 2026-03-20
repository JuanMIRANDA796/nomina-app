'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DATA = [
    { mod: 'SOAT', actMin: '23,00%', actMax: '-', pMin: '24,36%', pMax: '-', mvMin: '1,83%', mvMax: '-' },
    { mod: 'Libre Inversión', actMin: '23,00%', actMax: '-', pMin: '24,36%', pMax: '-', mvMin: '1,83%', mvMax: '-' },
    { mod: 'Viajes', actMin: '23,00%', actMax: '-', pMin: '24,36%', pMax: '-', mvMin: '1,83%', mvMax: '-' },
    { mod: 'Educación, Calamidad, Salud y Emprendimiento', actMin: '12,00%', actMax: '-', pMin: '12,68%', pMax: '-', mvMin: '1,00%', mvMax: '-' },
    { mod: 'Centro Vacacionales', actMin: '15,00%', actMax: '-', pMin: '15,50%', pMax: '-', mvMin: '1,21%', mvMax: '-' },
    { mod: 'Vehículo', actMin: '15,00%', actMax: '17,00%', pMin: '16,65%', pMax: '18,97%', mvMin: '1,29%', mvMax: '1,46%' },
    { mod: 'Compra de cartera', actMin: '16,10%', actMax: '19,56%', pMin: '16,65%', pMax: '20,15%', mvMin: '1,29%', mvMax: '1,54%' },
    { mod: 'Vivienda Presente VIS', actMin: '12,40%', actMax: '-', pMin: '13,79%', pMax: '-', mvMin: '1,08%', mvMax: '-' },
    { mod: 'Vivienda Presente No VIS', actMin: '12,60%', actMax: '-', pMin: '14,13%', pMax: '-', mvMin: '1,11%', mvMax: '-' },
    { mod: 'Plan Mi Casa VIS', actMin: '12,27%', actMax: '-', pMin: '13,12%', pMax: '-', mvMin: '1,03%', mvMax: '-' },
    { mod: 'Plan Mi Casa NO VIS', actMin: '12,40%', actMax: '-', pMin: '13,57%', pMax: '-', mvMin: '1,07%', mvMax: '-' },
    { mod: 'Hipotecario (0-5 Años)', actMin: '16,00%', actMax: '-', pMin: '16,42%', pMax: '-', mvMin: '1,28%', mvMax: '-' },
    { mod: 'Hipotecario (>5-10 Años)', actMin: '16,66%', actMax: '-', pMin: '17,09%', pMax: '-', mvMin: '1,32%', mvMax: '-' },
    { mod: 'Hipotecario (>10-15 Años)', actMin: '17,33%', actMax: '-', pMin: '17,76%', pMax: '-', mvMin: '1,37%', mvMax: '-' },
    { mod: 'Hipotecario (>15-20 Años)', actMin: '18,01%', actMax: '-', pMin: '18,44%', pMax: '-', mvMin: '1,42%', mvMax: '-' },
];

export default function CreditRateProposalSummaryTable() {
    return (
        <div className="w-full h-full bg-[#050505] rounded-[2.5rem] border border-white/10 p-10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/5 to-transparent pointer-events-none"></div>

            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        Propuesta cambio de tasas crédito <span className="text-pink-600">Resumen</span>
                    </h2>
                    <div className="h-1 w-32 bg-pink-600 rounded-full mb-4"></div>
                    <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">Consolidado General de Tasas E.A. y M.V.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Periodo Sugerido</p>
                    <p className="text-white font-bold text-lg">Marzo 2026</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-black/40 rounded-3xl border border-white/5 custom-scrollbar backdrop-blur-sm shadow-2xl">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-40">
                        <tr className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b-2 border-white/10">
                            <th className="px-8 py-8 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] w-1/4">Escenario</th>
                            <th colSpan={2} className="px-4 py-4 text-center text-[10px] font-black text-slate-400 border-x border-white/5">Actual EA</th>
                            <th colSpan={2} className="px-4 py-4 text-center text-[10px] font-black text-pink-500 border-x border-white/5 bg-pink-500/5">Propuesta EA</th>
                            <th colSpan={2} className="px-4 py-4 text-center text-[10px] font-black text-slate-400 border-x border-white/5">MV (Mes Vencido)</th>
                        </tr>
                        <tr className="bg-[#111]/90 backdrop-blur-xl shadow-lg">
                            <th className="px-8 py-3 text-left text-[11px] font-black text-white uppercase border-b border-white/5">Modalidad</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/5">Tasa Min</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/5">Tasa Max</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-pink-600 uppercase border border-white/5 bg-pink-500/5">Tasa Min</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-pink-600 uppercase border border-white/5 bg-pink-500/5">Tasa Max</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/5">Tasa Min</th>
                            <th className="px-4 py-2.5 text-center text-[9px] font-black text-slate-600 uppercase border border-white/5">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-all duration-300">
                                <td className="px-8 py-4 text-[13px] font-bold text-slate-200 border-r border-white/5">{row.mod}</td>
                                <td className="px-4 py-4 text-center text-[12px] text-slate-400 border-x border-white/5 font-medium">{row.actMin}</td>
                                <td className="px-4 py-4 text-center text-[12px] text-slate-600 italic border-x border-white/5">{row.actMax}</td>
                                <td className="px-4 py-4 text-center text-[14px] text-white font-black border-x border-white/5 bg-pink-600/5">{row.pMin}</td>
                                <td className="px-4 py-4 text-center text-[14px] text-pink-300 font-black border-x border-white/5 bg-pink-600/5 italic">{row.pMax}</td>
                                <td className="px-4 py-4 text-center text-[12px] text-slate-400 border-x border-white/5 font-medium">{row.mvMin}</td>
                                <td className="px-4 py-4 text-center text-[12px] text-slate-600 font-medium border-x border-white/5 italic">{row.mvMax}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center bg-white/5 px-8 py-4 rounded-2xl border border-white/5">
                <div className="flex gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-pink-600 shadow-[0_0_8px_rgba(219,39,119,0.8)]"></div>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ajuste sugerido a tasas mínimas</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-pink-600 font-black uppercase tracking-[0.3em]">Confidencial · Presente</span>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    border: 2px solid rgba(0,0,0,0.5);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(236, 72, 153, 0.4);
                }
            `}</style>
        </div>
    );
}
