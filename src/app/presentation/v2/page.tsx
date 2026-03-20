'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';
import ReferenceRatesChart from '@/components/presentation/ReferenceRatesChart';
import InflationVsRepoChart from '@/components/presentation/InflationVsRepoChart';
import PortfolioStockRatesChart from '@/components/presentation/PortfolioStockRatesChart';
import DisbursementRatesChart from '@/components/presentation/DisbursementRatesChart';
import MonthlyDisbursementsChart from '@/components/presentation/MonthlyDisbursementsChart';
import PortfolioBalanceByLineChart from '@/components/presentation/PortfolioBalanceByLineChart';
import BenchmarkingViviendaVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaVisHasta20Chart';
import BenchmarkingViviendaNoVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaNoVisHasta20Chart';
import BenchmarkingCDATsTable from '@/components/presentation/BenchmarkingCDATsTable';
import EarlyCancellationsChart from '@/components/presentation/EarlyCancellationsChart';
import TotalLiabilitiesBalanceChart from '@/components/presentation/TotalLiabilitiesBalanceChart';
import TPPCaptacionSaldosChart from '@/components/presentation/TPPCaptacionSaldosChart';
import MacroeconomicAnalysisSlide from '@/components/presentation/MacroeconomicAnalysisSlide';
import HistoricalRatesV2Chart from '@/components/presentation/HistoricalRatesV2Chart';

// New Components for V2
import BenchmarkingSummaryTable from '@/components/presentation/BenchmarkingSummaryTable';
import CreditRateProposalSlide from '@/components/presentation/CreditRateProposalSlide';
import FinancialLeaderAttributionsSlide from '@/components/presentation/FinancialLeaderAttributionsSlide';
import CDATRateProposalSlide from '@/components/presentation/CDATRateProposalSlide';
import CreditRateProposalSummaryTable from '@/components/presentation/CreditRateProposalSummaryTable';

export default function PresentationV2Page() {
    const { data, updateSection, resetData, isLoading } = usePresentation();
    const [isEditingCover, setIsEditingCover] = useState(false);

    if (isLoading) return (
        <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white text-2xl font-bold animate-pulse">Cargando Presentación V2.0...</div>
        </div>
    );

    return (
        <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">
            <title>Link</title>

            {/* COVER SLIDE */}
            <section className="snap-start w-full h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#D4145A] via-[#E91E63] to-[#FBB03B]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative w-full max-w-3xl flex flex-col items-center"
                >
                    <div className="relative w-96 h-48 md:w-[600px] md:h-[300px]">
                        <img
                            src="/logo-presente.png"
                            alt="Presente Fondo de Empleados"
                            className="object-contain w-full h-full drop-shadow-xl"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-8 text-center relative group"
                    >
                        <h2 className="text-2xl md:text-3xl font-light tracking-widest text-white/90 uppercase">
                            {data.metadata.title}
                        </h2>
                        <p className="text-xl text-white/80 mt-2 font-medium">
                            {data.metadata.subtitle}
                        </p>

                        <button
                            onClick={() => setIsEditingCover(true)}
                            className="absolute -top-4 -right-8 p-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>

                {/* EDIT COVER MODAL */}
                <AnimatePresence>
                    {isEditingCover && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8"
                        >
                            <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6">Editar Portada</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título Principal</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-500"
                                            value={data.metadata.title}
                                            onChange={(e) => updateSection('metadata', { ...data.metadata, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subtítulo / Fecha</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-500"
                                            value={data.metadata.subtitle}
                                            onChange={(e) => updateSection('metadata', { ...data.metadata, subtitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setIsEditingCover(false)}
                                        className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-2xl font-bold shadow-lg shadow-pink-600/20 transition-all hover:scale-105"
                                    >
                                        Guardar y Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-12 text-white/80"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </motion.div>
            </section>

            {/* SLIDE: MACROECONOMIC ANALYSIS */}
            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full h-full">
                    <MacroeconomicAnalysisSlide />
                </motion.div>
            </section>

            {/* CHART: TES & HISTORICAL */}
            {[HistoricalRatesV2Chart, ReferenceRatesChart, InflationVsRepoChart, PortfolioStockRatesChart, DisbursementRatesChart, MonthlyDisbursementsChart, PortfolioBalanceByLineChart].map((Chart, i) => (
                <section key={`chart-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
                        <Chart />
                    </motion.div>
                </section>
            ))}

            {/* NEW: BENCHMARKING SUMMARY TABLE (Image 2) */}
            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[95vh] flex flex-col">
                    <BenchmarkingSummaryTable />
                </motion.div>
            </section>

            {/* BENCHMARKING VIVIENDA PESOS (KEPT) */}
            {[BenchmarkingViviendaVisHasta20Chart, BenchmarkingViviendaNoVisHasta20Chart].map((Chart, i) => (
                <section key={`viv-p-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                    <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
                        <Chart />
                    </motion.div>
                </section>
            ))}

            {/* LIABILITIES & SAVINGS */}
            {[TotalLiabilitiesBalanceChart, EarlyCancellationsChart, TPPCaptacionSaldosChart].map((Chart, i) => (
                <section key={`liab-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
                        <Chart />
                    </motion.div>
                </section>
            ))}

            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
                    <BenchmarkingCDATsTable />
                </motion.div>
            </section>

            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[95vh] rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-slate-900/40 backdrop-blur-3xl">
                    <CreditRateProposalSlide />
                </motion.div>
            </section>

            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
                    <CreditRateProposalSummaryTable />
                </motion.div>
            </section>

            {/* NEW: ATTRIBUTIONS (Image 4) */}
            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
                    <FinancialLeaderAttributionsSlide />
                </motion.div>
            </section>

            {/* NEW: CDAT RATE PROPOSAL (Image 5) */}
            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
                    <CDATRateProposalSlide />
                </motion.div>
            </section>


            <div className="fixed bottom-8 right-8 z-[100] flex gap-4">
                <button
                    onClick={resetData}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all text-xs font-bold backdrop-blur-xl shadow-2xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Restablecer
                </button>
            </div>

        </main>
    );
}
