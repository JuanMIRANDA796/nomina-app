'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
    {
        name: 'CONSUMO',
        rows: [
            { modalidad: 'SOAT', actMin: '23,00%', actMax: '-', propMin: '23,00%', propMax: '25,27%', mvMin: '1,74%', mvMax: '1,89%' },
            { modalidad: 'Libre Inversión', actMin: '23,00%', actMax: '-', propMin: '23,00%', propMax: '25,27%', mvMin: '1,74%', mvMax: '1,89%' },
            { modalidad: 'Viajes', actMin: '23,00%', actMax: '-', propMin: '23,00%', propMax: '25,27%', mvMin: '1,74%', mvMax: '1,89%' },
            { modalidad: 'Educación, Calam., Salud, Emp.', actMin: '12,00%', actMax: '-', propMin: '12,00%', propMax: '18,67%', mvMin: '0,95%', mvMax: '1,44%' },
            { modalidad: 'Centro Vacacionales', actMin: '15,00%', actMax: '-', propMin: '15,00%', propMax: '20,94%', mvMin: '1,17%', mvMax: '1,60%' },
        ]
    },
    {
        name: 'COMPRA DE CARTERA & VEHÍCULO',
        rows: [
            { modalidad: 'Compra de Cartera', actMin: '16,10%', actMax: '19,56%', propMin: '16,10%', propMax: '19,56%', mvMin: '1,25%', mvMax: '1,50%' },
            { modalidad: 'Vehículo', actMin: '15,00%', actMax: '17,00%', propMin: '15,00%', propMax: '17,00%', mvMin: '1,17%', mvMax: '1,32%' },
        ]
    },
    {
        name: 'VIVIENDA',
        rows: [
            { modalidad: 'Plan Mi Casa VIS', actMin: '12,27%', actMax: '-', propMin: '12,27%', propMax: '-', mvMin: '0,97%', mvMax: '-' },
            { modalidad: 'Plan Mi Casa No VIS', actMin: '12,40%', actMax: '-', propMin: '12,40%', propMax: '-', mvMin: '0,98%', mvMax: '-' },
            { modalidad: 'Vivienda VIS', actMin: '12,40%', actMax: '-', propMin: '12,40%', propMax: '-', mvMin: '0,98%', mvMax: '-' },
            { modalidad: 'Vivienda No VIS', actMin: '12,60%', actMax: '-', propMin: '12,60%', propMax: '-', mvMin: '0,99%', mvMax: '-' },
        ]
    },
    {
        name: 'HIPOTECARIO OTROS USOS',
        rows: [
            { modalidad: 'Hipotecario (0-5 Años)', actMin: '16,00%', actMax: '-', propMin: '16,00%', propMax: '-', mvMin: '1,24%', mvMax: '-' },
            { modalidad: 'Hipotecario (5-10 Años)', actMin: '16,67%', actMax: '-', propMin: '16,67%', propMax: '-', mvMin: '1,29%', mvMax: '-' },
            { modalidad: 'Hipotecario (10-15 Años)', actMin: '17,33%', actMax: '-', propMin: '17,33%', propMax: '-', mvMin: '1,34%', mvMax: '-' },
            { modalidad: 'Hipotecario (15-20 Años)', actMin: '18,00%', actMax: '-', propMin: '18,00%', propMax: '-', mvMin: '1,39%', mvMax: '-' },
        ]
    }
];

export default function CreditRateProposalTable() {
    return (
        <div className="w-full h-full bg-[#1e1e1e] rounded-3xl border border-white/5 p-4 md:p-6 flex flex-col shadow-2xl font-sans overflow-hidden">
            <div className="mb-3 flex justify-between items-end border-b border-white/10 pb-2">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Propuesta de Tasas de Crédito</h2>
                    <p className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest">Acuerdo Estratégico Comité Ejecutivo 2026</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-xl border border-white/10 shadow-inner">
                <table className="w-full border-collapse h-full">
                    <thead className="sticky top-0 z-30">
                        <tr className="bg-slate-900 border-b border-white/10">
                            <th className="px-4 py-1 text-left text-xs font-black text-white w-1/4"></th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-slate-400 border-x border-white/5 uppercase">Actual EA</th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-pink-500 border-x border-white/5 uppercase bg-pink-500/5">Propuesta EA</th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-slate-400 border-x border-white/5 uppercase">MV (Mes Vencido)</th>
                        </tr>
                        <tr className="bg-[#1a1a1a] shadow-md">
                            <th className="px-4 py-1.5 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/10">Modalidad</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Max</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {SECTIONS.map((section, sIdx) => (
                            <React.Fragment key={sIdx}>
                                <tr className="bg-black/50">
                                    <td colSpan={7} className="px-4 py-1 text-[9px] font-black text-pink-500 uppercase tracking-[0.4em] border-y border-white/5 bg-slate-950/40">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-1 bg-pink-600 rounded-full"></div>
                                            {section.name}
                                        </div>
                                    </td>
                                </tr>
                                {section.rows.map((row, rIdx) => (
                                    <tr key={`${sIdx}-${rIdx}`} className="hover:bg-white/5 transition-all duration-200">
                                        <td className="px-4 py-1 text-[11px] font-black text-slate-100 uppercase tracking-tight">{row.modalidad}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-400 border-x border-white/5">{row.actMin}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-600 italic border-x border-white/5">{row.actMax}</td>
                                        <td className="px-2 py-1 text-center text-[11px] text-white font-black border-x border-white/5 bg-pink-500/5">{row.propMin}</td>
                                        <td className="px-2 py-1 text-center text-[11px] text-pink-200 font-bold border-x border-white/5 bg-pink-500/5 italic">{row.propMax}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-300 font-bold border-x border-white/5">{row.mvMin}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-500 border-x border-white/5 italic">{row.mvMax}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex justify-between items-center text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-50">
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
