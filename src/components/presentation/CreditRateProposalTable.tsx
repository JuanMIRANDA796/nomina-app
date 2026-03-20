'use client';

import React from 'react';
import { motion } from 'framer-motion';

const PROPOSAL_DATA = [
    { modalidad: 'Soat', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'Libre Inversión', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'Viaje', actualMin: '22,99%', actualMax: '-', propMin: '24,36%', propMax: '-', mvMin: '1,83%', mvMax: '-' },
    { modalidad: 'Educación, Calamidad, Salud y Emp.', actualMin: '12,00%', actualMax: '-', propMin: '12,68%', propMax: '-', mvMin: '1,00%', mvMax: '-' },
    { modalidad: 'Centro Vacacionales', actualMin: '15,00%', actualMax: '-', propMin: '15,50%', propMax: '-', mvMin: '1,21%', mvMax: '-' },
    { modalidad: 'Compra de Cartera (Tasa Mínima)', actualMin: '16,10%', actualMax: '-', propMin: '16,65%', propMax: '-', mvMin: '1,29%', mvMax: '-' },
    { modalidad: 'Vivienda Presente VIS', actualMin: '12,40%', actualMax: '-', propMin: '13,79%', propMax: '-', mvMin: '1,08%', mvMax: '-' },
    { modalidad: 'Vivienda Presente No VIS', actualMin: '12,60%', actualMax: '-', propMin: '14,13%', propMax: '-', mvMin: '1,11%', mvMax: '-' },
    { modalidad: 'Plan Mi Casa VIS', actualMin: '12,27%', actualMax: '-', propMin: '13,117%', propMax: '-', mvMin: '1,03%', mvMax: '-' },
    { modalidad: 'Plan Mi Casa No VIS', actualMin: '12,40%', actualMax: '-', propMin: '13,566%', propMax: '-', mvMin: '1,07%', mvMax: '-' },
];

export default function CreditRateProposalTable() {
    return (
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Propuesta Cambio de Tasas Crédito</h2>
                <p className="text-slate-400 mt-1">Comparativo de tasas actuales vs propuestas</p>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-black/30">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#D4145A] text-white">
                            <th rowSpan={2} className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border border-white/20 min-w-[200px]">Modalidad</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold uppercase tracking-wider border border-white/20">Actual ea</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold uppercase tracking-wider border border-white/20">Propuesta EA</th>
                            <th colSpan={2} className="px-4 py-2 text-center text-sm font-bold uppercase tracking-wider border border-white/20">MV</th>
                        </tr>
                        <tr className="bg-[#D4145A] text-white">
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Max</th>
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Max</th>
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Min</th>
                            <th className="px-4 py-2 text-center text-[10px] font-bold uppercase border border-white/20">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {PROPOSAL_DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 text-sm font-bold text-slate-100 border border-white/10">{row.modalidad}</td>
                                <td className="px-4 py-4 text-center text-sm text-sky-400 font-bold border border-white/10">{row.actualMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.actualMax}</td>
                                <td className="px-4 py-4 text-center text-sm text-pink-400 font-bold border border-white/10">{row.propMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.propMax}</td>
                                <td className="px-4 py-4 text-center text-sm text-emerald-400 font-bold border border-white/10">{row.mvMin}</td>
                                <td className="px-4 py-4 text-center text-sm text-slate-500 border border-white/10">{row.mvMax}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-pink-400 font-bold mb-2 uppercase text-xs tracking-widest">Resumen Estratégico</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Se propone un ajuste en las tasas de consumo para alinearlas con el costo de captación y mantener el margen de intermediación.
                        En vivienda, el ajuste busca mantener la competitividad mientras se gestiona el riesgo a largo plazo.
                    </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                        <span className="block text-4xl font-black text-white">+1,15%</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none">Incremento Promedio Propuesto</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
