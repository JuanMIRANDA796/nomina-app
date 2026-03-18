'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TABLE_DATA = [
    { mes: 'Diciembre', segmento: 'Hasta 1 SMLV', entidades: 25, monto: '$54.01 mil M', desembolsos: '80.130', tasaProm: '45,64%', tasaPresente: '22,59%', variacion: '↑ 23,05%' },
    { mes: 'Diciembre', segmento: 'De 1 a 3 SMLV', entidades: 32, monto: '$130.91 mil M', desembolsos: '45.578', tasaProm: '22,76%', tasaPresente: '22,49%', variacion: '↑ 0,27%' },
    { mes: 'Diciembre', segmento: 'De 6 a 12 SMLV', entidades: 32, monto: '$506.65 mil M', desembolsos: '42.609', tasaProm: '22,31%', tasaPresente: '20,96%', variacion: '↑ 1,35%' },
    { mes: 'Diciembre', segmento: 'De 12 a 25 SMLV', entidades: 32, monto: '$673.13 mil M', desembolsos: '27.427', tasaProm: '21,26%', tasaPresente: '18,95%', variacion: '↑ 2,31%' },
    { mes: 'Diciembre', segmento: 'Consumo - Todos los montos', entidades: 34, monto: '$3,42 bill.', desembolsos: '313.737', tasaProm: '21,69%', tasaPresente: '19,02%', variacion: '↑ 2,67%' },
    { mes: 'Diciembre', segmento: 'Vivienda VIS - Hasta 20 años', entidades: 16, monto: '$758.78 mil M', desembolsos: '7.248', tasaProm: '12,42%', tasaPresente: '10,93%', variacion: '↑ 1,49%' },
    { mes: 'Diciembre', segmento: 'vivienda VIS - Todos los plazos', entidades: 16, monto: '$838.45 mil M', desembolsos: '8.577', tasaProm: '12,39%', tasaPresente: '10,95%', variacion: '↑ 1,44%' },
    { mes: 'Enero', segmento: 'Hasta 1 SMLV', entidades: 23, monto: '$82.54 mil M', desembolsos: '112.958', tasaProm: '42,38%', tasaPresente: '22,86%', variacion: '↑ 19,52%' },
    { mes: 'Enero', segmento: 'De 1 a 3 SMLV', entidades: 29, monto: '$202.00 mil M', desembolsos: '58.763', tasaProm: '22,70%', tasaPresente: '22,47%', variacion: '↑ 0,23%' },
    { mes: 'Enero', segmento: 'De 6 a 12 SMLV', entidades: 31, monto: '$624.48 mil M', desembolsos: '42.333', tasaProm: '22,02%', tasaPresente: '20,95%', variacion: '↑ 1,07%' },
    { mes: 'Enero', segmento: 'De 12 a 25 SMLV', entidades: 30, monto: '$793.60 mil M', desembolsos: '26.896', tasaProm: '21,14%', tasaPresente: '19,72%', variacion: '↑ 1,42%' },
    { mes: 'Enero', segmento: 'Consumo - Todos los montos', entidades: 33, monto: '$4,13 bill.', desembolsos: '379.074', tasaProm: '21,80%', tasaPresente: '20,50%', variacion: '↑ 1,30%' },
    { mes: 'Enero', segmento: 'Vivienda VIS - Hasta 20 años', entidades: 16, monto: '$816.23 mil M', desembolsos: '7.821', tasaProm: '12,43%', tasaPresente: '11,01%', variacion: '↑ 1,42%' },
    { mes: 'Enero', segmento: 'vivienda VIS - Todos los plazos', entidades: 16, monto: '$905.80 mil M', desembolsos: '9.356', tasaProm: '12,39%', tasaPresente: '10,96%', variacion: '↑ 1,43%' },
    { mes: 'Febrero', segmento: 'Hasta 1 SMLV', entidades: 25, monto: '$66.29 mil M', desembolsos: '93.695', tasaProm: '41,48%', tasaPresente: '19,01%', variacion: '↑ 22,47%' },
    { mes: 'Febrero', segmento: 'De 1 a 3 SMLV', entidades: 30, monto: '$179.75 mil M', desembolsos: '50.623', tasaProm: '23,36%', tasaPresente: '22,85%', variacion: '↑ 0,51%' },
    { mes: 'Febrero', segmento: 'De 6 a 12 SMLV', entidades: 32, monto: '$601.51 mil M', desembolsos: '39.444', tasaProm: '22,61%', tasaPresente: '21,40%', variacion: '↑ 1,21%' },
    { mes: 'Febrero', segmento: 'De 12 a 25 SMLV', entidades: 29, monto: '$730.60 mil M', desembolsos: '24.262', tasaProm: '21,50%', tasaPresente: '19,26%', variacion: '↑ 2,24%' },
    { mes: 'Febrero', segmento: 'Consumo - Todos los montos', entidades: 33, monto: '$3,79 bill.', desembolsos: '328.641', tasaProm: '22,23%', tasaPresente: '20,37%', variacion: '↑ 1,86%' },
    { mes: 'Febrero', segmento: 'Vivienda VIS - Hasta 20 años', entidades: 16, monto: '$715.29 mil M', desembolsos: '6.786', tasaProm: '12,76%', tasaPresente: '11,04%', variacion: '↑ 1,72%' },
    { mes: 'Febrero', segmento: 'vivienda VIS - Todos los plazos', entidades: 16, monto: '$797.10 mil M', desembolsos: '8.169', tasaProm: '12,71%', tasaPresente: '11,04%', variacion: '↑ 1,67%' },
];

export default function BenchmarkingSummaryTable() {
    const [selectedMonth, setSelectedMonth] = useState('Febrero');
    const filteredData = TABLE_DATA.filter(row => row.mes === selectedMonth);

    return (
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Resumen Benchmarking</h2>
                    <p className="text-slate-400 mt-1">Comparativo de tasas y montos por segmento</p>
                </div>
                
                <div className="flex bg-slate-800 p-1 rounded-xl border border-white/10">
                    {['Diciembre', 'Enero', 'Febrero'].map((month) => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                selectedMonth === month 
                                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-black/30">
                <table className="w-full border-collapse">
                    <thead className="bg-[#D4145A] sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Segmento de Crédito</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Entidades</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Monto Total</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Desembolsos</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Tasa Prom. EA</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Tasa Presente (ea)</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Variación vs Prom.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-[11px] font-medium text-slate-100">{row.segmento}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-sky-400 font-bold">{row.entidades}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-orange-400 font-bold">{row.monto}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-slate-300">{row.desembolsos}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-slate-300">{row.tasaProm}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-emerald-400 font-bold">{row.tasaPresente}</td>
                                <td className="px-4 py-3 text-center text-[11px] font-bold text-emerald-500">{row.variacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
