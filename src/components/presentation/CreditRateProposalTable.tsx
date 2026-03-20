'use client';

import React from 'react';
import { motion } from 'framer-motion';

const PROPOSAL_DATA = [
    { modalidad: 'Soat', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'LI (Libre Inversión)', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'Viaje', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'Educación, Salud y Emp.', actualMin: '12,00%', actualMax: '-', propMin: '12,68%', propMax: '-', mvMin: '1,00%', mvMax: '-' },
    { modalidad: 'Vivienda Presente VIS', actualMin: '12,40%', actualMax: '-', propMin: '13,79%', propMax: '-', mvMin: '1,08%', mvMax: '-' },
    { modalidad: 'Vivienda Presente No VIS', actualMin: '12,60%', actualMax: '-', propMin: '14,13%', propMax: '-', mvMin: '1,11%', mvMax: '-' },
    { modalidad: 'Plan Mi Casa VIS', actualMin: '12,27%', actualMax: '-', propMin: '13,12%', propMax: '-', mvMin: '1,03%', mvMax: '-' },
    { modalidad: 'Plan Mi Casa No VIS', actualMin: '12,40%', actualMax: '-', propMin: '13,57%', propMax: '-', mvMin: '1,07%', mvMax: '-' },
    { modalidad: 'Compra Cartera (Min)', actualMin: '16,10%', actualMax: '-', propMin: '16,65%', propMax: '-', mvMin: '1,29%', mvMax: '-' },
];

export default function CreditRateProposalTable() {
    return (
        <div className="w-full h-full bg-[#1e1e1e] rounded-xl border border-white/5 p-8 flex flex-col shadow-2xl font-sans">
            <div className="mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Propuesta Cambio de Tasas Crédito</h2>
            </div>

            <div className="flex-1 overflow-auto bg-[#0a0a0a] rounded-lg border border-white/10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#121212]">
                            <th className="px-4 py-4 text-left text-sm font-bold text-white border border-white/10 w-1/4"></th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold text-white border border-white/10 bg-[#1a1a1a]">Actual ea</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold text-white border border-white/10 bg-[#1a1a1a]">Propuesta EA</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold text-white border border-white/10 bg-[#1a1a1a]">MV</th>
                        </tr>
                        <tr className="bg-[#1a1a1a]">
                            <th className="px-4 py-3 text-left text-sm font-bold text-white border border-white/10">Modalidad</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Max</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Max</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-300 border border-white/10">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPOSAL_DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                <td className="px-4 py-4 text-sm font-bold text-white border border-white/10">{row.modalidad}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-300 border border-white/10">{row.actualMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.actualMax}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-300 border border-white/10 font-medium">{row.propMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.propMax}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-300 border border-white/10">{row.mvMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.mvMax}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Comité de Precios - Marzo 2026</span>
                <span className="text-pink-600">Confidencial</span>
            </div>
        </div>
    );
}
