'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-4 w-1 bg-pink-600 rounded-full" />
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
    </div>
);



// Wait, the table structure is slightly different for each. Let me refine it.

const CreditTable = ({ title, data }: { title: string, data: any[] }) => (
    <div className="flex flex-col mb-6">
        <SectionHeader title={title} />
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 shadow-lg">
            <table className="w-full border-collapse">
                <thead className="bg-[#880E4F]">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Modalidad</th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Actual NAMV</th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Propuesta NAMV</th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Propuesta EA</th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">MV</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-800/20">
                    {data.map((row, i) => (
                        <motion.tr 
                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            key={i} 
                            className="transition-all"
                        >
                            <td className="px-4 py-2.5 text-[11px] font-medium text-slate-200 border-r border-white/5">{row.modalidad}</td>
                            <td className="px-4 py-2.5 text-center text-[11px] text-slate-400 border-r border-white/5">{row.actual}</td>
                            <td className="px-4 py-2.5 text-center text-[11px] text-amber-400 font-bold border-r border-white/5">{row.propuesta}</td>
                            <td className="px-4 py-2.5 text-center text-[11px] text-emerald-400 font-bold border-r border-white/5">{row.ea}</td>
                            <td className="px-4 py-2.5 text-center text-[11px] text-sky-400 font-bold">{row.mv}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default function CreditRateProposalSlide() {
    return (
        <div className="w-full h-full p-8 flex flex-col items-center bg-slate-950 text-white overflow-y-auto">
            <div className="w-full max-w-7xl flex justify-between items-start mb-12">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Propuesta cambio de tasas crédito</h1>
                    <div className="h-1 w-32 bg-pink-600 rounded-full" />
                </div>
                <img src="/logo-presente.png" alt="Presente" className="h-12 object-contain brightness-0 invert opacity-40" />
            </div>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column */}
                <div className="space-y-8">
                    <CreditTable 
                        title="Aumentar la tasa mínima de consumo"
                        data={[
                            { modalidad: 'SOAT', actual: '20,8810%', propuesta: '22,00%', ea: '24,36%', mv: '1,83%' },
                            { modalidad: 'Libre Inversión', actual: '20,8810%', propuesta: '22,00%', ea: '24,36%', mv: '1,83%' },
                            { modalidad: 'Viajes', actual: '20,8810%', propuesta: '22,00%', ea: '24,36%', mv: '1,83%' },
                            { modalidad: 'Educación, Calamidad, Salud y Emp.', actual: '11,3866%', propuesta: '12,00%', ea: '12,68%', mv: '1,00%' },
                            { modalidad: 'Centro Vacacionales', actual: '14,0579%', propuesta: '14,50%', ea: '15,50%', mv: '1,21%' },
                        ]}
                    />

                    <CreditTable 
                        title="Cambio de tasas compra de cartera"
                        data={[
                            { modalidad: 'Tasa Mínima', actual: '15,02%', propuesta: '15,50%', ea: '16,650%', mv: '1,29%' },
                            { modalidad: 'Tasa Máxima', actual: '18,00%', propuesta: '18,50%', ea: '20,152%', mv: '1,54%' },
                        ]}
                    />

                    <CreditTable 
                        title="Cambio de tasas línea de vehículo"
                        data={[
                            { modalidad: 'Tasa Mínima', actual: '14,0579%', propuesta: '15,5000%', ea: '16,650%', mv: '1,29%' },
                            { modalidad: 'Tasa Máxima', actual: '15,8035%', propuesta: '17,5000%', ea: '18,974%', mv: '1,46%' },
                        ]}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <CreditTable 
                        title="Aumentar la tasa de vivienda"
                        data={[
                            { modalidad: 'Vivienda VIS', actual: '11,7465%', propuesta: '12,9886%', ea: '13,790%', mv: '1,08%' },
                            { modalidad: 'Vivienda No Vis', actual: '11,9260%', propuesta: '13,2886%', ea: '14,129%', mv: '1,11%' },
                        ]}
                    />

                    <CreditTable 
                        title="Modalidad Plan Mi Casa"
                        data={[
                            { modalidad: 'Plan Mi Casa VIS', actual: '11,6308%', propuesta: '12,3886%', ea: '13,117%', mv: '1,03%' },
                            { modalidad: 'Plan Mi Casa No VIS', actual: '11,7465%', propuesta: '12,7886%', ea: '13,566%', mv: '1,07%' },
                        ]}
                    />

                    <CreditTable 
                        title="Aumentar la tasa de Hipotecario Otro Usos"
                        data={[
                            { modalidad: '0-5 Años', actual: '14,93%', propuesta: '15,30%', ea: '16,420%', mv: '1,28%' },
                            { modalidad: '5-10 Años', actual: '15,51%', propuesta: '15,88%', ea: '17,088%', mv: '1,32%' },
                            { modalidad: '10-15 Años', actual: '16,09%', propuesta: '16,46%', ea: '17,760%', mv: '1,37%' },
                            { modalidad: '15-20 Años', actual: '16,67%', propuesta: '17,04%', ea: '18,436%', mv: '1,42%' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
