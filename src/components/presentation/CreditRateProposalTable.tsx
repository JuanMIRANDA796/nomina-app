'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
    {
        name: 'CONSUMO',
        rows: [
            { modalidad: 'Soat', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Libre Inversión', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Viajes', actMin: '22,99%', actMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
            { modalidad: 'Educación, Salud, Emp.', actMin: '12,00%', actMax: '-', propMin: '12,68%', propMax: '-', mvMin: '1,00%', mvMax: '-' },
            { modalidad: 'Centro Vacacionales', actMin: '15,00%', actMax: '-', propMin: '15,50%', propMax: '-', mvMin: '1,21%', mvMax: '-' },
        ]
    },
    {
        name: 'VIVIENDA',
        rows: [
            { modalidad: 'Vivienda VIS', actMin: '12,40%', actMax: '-', propMin: '13,79%', propMax: '-', mvMin: '1,08%', mvMax: '-' },
            { modalidad: 'Vivienda No VIS', actMin: '12,60%', actMax: '-', propMin: '14,13%', propMax: '-', mvMin: '1,11%', mvMax: '-' },
            { modalidad: 'Plan Mi Casa VIS', actMin: '12,27%', actMax: '-', propMin: '13,12%', propMax: '-', mvMin: '1,03%', mvMax: '-' },
            { modalidad: 'Plan Mi Casa No VIS', actMin: '12,40%', actMax: '-', propMin: '13,57%', propMax: '-', mvMin: '1,07%', mvMax: '-' },
        ]
    },
    {
        name: 'COMPRA DE CARTERA',
        rows: [
            { modalidad: 'Compra Cartera', actMin: '16,10%', actMax: '19,56%', propMin: '16,65%', propMax: '20,15%', mvMin: '1,29%', mvMax: '1,54%' },
            { modalidad: 'Línea de Vehículo', actMin: '15,00%', actMax: '17,00%', propMin: '16,65%', propMax: '18,97%', mvMin: '1,29%', mvMax: '1,46%' },
        ]
    },
    {
        name: 'HIPOTECARIO OTROS USOS',
        rows: [
            { modalidad: '0-5 Años', actMin: '15,99%', actMax: '-', propMin: '16,42%', propMax: '-', mvMin: '1,28%', mvMax: '-' },
            { modalidad: '5-10 Años', actMin: '16,60%', actMax: '-', propMin: '17,09%', propMax: '-', mvMin: '1,32%', mvMax: '-' },
            { modalidad: '10-15 Años', actMin: '17,30%', actMax: '-', propMin: '17,76%', propMax: '-', mvMin: '1,37%', mvMax: '-' },
            { modalidad: '15-20 Años', actMin: '18,00%', actMax: '-', propMin: '18,44%', propMax: '-', mvMin: '1,42%', mvMax: '-' },
        ]
    }
];

export default function CreditRateProposalTable() {
    return (
        <div className="w-full h-full bg-[#121212] rounded-3xl border border-white/5 p-8 flex flex-col shadow-2xl font-sans overflow-hidden">
            <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Propuesta Cambio de Tasas Crédito</h2>
                    <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Acuerdo de Comité 19/03/2026</p>
                </div>
                <div className="text-pink-600 font-black text-[10px] uppercase tracking-[0.2em]">Estrictamente Confidencial</div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0a0a0a] rounded-2xl border border-white/10 custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-[#1a1a1a]">
                            <th className="px-4 py-6 text-left text-sm font-black text-white border border-white/10 w-1/4"></th>
                            <th colSpan={2} className="px-4 py-2 text-center text-[11px] font-black text-white border border-white/10 bg-slate-800">Actual ea</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-[11px] font-black text-white border border-white/10 bg-pink-900/40">Propuesta EA</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-[11px] font-black text-white border border-white/10 bg-slate-800">MV (Mes Vencido)</th>
                        </tr>
                        <tr className="bg-[#222]">
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border border-white/10">Modalidad</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-500 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-500 uppercase border border-white/10">Tasa Max</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-pink-500 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-pink-500 uppercase border border-white/10">Tasa Max</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-500 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-4 py-1.5 text-center text-[9px] font-black text-slate-500 uppercase border border-white/10">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SECTIONS.map((section, sIdx) => (
                            <React.Fragment key={sIdx}>
                                <tr className="bg-white/5">
                                    <td colSpan={7} className="px-4 py-2 text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] border border-white/10 bg-black/40">
                                        {section.name}
                                    </td>
                                </tr>
                                {section.rows.map((row, rIdx) => (
                                    <tr key={`${sIdx}-${rIdx}`} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                        <td className="px-4 py-3 text-[12px] font-bold text-slate-200 border border-white/10">{row.modalidad}</td>
                                        <td className="px-4 py-2 text-center text-[11px] text-slate-400 border border-white/10">{row.actMin}</td>
                                        <td className="px-4 py-2 text-center text-[11px] text-slate-600 border border-white/10 italic">{row.actMax}</td>
                                        <td className="px-4 py-2 text-center text-[12px] text-white font-black border border-white/10 bg-pink-500/5">{row.propMin}</td>
                                        <td className="px-4 py-2 text-center text-[11px] text-pink-300 font-bold border border-white/10 bg-pink-500/5 italic">{row.propMax}</td>
                                        <td className="px-4 py-2 text-center text-[11px] text-slate-400 border border-white/10">{row.mvMin}</td>
                                        <td className="px-4 py-2 text-center text-[11px] text-slate-600 border border-white/10 italic">{row.mvMax}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 12, 90, 0.3);
                }
            `}</style>
        </div>
    );
}
