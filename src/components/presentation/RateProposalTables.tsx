'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function RateProposalTables() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.rateProposal;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (section: string, index: number, field: string, value: string) => {
        const newData = { ...data };
        const sectionData = [...(data as any)[section]];
        sectionData[index] = { ...sectionData[index], [field]: parseFloat(value) || 0 };
        (newData as any)[section] = sectionData;
        updateSection('rateProposal', newData);
    };

    const SmallTable = ({ title, section, columns, labelKey }: { title: string, section: string, columns: string[], labelKey: string }) => (
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex flex-col h-full">
            <h4 className="text-sm font-bold text-pink-500 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-pink-500 rounded-full"></div>
                {title}
            </h4>
            <div className="overflow-hidden rounded-lg border border-white/10 flex-1">
                <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#D4145A] text-white">
                        <tr>
                            <th className="px-3 py-2 border border-white/10">{labelKey === 'modalidad' ? 'Modalidad' : (labelKey === 'label' ? 'Condición' : 'Años')}</th>
                            <th className="px-3 py-2 border border-white/10 text-center">E.A.</th>
                            <th className="px-3 py-2 border border-white/10 text-center">N.A.M.V.</th>
                            <th className="px-3 py-2 border border-white/10 text-center">M.V.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data as any)[section].map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-3 py-2 border border-white/10 text-white font-medium bg-white/5">{row[labelKey]}</td>
                                {['ea', 'namv', 'mv'].map(field => (
                                    <td key={field} className="px-3 py-2 border border-white/10 text-center">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none rounded p-0.5"
                                                value={row[field] ?? ''}
                                                onChange={(e) => handleUpdate(section, idx, field, e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-slate-300">
                                                {Number(row[field]).toFixed(field === 'mv' ? 2 : 4)}%
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col p-6 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        Propuesta Cambio de Tasas
                    </h3>
                    <p className="text-pink-500 font-medium">Estrategia Comercial Diciembre 2025</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-xl ${isEditing ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 border border-white/10'}`}
                >
                    {isEditing ? '✓ Guardar Cambios' : '✎ Modificar Propuesta'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 overflow-auto pr-2 custom-scrollbar">
                <div className="col-span-2">
                    <SmallTable title="Aumentar la tasa mínima de consumo" section="consumo" columns={['ea', 'namv', 'mv']} labelKey="modalidad" />
                </div>
                <div className="col-span-1">
                    <SmallTable title="Cambio de tasas compra de cartera" section="compra_cartera" columns={['ea', 'namv', 'mv']} labelKey="label" />
                </div>
                <div className="col-span-1">
                    <SmallTable title="Cambio de tasas línea de vehículo" section="vehiculo" columns={['ea', 'namv', 'mv']} labelKey="label" />
                </div>
                <div className="col-span-1">
                    <SmallTable title="Aumentar la tasa de vivienda" section="vivienda" columns={['ea', 'namv', 'mv']} labelKey="modalidad" />
                </div>
                <div className="col-span-1">
                    <SmallTable title="Aumentar la tasa de Hipotecario Otro Usos" section="hipotecario_otros" columns={['ea', 'namv', 'mv']} labelKey="years" />
                </div>
            </div>
        </div>
    );
}
