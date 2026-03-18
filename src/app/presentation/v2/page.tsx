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
import CDATProposalMainTable from '@/components/presentation/CDATProposalMainTable';
import CDATRateMatrixTable from '@/components/presentation/CDATRateMatrixTable';
import HistoricalRatesV2Chart from '@/components/presentation/HistoricalRatesV2Chart';

// New Components for V2
import BenchmarkingSummaryTable from '@/components/presentation/BenchmarkingSummaryTable';
import CreditRateProposalSlide from '@/components/presentation/CreditRateProposalSlide';
import FinancialLeaderAttributionsSlide from '@/components/presentation/FinancialLeaderAttributionsSlide';
import CDATRateProposalSlide from '@/components/presentation/CDATRateProposalSlide';

export default function PresentationV2Page() {
    const { resetData, isLoading } = usePresentation();

    if (isLoading) return (
        <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white text-2xl font-bold animate-pulse">Cargando Presentación V2.0...</div>
        </div>
    );

    return (
        <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">

            {/* COVER SLIDE */}
            <section className="snap-start w-full h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#252525] border-b border-white/5">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative w-full max-w-3xl flex flex-col items-center text-center">
                    <img src="/logo-presente.png" alt="Presente" className="w-96 mb-12 drop-shadow-2xl" />
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500 mb-4 tracking-tighter uppercase whitespace-nowrap">
                        Comité de Precios
                    </h1>
                    <h2 className="text-3xl font-light text-slate-400 tracking-[0.3em] uppercase mb-12">VERSIÓN 2.0</h2>
                    <div className="h-1 w-64 bg-slate-800 rounded-full relative overflow-hidden">
                        <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-pink-600 shadow-[0_0_15px_rgba(212,20,90,0.8)]" />
                    </div>
                </motion.div>

                <div className="absolute bottom-12 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Desliza para comenzar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
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
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
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

            {/* NEW: CREDIT RATE PROPOSAL (Image 3) */}
            <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[95vh] rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-slate-900/40 backdrop-blur-3xl">
                    <CreditRateProposalSlide />
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

            {/* CDAT PROPOSAL (Original Tables) */}
            {[CDATProposalMainTable, CDATRateMatrixTable].map((Table, i) => (
                <section key={`cdat-prop-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
                        <Table />
                    </motion.div>
                </section>
            ))}

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
