import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

const AtribucionCard = ({ 
    item, 
    isEditing, 
    onUpdate 
}: { 
    item: any, 
    isEditing: boolean, 
    onUpdate: (field: string, value: string) => void 
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-pink-500/30 transition-all shadow-xl group"
    >
        <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-pink-500 flex items-center gap-3">
                <span className="w-10 h-10 flex items-center justify-center bg-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    {item.title === 'Consumo' ? '💰' : '🏠'}
                </span>
                {isEditing ? (
                    <input
                        className="bg-transparent border-b border-pink-500/30 focus:border-pink-500 outline-none px-2 py-1 text-pink-500"
                        value={item.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                    />
                ) : item.title}
            </h3>
            <div className="text-slate-200 text-lg leading-relaxed font-light">
                {isEditing ? (
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-pink-500 outline-none text-slate-200 min-h-[100px]"
                        value={item.description}
                        onChange={(e) => onUpdate('description', e.target.value)}
                    />
                ) : item.description}
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4 group-hover:bg-pink-600/5 transition-colors">
                <div className="text-xs font-bold text-pink-500 uppercase tracking-widest whitespace-nowrap">Tasa Mínima :</div>
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-400 font-mono font-bold"
                            value={item.formula || ''}
                            onChange={(e) => onUpdate('formula', e.target.value)}
                        />
                    ) : (
                        <div className="text-xl font-mono text-emerald-400 font-bold tracking-tight uppercase">
                            {item.formula}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

export default function FinancialLeaderAttributionsSlide() {
    const { data, updateSection, setGlobalEditing } = usePresentation();
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState<any[]>(data?.financialLeaderAttributions || []);

    useEffect(() => {
        if (!isEditing && data?.financialLeaderAttributions) {
            setLocalData(data.financialLeaderAttributions);
        }
    }, [data?.financialLeaderAttributions, isEditing]);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...localData];
        newData[index] = { ...newData[index], [field]: value };
        setLocalData(newData);
    };

    const handleSave = () => {
        updateSection('financialLeaderAttributions', localData);
        setIsEditing(false);
        setGlobalEditing(false);
    };

    const handleCancel = () => {
        setLocalData(data?.financialLeaderAttributions || []);
        setIsEditing(false);
        setGlobalEditing(false);
    };

    return (
        <div className="w-full h-full p-8 md:p-12 flex flex-col items-center bg-slate-950 text-white overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl flex justify-between items-start mb-12 shrink-0">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Atribuciones Líder Financiero</h1>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-pink-600/20"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsEditing(true); setGlobalEditing(true); }}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all border border-white/10"
                            >
                                Editar Textos
                            </button>
                        )}
                    </div>
                    <div className="h-1.5 w-48 bg-pink-600 rounded-full shadow-[0_0_20px_rgba(233,30,99,0.5)]" />
                </div>
                <div className="relative w-32 h-12 md:w-48 md:h-16 opacity-30">
                    <img src="/logo-presente.png" alt="Presente" className="object-contain w-full h-full brightness-0 invert" />
                </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col gap-6 md:gap-8 pb-12 shrink-0">
                {localData.map((item, index) => (
                    <AtribucionCard
                        key={item.id || index}
                        item={item}
                        isEditing={isEditing}
                        onUpdate={(field, value) => handleUpdate(index, field, value)}
                    />
                ))}
            </div>

            <p className="mt-16 text-slate-500 text-sm font-medium animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Propuesta de negociación autónoma bajo criterios de rentabilidad.
            </p>
        </div>
    );
}
