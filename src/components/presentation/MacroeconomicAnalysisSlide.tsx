'use client';

import React from 'react';
import { motion } from 'framer-motion';

const analysisPoints = [
    {
        title: "Salario Mínimo",
        phrase: "Salario a 2 millones exige captar liquidez inmediata.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        color: "from-pink-500 to-rose-600"
    },
    {
        title: "Inflación",
        phrase: "Inflación baja al 5% reactiva capacidad de ahorro.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a.515.515 0 0 0 .799-.037l7.03-10.33" />
            </svg>
        ),
        color: "from-emerald-500 to-teal-600"
    },
    {
        title: "Tasas BanRep",
        phrase: "Tasa BanRep al 9,25% presiona márgenes de colocación.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
        ),
        color: "from-orange-500 to-amber-600"
    },
    {
        title: "Mercado Laboral",
        phrase: "Desempleo histórico del 7% reduce riesgo de crédito.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.721 7.5 7.5 0 0 1-10.118 0 3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.926-9.418a3.976 3.976 0 0 0 5.18 0m5.18 0a3.976 3.976 0 0 1-5.18 0m5.18 0c.652.684 1.055 1.614 1.055 2.636 0 2.193-1.782 3.973-4 3.973s-4-1.78-4-3.973c0-1.022.403-1.952 1.055-2.636" />
            </svg>
        ),
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Proyección",
        phrase: "Crecimiento económico incentiva créditos de largo plazo.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.59 8.31m5.84 5.91a4.91 4.91 0 0 1-7.29 0l-.82-.82a4.91 4.91 0 0 1 0-7.29l.82-.82a4.91 4.91 0 0 1 7.29 0l.82.82Zm-4.96-.32a.75.75 0 0 1 1.06 0l2.32 2.32a.75.75 0 0 1-1.06 1.06l-2.32-2.32a.75.75 0 0 1 0-1.06ZM9 15.66v4.8M5.44 14.37v4.8" />
            </svg>
        ),
        color: "from-violet-500 to-fuchsia-600"
    }
];

export default function MacroeconomicAnalysisSlide() {
    return (
        <div className="w-full h-full flex flex-col items-center p-4 md:p-8 bg-slate-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col h-full justify-between py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center shrink-0"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                        Análisis <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Macroeconómico</span>
                    </h2>
                    <div className="h-1 w-24 bg-pink-600 mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 flex-1 items-center content-center">
                    {analysisPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative h-full max-h-[280px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110 rounded-3xl -z-10 bg-white/5"></div>

                            <div className="h-full bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-3xl flex flex-col items-center text-center hover:border-pink-500/50 transition-all duration-300 shadow-2xl justify-center">
                                <div className={`mb-4 p-3 rounded-2xl bg-gradient-to-br ${point.color} text-white shadow-lg shadow-pink-500/10 group-hover:scale-110 transition-transform duration-300`}>
                                    {point.icon}
                                </div>

                                <h4 className="text-[10px] uppercase font-black tracking-widest text-pink-500 mb-3 px-2 py-0.5 bg-pink-500/5 rounded-full border border-pink-500/10">
                                    {point.title}
                                </h4>

                                <p className="text-sm md:text-base font-medium text-slate-200 leading-snug balance">
                                    {point.phrase}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex justify-center items-center gap-6 opacity-40 shrink-0"
                >
                    <img src="/logo-presente.png" alt="Presente" className="h-8 object-contain grayscale invert" />
                    <div className="h-6 w-px bg-white/20"></div>
                    <p className="text-white font-medium tracking-widest text-xs uppercase">Comité de Precios 2025</p>
                </motion.div>
            </div>
        </div>
    );
}
